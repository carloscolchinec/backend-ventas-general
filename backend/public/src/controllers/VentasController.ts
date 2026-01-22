import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Venta } from '../models/Venta';
import { Cliente } from '../models/Cliente';
import { InformacionContacto } from '../models/InformacionContacto';
import { InformacionDomicilio } from '../models/InformacionDomicilio';
import { InformacionDocumentos } from '../models/InformacionDocumentos';
import { InformacionBeneficiarioAdicional } from '../models/InformacionBeneficiarioAdicional';
import { InformacionServiciosContratados } from '../models/InformacionServiciosContratados';
import { sequelize } from '../server';
import { LaravelApiService } from '../services/LaravelApiService'; // Import API Service
import path from 'path';

export class VentasController {

    static async store(req: Request, res: Response) {
        const t = await sequelize.transaction();

        try {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            const body = req.body;

            console.log('📝 Raw Body Recibido:', JSON.stringify(body, null, 2));

            // --- 1. Helper Parsers ---
            const parseJson = (field: any) => {
                if (!field) return null;
                if (typeof field === 'string') {
                    try {
                        return JSON.parse(field);
                    } catch (e) {
                        // Don't warn yet, might be a raw ID or Name string we handle later
                        return field;
                    }
                }
                return field;
            };

            const getFilename = (fieldname: string) => files[fieldname] ? files[fieldname][0].filename : null;

            // --- 2. Cliente Management ---
            let cliente = await Cliente.findOne({ where: { identificacion: body.identificacion }, transaction: t });

            if (!cliente) {
                cliente = await Cliente.create({
                    nombres: body.nombres,
                    apellidos: body.apellidos,
                    identificacion: body.identificacion,
                    fecha_nacimiento: body.fecha_nacimiento,
                    es_tercera_edad: body.es_tercera_edad === 'true' || body.es_tercera_edad === true,
                    es_presenta_discapacidad: body.es_presenta_discapacidad === 'true' || body.es_presenta_discapacidad === true,
                    es_jubilado: body.es_jubilado === 'true' || body.es_jubilado === true,
                }, { transaction: t });
            }

            // --- 3. Sale Code Generation ---
            let serieContrato = '';
            const suffix = Date.now().toString().slice(-6);
            serieContrato = `COT-${body.identificacion}-${suffix}`;

            // --- 4. Create Venta ---
            const nuevaVenta = await Venta.create({
                cliente_id: cliente.id_cliente,
                id_vendedor: (req as any).user ? (req as any).user.id_usuario : null,
                serie_contrato: serieContrato,
                tipo_contrato: body.tipo_contrato || 'ISP',
                sede_contrato: body.sede_contrato || body.establecimiento || 'MATRIZ',
                fecha_venta: new Date(),
                estado: 'PENDIENTE',
            }, { transaction: t });

            // --- FILE ORGANIZATION START ---
            const fs = require('fs');

            // Base paths
            const publicDir = path.join(__dirname, '../../public');
            const defaultUploadDir = path.join(publicDir, 'assets/images/ventas');
            const contractDir = path.join(publicDir, 'contratos', serieContrato);
            const beneficiaryDir = path.join(contractDir, 'beneficiario');

            // Ensure contract dirs exist
            if (!fs.existsSync(contractDir)) fs.mkdirSync(contractDir, { recursive: true });

            // Helper to move file and return DB path
            const processFile = (fieldname: string, isBeneficiary = false): string | null => {
                const filename = files[fieldname] ? files[fieldname][0].filename : null;
                if (!filename) return null;

                const oldPath = path.join(defaultUploadDir, filename);
                const targetDir = isBeneficiary ? beneficiaryDir : contractDir;

                // Create subfolder if needed (lazy create for beneficiary)
                if (isBeneficiary && !fs.existsSync(beneficiaryDir)) {
                    fs.mkdirSync(beneficiaryDir, { recursive: true });
                }

                const newPath = path.join(targetDir, filename);

                try {
                    if (fs.existsSync(oldPath)) {
                        fs.renameSync(oldPath, newPath);
                        // Return relative path for DB: e.g. "contratos/COT-123/img.jpg"
                        const relativeDir = isBeneficiary ? `contratos/${serieContrato}/beneficiario` : `contratos/${serieContrato}`;
                        return `${relativeDir}/${filename}`;
                    }
                } catch (e) {
                    console.error(`Error moving file ${filename}:`, e);
                    // Fallback: return just filename if move failed (or original logic)
                    return filename;
                }
                return filename;
            };
            // --- FILE ORGANIZATION END ---

            // --- 5. Create Infos (Satellites) ---

            // 5.1 Info Contacto
            // Ensure array type even if parsing fails
            let telefonosParsed = parseJson(body.telefonos);
            let correosParsed = parseJson(body.correos);
            if (!Array.isArray(telefonosParsed)) telefonosParsed = telefonosParsed ? [telefonosParsed] : [];
            if (!Array.isArray(correosParsed)) correosParsed = correosParsed ? [correosParsed] : [];

            await InformacionContacto.create({
                venta_id: nuevaVenta.id_venta,
                telefonos: telefonosParsed,
                correos: correosParsed
            }, { transaction: t });

            // 5.2 Info Domicilio
            await InformacionDomicilio.create({
                venta_id: nuevaVenta.id_venta,
                direccion: body.direccion,
                referencia_domiciliaria: body.referencia_domiciliaria,
                ciudad: body.ciudad,
                provincia: body.provincia,
                latitud: body.latitud,
                longitud: body.longitud
            }, { transaction: t });

            // 5.3 Info Documentos
            const documentosJson = {
                cedula_frontal: processFile('cedula_frontal'),
                cedula_trasera: processFile('cedula_trasera'),
                planilla_luz: processFile('planilla_luz'),
                firma: processFile('firma')
            };

            await InformacionDocumentos.create({
                venta_id: nuevaVenta.id_venta,
                documentos: documentosJson
            }, { transaction: t });

            // 5.4 Info Servicios Contratados (HYDRATION LOGIC)
            let planRaw = parseJson(body.plan_contratado || body.plan);
            let serviciosRaw = parseJson(body.servicios_adicionales);

            console.log('🧐 Hydrating Plan. Raw:', planRaw, 'Type:', typeof planRaw);

            // --- Hydrate Plan ---
            let planFinal = planRaw || {};

            // Logic: If it's NOT a full object (i.e. string, number, or object without id_plan), try to hydrate it.
            const isPlanObject = planRaw && typeof planRaw === 'object' && !Array.isArray(planRaw) && planRaw.id_plan;

            if (planRaw && !isPlanObject) {
                try {
                    // Fetch ALL planes to search
                    const allPlanes = await LaravelApiService.getPlanes({});
                    const norm = (s: any) => String(s).trim().toUpperCase();
                    const listaPlanes = Array.isArray(allPlanes) ? allPlanes : (allPlanes.data || []);

                    console.log(`📋 Catalog loaded. ${listaPlanes.length} plans.`);

                    const found = listaPlanes.find((p: any) =>
                        norm(p.id_plan) === norm(planRaw) || norm(p.nombre_plan) === norm(planRaw)
                    );

                    if (found) {
                        // Extract only relevant fields as requested by user
                        const {
                            id_plan,
                            nombre_plan,
                            tipo_plan,
                            descripcion_plan,
                            mb_subida,
                            mb_bajada,
                            precio,
                            nivel_comparticion,
                            tipo_red
                        } = found;

                        planFinal = {
                            id_plan,
                            nombre_plan,
                            tipo_plan,
                            descripcion_plan,
                            mb_subida,
                            mb_bajada,
                            precio,
                            nivel_comparticion,
                            tipo_red
                        };
                        console.log('✅ Plan hydrated and filtered:', found.nombre_plan);
                    } else {
                        console.warn('⚠️ Plan ' + planRaw + ' not found in catalog.');
                        // Ensure we save *something*
                        if (typeof planRaw !== 'object') {
                            planFinal = { reference: planRaw, error: 'Not found in catalog' };
                        }
                    }
                } catch (err) {
                    console.error('❌ Error hydrating plan:', err);
                }
            } else if (isPlanObject) {
                console.log('✅ Plan received is already a full object.');
            } else {
                console.warn('❌ Plan raw is null/undefined');
            }

            // --- Hydrate Servicios Adicionales ---
            let serviciosFinal: any[] = [];
            if (Array.isArray(serviciosRaw)) {
                // If array of objects, assume good. If array of primitives (IDs/Strings), hydrate.
                const needsHydration = serviciosRaw.some(s => typeof s !== 'object');

                if (needsHydration) {
                    try {
                        const allServicios = await LaravelApiService.getServiciosAdicionales();
                        const listaServicios = Array.isArray(allServicios) ? allServicios : (allServicios || []);

                        serviciosFinal = serviciosRaw.map(sItem => {
                            if (typeof sItem === 'object') return sItem;
                            const found = listaServicios.find((cat: any) => cat.id == sItem || cat.codigo == sItem);
                            return found || { id: sItem, note: 'Service detail not found' };
                        });
                        console.log('✅ Servicios hydrated.');
                    } catch (err) {
                        console.error('Error hydrating servicios:', err);
                        serviciosFinal = serviciosRaw.map(s => ({ id: s, error: 'Hydration failed' }));
                    }
                } else {
                    serviciosFinal = serviciosRaw;
                }
            }

            // --- Hydrate Payment Info ---
            let pagoFinal: any = {};
            const metodoCodigo = body.codigo_metodo; // e.g. FP01, FP02, FP03, FP04

            pagoFinal.metodo = body.metodo_pago || body.metodos_pago || 'Desconocido';
            pagoFinal.codigo_metodo = metodoCodigo;
            pagoFinal.dia_pago = body.dia_pago; // Save day 10/20

            if (metodoCodigo === 'FP04' || String(body.metodo_pago).toUpperCase().includes('DEBITO')) {
                // Débito Bancario
                pagoFinal.detalle = {
                    banco_id: body.tipo_banco_id,
                    banco_nombre: body.banco, // Front sends 'banco' name sometimes
                    tipo_cuenta: body.tipo_cuenta, // AHORRO / CORRIENTE
                    numero_cuenta: body.cuenta_numero_enc // Encrypted or masked
                };
            } else if (metodoCodigo === 'FP03' || String(body.metodo_pago).toUpperCase().includes('CREDITO')) {
                // Tarjeta de Crédito
                pagoFinal.detalle = {
                    tarjeta_numero: body.tarjeta_numero_enc, // Encrypted
                    tarjeta_exp: body.tarjeta_exp,
                    tarjeta_last4: body.tarjeta_last4
                };
            } else if (metodoCodigo === 'FP02' || String(body.metodo_pago).toUpperCase().includes('DEPOSITO') || String(body.metodo_pago).toUpperCase().includes('TRANSFERENCIA')) {
                // Depósito / Transferencia
                // Usually just the method name is enough found in pagoFinal.metodo
                pagoFinal.detalle = {
                    nota: 'Pago mediante depósito o transferencia'
                };
            } else {
                // Efectivo or others
                pagoFinal.detalle = {
                    nota: 'Pago en efectivo'
                };
            }

            // 5.4 Write to DB
            await InformacionServiciosContratados.create({
                venta_id: nuevaVenta.id_venta,
                plan_contratado: planFinal,
                servicios_adicionales: serviciosFinal,
                informacion_pago: pagoFinal
            }, { transaction: t });

            // 5.5 Info Beneficiario
            // 5.5 Info Beneficiario
            if (body.tiene_beneficiario === 'true' || body.tiene_beneficiario === true) {
                // Collect beneficiary files
                const benDocs = {
                    cedula_frontal: getFilename('beneficiario_cedula_frontal'),
                    cedula_trasera: getFilename('beneficiario_cedula_trasera'),
                    carnet: getFilename('beneficiario_carnet'),
                };

                await InformacionBeneficiarioAdicional.create({
                    venta_id: nuevaVenta.id_venta,
                    identificacion: body.beneficiario_identificacion,
                    nombres: body.beneficiario_nombres,
                    // Note: frontend sends full name in 'nombres' or split?
                    // Usually 'beneficiario_nombres' and 'beneficiario_apellidos' should be separate if possible,
                    // but if frontend sends everything in nombres/apellidos fields check them.
                    // Assuming body has them if they were separate in older logic, relying on what's available.
                    // If frontend sends individual fields:
                    apellidos: body.beneficiario_apellidos || '',
                    porcentaje: body.beneficiario_porcentaje || 100,

                    cedula_frontal: processFile('beneficiario_cedula_frontal', true),
                    cedula_trasera: processFile('beneficiario_cedula_trasera', true),
                    carnet: processFile('beneficiario_carnet', true)
                }, { transaction: t });
            }

            await t.commit();

            // --- 10. Automate PDF Generation & Send Email ---
            // Trigger logic: Call local endpoint to generate, save, and email the PDF
            try {
                const port = process.env.PORT || 3150;
                // Use 127.0.0.1 for reliability within server context
                // Route defined in app.ts is: app.use('/pdf', ... ) -> pdfRoutes: router.get('/contrato/:serie', ...)
                const pdfTriggerUrl = `http://127.0.0.1:${port}/pdf/contrato/${serieContrato}`;
                
                console.log(`🚀 [Auto-Job] Triggering PDF & Email via: ${pdfTriggerUrl}`);
                
                // Fire and forget (or handle promise in background)
                const axios = require('axios');
                axios.get(pdfTriggerUrl)
                    .then((resp: any) => console.log(`✅ [Auto-Job] PDF Process Completed for ${serieContrato}. Status: ${resp.status}`))
                    .catch((err: any) => {
                        const errMsg = err.response ? `Status ${err.response.status}` : err.message;
                        console.error(`❌ [Auto-Job] Failed for ${serieContrato}:`, errMsg);
                    });

            } catch (jobErr) {
                console.error('⚠️ Error initializing auto-pdf job:', jobErr);
            }

            // --- 6. Response ---
            const ventaCompleta = await Venta.findByPk(nuevaVenta.id_venta, {
                include: [Cliente, InformacionContacto, InformacionDomicilio, InformacionServiciosContratados]
            });

            return res.status(201).json({
                message: 'Venta registrada exitosamente',
                venta: ventaCompleta
            });

        } catch (error: any) {
            await t.rollback();
            console.error('Error creating sale:', error);
            return res.status(500).json({
                message: 'Error al registrar la venta.',
                error: error.message
            });
        }
    }

