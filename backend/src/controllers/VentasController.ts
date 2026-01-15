import { Request, Response } from 'express';
import { VentasClienteCedula } from '../models/VentasClienteCedula';
import { VentaBeneficiario } from '../models/VentaBeneficiario';
import { MetodoPagoVenta } from '../models/MetodoPagoVenta';
import { VentaPagoTarjeta } from '../models/VentaPagoTarjeta';
import { VentaPagoCuenta } from '../models/VentaPagoCuenta';

import { VentasHistorial } from '../models/VentasHistorial';
// import { ServicioAdicionalVenta } from '../models/ServicioAdicionalVenta';

import path from 'path';
import { PdfService } from '../services/PdfService';
import { EmailService } from '../services/EmailService';
import { Usuario } from '../models/Usuario';
import { LaravelApiService } from '../services/LaravelApiService'; // Import API service

export class VentasController {
    // POST /ventas
    static async store(req: Request, res: Response) {
        // Transaction ideally
        try {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            const body = req.body;

            // 1. Parsing JSON fields (multipart/form-data sends them as strings)
            const parseJson = (field: any) => {
                if (typeof field === 'string') {
                    try { return JSON.parse(field); } catch (e) { return []; }
                }
                return field;
            };

            const telefonos = parseJson(body.telefonos);
            const correos = parseJson(body.correos);
            const serviciosAdicionales = parseJson(body.servicios_adicionales);

            // 2. Extract Filenames
            const getFilename = (fieldname: string) => files[fieldname] ? files[fieldname][0].filename : null;

            const cedulaFrontal = getFilename('cedula_frontal');
            const cedulaTrasera = getFilename('cedula_trasera');
            const planillaLuz = getFilename('planilla_luz');
            const firma = getFilename('firma');

            // 3. Create Main Sale Record

            // --- Logic for 'serie_contrato' (Legacy: COT-CEDULA-FECHANAC(dmy)) ---
            // Laravel: $fecha = Carbon::parse($request->fecha_nacimiento)->format('dmy');
            //          $codigo_contrato = 'COT-' . $ident . '-' . $fecha;

            let serieContrato = '';
            if (body.fecha_nacimiento && body.identificacion) {
                try {
                    const dob = new Date(body.fecha_nacimiento);
                    const day = String(dob.getDate() + 1).padStart(2, '0'); // Fix TZ issue? Usually strings are YYYY-MM-DD
                    const month = String(dob.getMonth() + 1).padStart(2, '0');
                    const year = String(dob.getFullYear()).slice(-2);

                    // Better approach: Parse string directly if YYYY-MM-DD to avoid timezone shifts
                    // body.fecha_nacimiento is typically YYYY-MM-DD
                    const parts = body.fecha_nacimiento.split('-');
                    let dStr = '';
                    if (parts.length === 3) {
                        // parts[0]=YYYY, parts[1]=MM, parts[2]=DD
                        dStr = `${parts[2]}${parts[1]}${parts[0].slice(-2)}`;
                    } else {
                        // Fallback
                        dStr = '000000';
                    }
                    serieContrato = `COT-${body.identificacion}-${dStr}`;
                } catch (e) {
                    console.error('Error generating serie_contrato', e);
                    serieContrato = `COT-${body.identificacion}-000000`; // Fallback
                }
            }

            const nuevaVenta = await VentasClienteCedula.create({
                ...body,
                // @ts-ignore
                id_usuario_registro: req.user?.id_usuario, // Link sale to creator
                serie_contrato: serieContrato, // Add generated series
                telefonos: telefonos,
                correos: correos,
                cedula_frontal: cedulaFrontal,
                cedula_trasera: cedulaTrasera,
                planilla_luz: planillaLuz,
                firma: firma,
                estado: 'P', // Pendiente default
                created_at: new Date(),
                updated_at: new Date()
            });

            // 4. Create Related Records
            // Beneficiario
            if (body.tiene_beneficiario === 'true' || body.tiene_beneficiario === true) {
                await VentaBeneficiario.create({
                    venta_id: nuevaVenta.id,
                    identificacion: body.beneficiario_identificacion,
                    nombres: body.beneficiario_nombres,
                    porcentaje: body.beneficiario_porcentaje || 100,
                    created_at: new Date(),
                    updated_at: new Date()
                });
            }

            // Pagos
            if (body.metodo_pago_codigo === 'TARJETA') { // Logic depends on code
                await VentaPagoTarjeta.create({
                    venta_id: nuevaVenta.id,
                    // ... map fields
                    created_at: new Date(),
                    updated_at: new Date()
                });
            }
            // Add other payment logic as needed...

            // History
            await VentasHistorial.create({
                id_venta: nuevaVenta.id,
                // @ts-ignore
                id_usuario: req.user?.id_usuario || 1,
                estado: 'P',
                observacion: 'Venta es ingresada.',
                created_at: new Date(),
                updated_at: new Date()
            });

            // 5. Generate Contract PDF
            // User requested: "separar por carpeta en public/contratos/IDENTIFICACION"
            // We create the specific folder for this client
            const contractDir = path.join(__dirname, `../../public/contratos/${body.identificacion}`);
            const fs = require('fs');
            if (!fs.existsSync(contractDir)) { fs.mkdirSync(contractDir, { recursive: true }); }

            // Move uploaded files to this specific folder
            const moveFile = (filename: string | null, targetDir: string) => {
                if (!filename) return null;
                const sourcePath = path.join(__dirname, '../../public/assets/images/ventas', filename);
                const targetPath = path.join(targetDir, filename);
                if (fs.existsSync(sourcePath)) {
                    // Rename (move)
                    try {
                        fs.renameSync(sourcePath, targetPath);
                        // Return relative path for DB if we want strict path, 
                        // OR we keep filename and logic knows where to look.
                        // Laravel stored "contratos/{ident}/filename.jpg". 
                        // Our DB "cedula_frontal" column expects what? 
                        // Current logic in frontend might expect just filename or full path.
                        // If we change location, we should update DB record to be "contratos/{ident}/{filename}" or just filename if consistent.
                        // Let's assume we update the DB record to be the relative path: "contratos/{ident}/{filename}"
                        return `contratos/${body.identificacion}/${filename}`;
                    } catch (e) { console.error("Move file error", e); return filename; }
                }
                return filename; // Fail safe
            };

            // Update DB records with new paths if moved
            // Note: We already created the record with filenames. We should update it.
            const newCedulaFrontal = moveFile(cedulaFrontal, contractDir);
            const newCedulaTrasera = moveFile(cedulaTrasera, contractDir);
            const newPlanillaLuz = moveFile(planillaLuz, contractDir);
            const newFirma = moveFile(firma, contractDir);

            // Update the record with new paths
            await nuevaVenta.update({
                cedula_frontal: newCedulaFrontal,
                cedula_trasera: newCedulaTrasera,
                planilla_luz: newPlanillaLuz,
                firma: newFirma
            });

            // Path for PDF
            const contractPath = path.join(contractDir, `contrato_${body.identificacion}.pdf`);

            // Fetch Plan Details for PDF
            let planDetails = {};
            try {
                const planes = await LaravelApiService.getPlanes({});
                // Find matching plan by name or ID
                if (Array.isArray(planes)) {
                    const matchedPlan = planes.find((p: any) => p.nombre_plan === nuevaVenta.plan || p.id === nuevaVenta.plan);
                    if (matchedPlan) planDetails = matchedPlan;
                }
            } catch (e) { console.error("Error fetching plan details for PDF", e); }

            // Pass planDetails to generateContract
            // Pre-calculate strings for template to avoid "Invalid token" errors in EJS
            const formatContactList = (list: any) => {
                if (Array.isArray(list)) return list.map((item: any) => item.valor).join(', ');
                if (typeof list === 'string' && list.startsWith('[')) {
                    try {
                        const parsed = JSON.parse(list);
                        if (Array.isArray(parsed)) return parsed.map((item: any) => item.valor).join(', ');
                    } catch (e) { return list; }
                }
                return list || '';
            };

            const telefonosFmt = formatContactList(nuevaVenta.telefonos);
            const correosFmt = formatContactList(nuevaVenta.correos);

            // Checks
            // @ts-ignore
            const isTerceraEdad = (nuevaVenta.es_tercera_edad === true || nuevaVenta.es_tercera_edad === 1 || nuevaVenta.es_tercera_edad === 'true');
            // @ts-ignore
            const isDiscapacidad = (nuevaVenta.es_presenta_discapacidad === true || nuevaVenta.es_presenta_discapacidad === 1 || nuevaVenta.es_presenta_discapacidad === 'true');

            const esTerceraEdadCheck = (isTerceraEdad || isDiscapacidad) ? 'X' : '&nbsp;';
            const noEsTerceraEdadCheck = (!isTerceraEdad && !isDiscapacidad) ? 'X' : '&nbsp;';

            // Payment method string
            // Payment method string
            const metodoPagoFmt = (nuevaVenta.metodoPago && nuevaVenta.metodoPago.nombre)
                ? nuevaVenta.metodoPago.nombre.toUpperCase()
                : (body.metodo_pago_texto || 'NO DEFINIDO');

            // Plan strings
            // @ts-ignore
            const planNombreFmt = planDetails.nombre_plan ? planDetails.nombre_plan.toUpperCase() : 'NO DEFINIDO';
            // @ts-ignore
            const mbSubidaFmt = planDetails.mb_subida || '0';
            // @ts-ignore
            const mbBajadaFmt = planDetails.mb_bajada || '0';
            // @ts-ignore
            const precioFmt = Number(planDetails.precio || 0).toFixed(2);
            const nivelComparticionFmt = nuevaVenta.nivel_comparticion ? nuevaVenta.nivel_comparticion.toUpperCase() : 'N/A';

            const ventaForPdf = {
                ...nuevaVenta.dataValues,
                // Images
                cedula_frontal: newCedulaFrontal ? path.join(__dirname, '../../public', newCedulaFrontal) : null,
                cedula_trasera: newCedulaTrasera ? path.join(__dirname, '../../public', newCedulaTrasera) : null,
                planilla_luz: newPlanillaLuz ? path.join(__dirname, '../../public', newPlanillaLuz) : null,
                firma: newFirma ? path.join(__dirname, '../../public', newFirma) : null,

                // Pre-calculated Format Strings (Simplifying EJS)
                telefonosFmt,
                correosFmt,
                esTerceraEdadCheck,
                noEsTerceraEdadCheck,
                metodoPagoFmt,
                planNombreFmt,
                mbSubidaFmt,
                mbBajadaFmt,
                precioFmt,
                nivelComparticionFmt,

                servicios_adicionales: serviciosAdicionales,
                planDetails: planDetails
            };

            await PdfService.generateContract(ventaForPdf, contractPath);

            // 6. Send Email
            const contactEmail = (correos && correos.length > 0) ? correos[0].valor : body.correo_contacto;
            if (contactEmail) {
                await EmailService.sendContractEmail(contactEmail, `${nuevaVenta.nombres} ${nuevaVenta.apellidos}`, contractPath);
            }

            // 7. Notification Email to Sales
            // @ts-ignore
            const vendedorName = req.user?.username || 'Vendedor'; // or fetch from DB user
            await EmailService.sendNotificationEmail('ventas@seroficom.org', nuevaVenta, contractPath, vendedorName);

            return res.status(201).json({
                message: 'Venta registrada exitosamente',
                venta: nuevaVenta
            });

        } catch (error: any) {
            console.error('Error creating sale - Full Stack:', error);
            // Return more details for debugging
            return res.status(500).json({
                message: 'Error al registrar la venta.',
                error: error.message || error,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }
    // GET /ventas
    static async index(req: Request, res: Response) {
        try {
            // @ts-ignore
            const userId = req.user?.id_usuario;
            // @ts-ignore
            const userRol = req.user?.rol;

            // Robust check for admin role (case insensitive)
            const isAdmin = userRol && (userRol.toLowerCase() === 'admin' || userRol.toLowerCase() === 'administrador');

            // If admin, show all. If not admin and we have userId, show user's sales.
            // If unknown state, show empty or all? defaulting to userId filter if exists, else empty (to prevent crash)
            let whereClause = {};
            if (!isAdmin) {
                if (userId) {
                    whereClause = { id_usuario_registro: userId };
                } else {
                    // unexpected: authenticated but no ID? return empty list or handle error
                    console.warn("Authenticated user missing id_usuario in index");
                    return res.json({ ventas: [] }); // Safe fallback
                }
            }

            const ventas = await VentasClienteCedula.findAll({
                where: whereClause,
                include: [
                    { model: VentaBeneficiario },
                    { model: MetodoPagoVenta },
                    { model: VentaPagoTarjeta },
                    { model: VentaPagoCuenta, include: ['tipoBanco'] },
                    // @ts-ignore
                    { model: Usuario, as: 'usuarioRegistro', attributes: { exclude: ['password'] } } // Seller info
                ],
                order: [['created_at', 'DESC']],
                limit: 100
            });

            // Bulk Enrichment: Fetch all plans once to avoid N+1 API calls
            let planMap: Record<string, any> = {};
            try {
                const planesResponse = await LaravelApiService.getPlanes();
                const allPlanes = planesResponse.data || (Array.isArray(planesResponse) ? planesResponse : []);

                if (Array.isArray(allPlanes)) {
                    allPlanes.forEach((p: any) => {
                        // Store by ID and by Name for flexible lookup
                        planMap[p.id_plan] = p;
                        if (p.nombre_plan) {
                            planMap[p.nombre_plan.toLowerCase()] = p;
                            // Also store without spaces to be extra robust
                            planMap[p.nombre_plan.replace(/\s+/g, '').toLowerCase()] = p;
                        }
                    });
                }
            } catch (e) {
                console.warn('[VentasController] Could not fetch all plans for bulk enrichment:', e);
            }

            // Map and Enrich
            const enrichedVentas = ventas.map(v => {
                const vJson = v.get({ plain: true });

                // Robust lookup: try direct ID, then trimmed lowercase, then no-spaces
                const rawPlanId = (vJson as any).plan_id || vJson.plan;
                const planIdStr = rawPlanId?.toString() || '';
                const cleanId = planIdStr.trim().toLowerCase();
                const superCleanId = cleanId.replace(/\s+/g, '');

                const foundPlan = planMap[rawPlanId] || planMap[cleanId] || planMap[superCleanId];

                let planSpecs = {};
                if (foundPlan) {
                    planSpecs = {
                        plan_precio: foundPlan.precio,
                        plan_mb_subida: foundPlan.mb_subida,
                        plan_mb_bajada: foundPlan.mb_bajada,
                        plan_nivel_comparticion: foundPlan.nivel_comparticion,
                        plan_red_tecnologia: foundPlan.tipo_red || (foundPlan.nombre_plan?.toUpperCase().includes('GPON') ? 'GPON' : 'FIBRA ÓPTICA'),
                        plan_descripcion: foundPlan.descripcion_plan
                    };
                }

                return {
                    ...vJson,
                    ...planSpecs,
                    // Standardize relation names for legacy compatibility
                    metodo_pago: vJson.metodoPago,
                    usuario_registro: vJson.usuarioRegistro,
                    beneficiario: vJson.beneficiario
                };
            });

            return res.json({ ventas: enrichedVentas });
        } catch (error) {
            console.error('Error fetching ventas:', error);
            return res.status(500).json({ message: 'Error al obtener ventas.' });
        }
    }

    // GET /ventas/estadisticas
    static async estadisticas(req: Request, res: Response) {
        try {
            // Logic mirrored from VentasClienteController::estadisticas
            // Laravel: 
            // $registrados = VentasClienteCedula::where('estado', 'A')->count();
            // $rechazados = VentasClienteCedula::where('estado', 'R')->count();
            // $procesoInstalacion = VentasClienteCedula::where('estado', 'I')->count(); // Assuming 'I' is install process for now, logic to be verified

            // Using simple counts for demo matching user request "statistics"
            const registrados = await VentasClienteCedula.count({ where: { estado: 'A' } });
            const rechazados = await VentasClienteCedula.count({ where: { estado: 'R' } });
            const procesoInstalacion = await VentasClienteCedula.count({ where: { estado: 'P' } }); // P = Pendiente/Proceso? Verify actual logic later

            return res.json({
                registrados,
                rechazados,
                proceso_instalacion: procesoInstalacion // Using snake_case for consistency with previous API
            });
        } catch (error) {
            console.error('Error fetching statistics:', error);
            return res.status(500).json({ message: 'Error al obtener estadísticas.' });
        }
    }

    // GET /ventas/verificar-identificacion?identificacion=xyz
    static async verificarIdentificacion(req: Request, res: Response) {
        try {
            const { identificacion } = req.query;

            if (!identificacion) {
                return res.status(400).json({ message: 'Identificación requerida.' });
            }

            const existingSale = await VentasClienteCedula.findOne({
                where: { identificacion: identificacion as string }
            });

            if (existingSale) {
                return res.json({
                    exists: true,
                    message: 'El cliente ya tiene una venta registrada.',
                    venta: existingSale
                });
            }

            return res.json({
                exists: false,
                message: 'Identificación disponible.'
            });

        } catch (error) {
            console.error('Error verifying ID:', error);
            return res.status(500).json({ message: 'Error al verificar identificación.' });
        }
    }

    // GET /ventas/:id
    static async show(req: Request, res: Response) {
        try {
            const { id } = req.params;

            // Search by ID or Identificacion
            const whereClause = isNaN(Number(id))
                ? { identificacion: id }
                : { id: id };

            const venta = await VentasClienteCedula.findOne({
                where: whereClause,
                include: [
                    { model: VentaBeneficiario },
                    // @ts-ignore
                    { model: MetodoPagoVenta, as: 'metodoPago' },
                    { model: VentaPagoTarjeta },
                    { model: VentaPagoCuenta, include: ['tipoBanco'] },
                    { model: VentasHistorial },
                    // @ts-ignore
                    { model: Usuario, as: 'usuarioRegistro', attributes: { exclude: ['password'] } }
                ]
            });

            if (!venta) {
                return res.status(404).json({ message: 'Venta no encontrada.' });
            }

            // Convert to plain JSON to attach legacy aliases
            const ventaJSON = venta.get({ plain: true });

            // Enrichment: Fetch plan details by ID or Name
            let planSpecs = {};
            try {
                const planId = (ventaJSON as any).plan_id || ventaJSON.plan || (venta as any).plan;
                console.log(`[VentasController] Attempting to enrich sale with plan specs. planId found: "${planId}"`);

                if (planId) {
                    const foundPlan = await LaravelApiService.getPlanById(planId);
                    console.log(`[VentasController] LaravelApiService.getPlanById result for "${planId}":`, foundPlan ? 'FOUND' : 'NOT FOUND');

                    if (foundPlan) {
                        planSpecs = {
                            plan_precio: foundPlan.precio,
                            plan_mb_subida: foundPlan.mb_subida,
                            plan_mb_bajada: foundPlan.mb_bajada,
                            plan_nivel_comparticion: foundPlan.nivel_comparticion, // This is usually "1:1", "1:4" etc.
                            plan_red_tecnologia: foundPlan.tipo_red || (foundPlan.nombre_plan?.toUpperCase().includes('GPON') ? 'GPON' : 'FIBRA ÓPTICA'),
                            plan_descripcion: foundPlan.descripcion_plan
                        };
                        console.log(`[VentasController] planSpecs constructed:`, planSpecs);
                    }
                } else {
                    console.log(`[VentasController] No planId or plan name found to enrich.`);
                }
            } catch (e) {
                console.error('[VentasController] Error fetching plan specs for enrichment:', e);
            }

            return res.json({
                ...ventaJSON,
                ...planSpecs,
                // Map camelCase relationships to snake_case for Flutter/Legacy compatibility
                metodo_pago: ventaJSON.metodoPago,
                usuario_registro: ventaJSON.usuarioRegistro,
                beneficiario: ventaJSON.beneficiario
            });

        } catch (error) {
            console.error('Error fetching venta detail:', error);
            return res.status(500).json({ message: 'Error al obtener detalle de venta.' });
        }
    }

    // PATCH /ventas/:id/estado
    static async updateStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { estado, observacion } = req.body;

            if (!estado) {
                return res.status(400).json({ message: 'El estado es requerido.' });
            }

            const venta = await VentasClienteCedula.findByPk(id as string);
            if (!venta) {
                return res.status(404).json({ message: 'Venta no encontrada.' });
            }

            // Optional: Validate transition logic
            const validStatuses = ['VI', 'P', 'A', 'R', 'I', 'IEP', 'VD'];
            if (!validStatuses.includes(estado)) {
                return res.status(400).json({ message: 'Estado no válido.' });
            }

            // Logic for "Rejection/Return"
            // If it's returning to VI or P, we might want to distinguish it as a rejection/return
            const oldStatus = venta.estado;
            venta.estado = estado;
            await venta.save();

            // Log in history with more detail
            const getStatusMessage = (status: string) => {
                const messages: { [key: string]: string } = {
                    'VI': 'Venta es ingresada.',
                    'P': 'Venta es ingresada.',
                    'VD': 'Venta es regresada al vendedor.',
                    'IEP': 'Venta ingresa a proceso de instalación.',
                    'I': 'Venta es instalada.',
                    'A': 'Venta es aprobada.',
                    'R': 'Venta es rechazada.',
                    'VR': 'Venta es rechazada.'
                };
                return messages[status] || `Estado cambiado a ${status}`;
            };

            await VentasHistorial.create({
                id_venta: venta.id,
                // @ts-ignore
                id_usuario: req.user?.id_usuario || 1,
                estado: estado,
                observacion: observacion || getStatusMessage(estado)
            });

            return res.json({
                message: 'Estado actualizado correctamente.',
                venta
            });
        } catch (error) {
            console.error('Error updating status:', error);
            return res.status(500).json({ message: 'Error al actualizar el estado.' });
        }
    }

    static async getHistory(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const history = await VentasHistorial.findAll({
                where: { id_venta: id },
                include: [
                    {
                        model: Usuario,
                        attributes: ['id_usuario', 'nombres', 'apellidos', 'correo_electronico']
                    }
                ],
                order: [['createdAt', 'DESC']]
            });
            return res.json(history);
        } catch (error) {
            console.error('Error fetching history:', error);
            return res.status(500).json({ message: 'Error al obtener el historial.' });
        }
    }
}