    // GET /ventas
    static async index(req: Request, res: Response) {
        try {
            const ventas = await Venta.findAll({
                include: [Cliente, InformacionContacto, InformacionServiciosContratados],
                order: [['fecha_creacion', 'DESC']],
                limit: 50
            });

            // quiero ver los datos que obtiene ventas
            // Encabezado para distinguir el log
            console.log('📦 DATA VENTAS (JSON):');
            console.log(JSON.stringify(ventas, null, 2));
            return res.json({ ventas });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al listar ventas' });
        }
    }

    // GET /ventas/estadisticas
    static async estadisticas(req: Request, res: Response) {
        try {
            // Stats by Date
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);

            // Resumen del Día (Total ventas hoy del usuario actual)
            const userId = (req as any).user ? (req as any).user.id_usuario : null;

            const baseWhere: any = {
                fecha_creacion: {
                    [Op.gte]: todayStart
                }
            };

            if (userId) {
                baseWhere.id_vendedor = userId;
            }

            // Breakdown by status
            const pendientes = await Venta.count({
                where: { ...baseWhere, estado: 'PENDIENTE' }
            });

            const rechazados = await Venta.count({
                where: { ...baseWhere, estado: 'RECHAZADO' }
            });

            // 'En instalación' usually means validated/approved sales that are in process
            const enInstalacion = await Venta.count({
                where: {
                    ...baseWhere,
                    estado: { [Op.or]: ['APROBADO', 'INSTALACION'] }
                }
            });

            const ventasHoy = await Venta.count({
                where: baseWhere
            });

            return res.json({
                pendientes: {
                    label: 'Pendientes',
                    count: pendientes,
                    color: '#FFA500' // Orange/Warning
                },
                rechazados: {
                    label: 'Rechazados',
                    count: rechazados,
                    color: '#FF0000' // Red
                },
                en_instalacion: {
                    label: 'En Instalación',
                    count: enInstalacion,
                    color: '#008000' // Green
                },
                mis_ventas_hoy: {
                    label: 'Total Ventas Hoy',
                    count: ventasHoy
                }
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al obtener estadísticas.' });
        }
    }

    // GET /ventas/verificar-identificacion
    static async verificarIdentificacion(req: Request, res: Response) {
        try {
            const { identificacion } = req.query;
            if (!identificacion) return res.status(400).json({ message: 'Identificación requerida.' });

            const client = await Cliente.findOne({
                where: { identificacion: identificacion as string },
                include: [Venta]
            });

            if (client && client.ventas && client.ventas.length > 0) {
                const activeSale = client.ventas.find(v => ['PENDIENTE', 'APROBADO', 'INSTALACION'].includes(v.estado));
                if (activeSale) {
                    return res.json({
                        exists: true,
                        message: 'El cliente ya tiene una venta activa.',
                        venta: activeSale
                    });
                }
            }

            return res.json({ exists: false, message: 'Identificación disponible.' });

        } catch (error) {
            return res.status(500).json({ message: 'Error al verificar identificación.' });
        }
    }

    // GET /ventas/:id
    static async show(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const venta = await Venta.findByPk(id as string, {
                include: [
                    Cliente,
                    InformacionContacto,
                    InformacionDomicilio,
                    InformacionDocumentos,
                    InformacionServiciosContratados,
                    InformacionBeneficiarioAdicional
                ]
            });

            if (!venta) return res.status(404).json({ message: 'Venta no encontrada.' });

            return res.json(venta);
        } catch (error) {
            return res.status(500).json({ message: 'Error al obtener detalle.' });
        }
    }

    // PATCH /ventas/:id/estado
    static async updateStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { estado, observacion } = req.body;

            const venta = await Venta.findByPk(id as string);
            if (!venta) return res.status(404).json({ message: 'Venta no encontrada.' });

            venta.estado = estado;
            await venta.save();

            return res.json({ message: 'Estado actualizado.', venta });
        } catch (error) {
            return res.status(500).json({ message: 'Error updating status.' });
        }
    }

    // GET /ventas/:id/historial
    static async getHistory(req: Request, res: Response) {
        return res.json([]);
    }
}
