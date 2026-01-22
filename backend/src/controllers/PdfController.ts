import { Request, Response } from 'express';
import { Venta } from '../models/Venta';
import { Cliente } from '../models/Cliente';
import { InformacionDomicilio } from '../models/InformacionDomicilio';
import { InformacionServiciosContratados } from '../models/InformacionServiciosContratados';
import { InformacionContacto } from '../models/InformacionContacto';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

import { InformacionDocumentos } from '../models/InformacionDocumentos';

export class PdfController {

    static async viewContract(req: Request, res: Response) {
        try {
            const serie = req.params.serie as string;

            // --- 0. Check for Existing PDF (Cache) ---
            const publicDir = path.join(process.cwd(), 'public');
            const relativePath = `contratos/${serie}`;
            const fullDir = path.join(publicDir, relativePath);
            const fileName = `contrato-${serie}.pdf`;
            const existingFilePath = path.join(fullDir, fileName);

            if (fs.existsSync(existingFilePath)) {
                // If PDF exists, serve it directly without regenerating or emailing
                console.log(`📂 Serving cached PDF for: ${serie}`);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
                return res.sendFile(existingFilePath);
            }

            console.log(`⚙️ PDF not found locally. Generating for: ${serie}...`);

            const venta = await Venta.findOne({
                where: { serie_contrato: serie },
                include: [
                    Cliente,
                    InformacionDomicilio,
                    InformacionServiciosContratados,
                    InformacionContacto,
                    InformacionDocumentos // Added Missing Include
                ]
            });

            if (!venta) {
                return res.status(404).send('<h1>Contrato no encontrado</h1><p>Verifique la serie ingresada.</p>');
            }


            // Helper to get Base64 Image
            const getBase64Image = (filePath: string): string => {
                try {
                    const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
                    if (fs.existsSync(absolutePath)) {
                        const bitmap = fs.readFileSync(absolutePath);
                        const ext = path.extname(absolutePath).toLowerCase().replace('.', '');
                        const mime = ext === 'svg' ? 'svg+xml' : ext;
                        return `data:image/${mime};base64,${bitmap.toString('base64')}`;
                    }
                    return '';
                } catch (err) {
                    console.error(`Error loading image ${filePath}:`, err);
                    return '';
                }
            };

            // --- 1. Preparar Datos para Laravel API ---
            const c = venta.cliente;
            const contacto = venta.informacionContacto;
            const docInfo = venta.informacionDocumentos;
            const infoServicios = venta.informacionServiciosContratados;

            // Safe Parse Helpers
            const safeParse = (val: any) => {
                if (typeof val === 'string') {
                    try { return JSON.parse(val); } catch { return null; }
                }
                return val;
            };
            const ensureArray = (val: any) => {
                if (!val) return [];
                if (Array.isArray(val)) return val;
                if (typeof val === 'string') {
                    if (val.trim().startsWith('[') || val.trim().startsWith('{')) {
                        try {
                            const parsed = JSON.parse(val);
                            if (Array.isArray(parsed)) return parsed;
                            return [val];
                        } catch { return [val]; }
                    }
                    return [val];
                }
                return [String(val)];
            };

            const rawPlan = safeParse(infoServicios?.plan_contratado);
            const rawPago = safeParse(infoServicios?.informacion_pago);
            
            // Ensure documentos is an object
            let documentosParsed = (docInfo && docInfo.documentos) ? docInfo.documentos : {};
            
            // Log to debug file
            const logDebug = (msg: string) => {
                try { fs.appendFileSync(path.join(process.cwd(), 'debug_pdf.log'), `[${new Date().toISOString()}] ${msg}\n`); } catch {}
            };
            
            logDebug(`RAW docInfo.documentos type: ${typeof docInfo?.documentos}`);
            logDebug(`RAW docInfo.documentos value: ${JSON.stringify(docInfo?.documentos)}`);

            if (typeof documentosParsed === 'string') {
                documentosParsed = safeParse(documentosParsed) || {};
                logDebug(`PARSED documentos: ${JSON.stringify(documentosParsed)}`);
            }

            // Resolve Signature URL (Client) - Robust Path Checking
            let firmaUrl = '';
            let firmaPathRelative = documentosParsed.firma; // Extract from PARSED object
            logDebug(`FIRMA PATH RELATIVE: ${firmaPathRelative}`);

            if (firmaPathRelative) {
                const publicDir = path.join(process.cwd(), 'public');
                
                // Potential Paths
                const pathsToCheck = [
                    path.join(publicDir, firmaPathRelative), // Standard: public/contratos/...
                    path.join(publicDir, 'assets', firmaPathRelative), // Fallback: public/assets/contratos/...
                    path.join(publicDir, 'assets/images/ventas', path.basename(firmaPathRelative)), // Fallback: public/assets/images/ventas/...
                ];

                let fullFirmaPath = '';
                for (const p of pathsToCheck) {
                    logDebug(`Checking path: ${p} -> Exists: ${fs.existsSync(p)}`);
                    if (fs.existsSync(p)) {
                        fullFirmaPath = p;
                        console.log('✅ Signature found at:', p);
                        break;
                    }
                }

                if (!fullFirmaPath) {
                    const msg = `❌ Signature NOT found. Checked: ${JSON.stringify(pathsToCheck)}`;
                    console.error(msg);
                    logDebug(msg);
                } else {
                    firmaUrl = getBase64Image(fullFirmaPath);
                    logDebug(`Generated Base64 Length: ${firmaUrl.length}`);
                }
            } else {
                logDebug('Firma field is missing in documentos object');
            }

            const clienteData = {
                identificacion: c.identificacion,
                nombres: c.nombres,
                apellidos: c.apellidos,
                direccion: venta.informacionDomicilio?.direccion || 'No registrada',
                telefonos: ensureArray(contacto?.telefonos),
                correos: ensureArray(contacto?.correos),
                es_tercera_edad: c.es_tercera_edad,
                es_presenta_discapacidad: c.es_presenta_discapacidad,
                firma: firmaUrl, // Send Base64 string
                metodoPago: rawPago, 
                establecimiento: venta.sede_contrato || 'MATRIZ',
                nivel_comparticion: rawPlan?.nivel_comparticion || '1:1',
                serviciosAdicionales: ensureArray(infoServicios?.servicios_adicionales)
            };
            
            // Adjust MetodoPago structure for Laravel compatibility
            if(clienteData.metodoPago && !clienteData.metodoPago.nombre) {
                clienteData.metodoPago.nombre = clienteData.metodoPago.metodo;
            }

            const planData = rawPlan || {
                nombre_plan: 'GENÉRICO',
                mb_subida: 0,
                mb_bajada: 0,
                precio: 0,
            };

            // Provider Data (Hardcoded or Dynamic)
            const datosPrestador = {
                ciudad_fecha: 'SANTA ELENA',
                direccion: 'Barrio Guayaquil, Calle 3ra y Av. 3ra',
                provincia: 'SANTA ELENA',
                ciudad: 'SANTA ELENA',
                canton: 'SANTA ELENA',
                parroquia: 'SAN JOSÉ DE ANCÓN',
                telefono: '0958933197'
            };

            // Auth Debito / Credito Data Mapping
            let authDebito = { 
                mostrar: false,
                tipo: 'DEBITO_BANCARIO', // Default
                banco: '',
                numero: '',
                expiracion: '',
                titular: `${c.nombres} ${c.apellidos}`,
                identificacion: c.identificacion,
                tipo_cuenta: ''
             };

             if (rawPago) {
                const metodoCode = rawPago.codigo_metodo || '';
                const detalle = rawPago.detalle || {};

                // Logic to determine if we show the auth annex
                // FP04 = Debito Bancario (from user DB)
                // FP03 = Tarjeta de Credito (from user DB)
                
                const isDebit = ['FP04'].includes(metodoCode) || (detalle.tipo_cuenta && ['AHORRO', 'CORRIENTE'].includes(detalle.tipo_cuenta.toUpperCase()));
                const isCredit = ['FP03'].includes(metodoCode) || (rawPago.metodo && rawPago.metodo.toUpperCase().includes('TARJETA'));

                if (isDebit || isCredit) {
                    authDebito.mostrar = true;
                    authDebito.tipo = isCredit ? 'TARJETA_CREDITO' : 'DEBITO_BANCARIO';
                    
                    authDebito.banco = detalle.banco_nombre || detalle.tarjeta_emisor || '';
                    
                    // CC Number: Try tarjeta_numero (payload) -> numero_tarjeta -> numero_cuenta
                    authDebito.numero = detalle.tarjeta_numero || detalle.numero_tarjeta || detalle.numero_cuenta || '';
                    
                    authDebito.tipo_cuenta = detalle.tipo_cuenta || '';
                    
                    // Expiration: Try tarjeta_exp (payload) -> fecha_expiracion
                    authDebito.expiracion = detalle.tarjeta_exp || detalle.fecha_expiracion || ''; 
                    
                    // Override titular if specific titular info is present in detalle (optional, usually falls back to client)
                    if (detalle.titular) authDebito.titular = detalle.titular;
                    if (detalle.cedula_titular) authDebito.identificacion = detalle.cedula_titular;
                }
             }

            const payload = {
                cliente: clienteData,
                plan: planData,
                datosPrestador,
                authDebito,
                documentos: documentosParsed // Pass documents to Laravel
            };

            // --- 2. Call Laravel API ---
            // Assuming Laravel runs on 8000. Configurable via ENV ideally.
            const baseUrl = process.env.LARAVEL_API_URL || 'http://127.0.0.1:8000/api';
            const laravelUrl = `${baseUrl}/generar-contrato-pdf`;

            try {
                const response = await axios.post(laravelUrl, payload, {
                    responseType: 'arraybuffer'
                });

                const pdfBuffer = Buffer.from(response.data);

                // --- 3. Save PDF Locally ---
                const publicDir = path.join(process.cwd(), 'public');
                const serieDir = path.join(publicDir, 'contratos', serie);
                
                // Ensure dir exists
                if (!fs.existsSync(serieDir)) {
                    fs.mkdirSync(serieDir, { recursive: true });
                }

                const pdfName = `contrato-${serie}.pdf`;
                const pdfPath = path.join(serieDir, pdfName);
                fs.writeFileSync(pdfPath, pdfBuffer);
                console.log(`✅ PDF Saved locally at: ${pdfPath}`);

                console.log(`✅ PDF Saved locally at: ${pdfPath}`);

                // --- 4. Send Email (Backend Logic) ---
                // Only send email if explicitly triggered in 'created' mode (Auto-Job)
                if (req.query.mode === 'created') {
                    try {
                        // Use contacto.correos which was defined earlier
                        const emailsToSend = contacto ? contacto.correos : [];
                        await sendContractEmail(emailsToSend, `${c.nombres} ${c.apellidos}`, pdfPath, pdfName);
                        console.log('📧 Email sent successfully (Creation Mode).');
                    } catch (emailErr) {
                        console.error('❌ Error sending email:', emailErr);
                    }
                } else {
                    console.log('ℹ️ Email skipped (View/Regenerate Mode).');
                }

                // --- 5. Serve PDF ---
                res.contentType('application/pdf');
                res.setHeader('Content-Disposition', `inline; filename=${pdfName}`);
                res.send(pdfBuffer);

            } catch (apiError: any) {
                console.error('Error calling Laravel API:', apiError.message);
                if (apiError.response) {
                    console.error('Laravel Response:', apiError.response.data.toString());
                }
                return res.status(500).send('Error generando PDF en servicio externo.');
            }

        } catch (error) {
            console.error(error);
            return res.status(500).send('<h1>Error del Servidor</h1>');
        }
    }
}

// --- Helper: Send Email ---
import nodemailer from 'nodemailer';

async function sendContractEmail(emails: string[], nombreCliente: string, pdfPath: string, pdfName: string) {
    // Configuración SMTP usando las variables del usuario
    const host = process.env.SMTP_HOST || process.env.MAIL_HOST || 'smtp.gmail.com';
    const port = Number(process.env.SMTP_PORT || process.env.MAIL_PORT) || 587;
    const user = process.env.SMTP_USER || process.env.MAIL_USERNAME || 'notificaciones@seroficom.org';
    const pass = process.env.SMTP_PASS || process.env.MAIL_PASSWORD || '';
    const from = process.env.SMTP_FROM || '"SOCNET - Seroficom S.A." <notificaciones@seroficom.org>';

    const transporter = nodemailer.createTransport({
        host: host,
        port: port,
        secure: port === 465, // True para puerto 465, false para otros
        auth: {
            user: user,
            pass: pass,
        },
    });

    // Helper sanitization logic
    let destination = '';
    const cleanEmail = (e: string) => e.replace(/[\[\]"']/g, '').trim();

    if (Array.isArray(emails)) {
        destination = emails.map(cleanEmail).filter(e => e).join(',');
    } else if (typeof emails === 'string') {
        const raw = emails as string;
        // Check if it looks like a stringified array e.g. '["foo@bar.com"]'
        if (raw.trim().startsWith('[') || raw.includes(',')) {
            try {
                // Try JSON parse first
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    destination = parsed.map((e: any) => cleanEmail(String(e))).join(',');
                } else {
                    destination = cleanEmail(raw);
                }
            } catch {
                // Fallback: split by comma and clean
                destination = raw.split(',').map(cleanEmail).join(',');
            }
        } else {
            destination = cleanEmail(raw);
        }
    }

    if (!destination) {
        console.warn('⚠️ No valid email destination found.');
        return; 
    }
    console.log('📧 Sending email to sanitized destination:', destination);

    // Check for logo files
    const logoSeroficomPath = path.join(process.cwd(), 'src', 'assets', 'images', 'logo_seroficom.png');
    const logoSocnetPath = path.join(process.cwd(), 'src', 'assets', 'images', 'logo_socnet.png');
    const hasLogos = fs.existsSync(logoSeroficomPath) && fs.existsSync(logoSocnetPath);

    // Prepare attachments
    const attachments: any[] = [
        {
            filename: pdfName,
            path: pdfPath
        }
    ];

    if (hasLogos) {
        attachments.push({
            filename: 'logo_seroficom.png',
            path: logoSeroficomPath,
            cid: 'logo_seroficom' // same cid value as in the html img src
        });
        attachments.push({
            filename: 'logo_socnet.png',
            path: logoSocnetPath,
            cid: 'logo_socnet'
        });
    }

    // Template HTML (Converted from Blade)
    const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Bienvenido a SOCNET</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb; color: #333;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 25px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        
        <!-- Header Logos -->
        <table style="width: 100%; margin-bottom: 25px;">
            <tr>
                <td style="text-align: left; vertical-align: middle;">
                    <img src="cid:logo_seroficom" alt="Logo Seroficom" style="height: 45px; width: auto; display: block;">
                </td>
                <td style="text-align: right; vertical-align: middle;">
                    <img src="cid:logo_socnet" alt="Logo Socnet" style="height: 40px; width: auto; display: block; margin-left: auto;">
                </td>
            </tr>
        </table>

        <!-- Saludo -->
        <h2 style="text-align: center; color: #c00000; font-size: 20px;">Estimado/a ${nombreCliente}:</h2>

        <p style="font-size: 15px;">¡Bienvenido a <strong>SOCNET</strong>!</p>
        <p style="font-size: 15px;">Es un placer contar con usted como parte de nuestra comunidad.</p>

        <p style="font-size: 15px;">
            Dentro de los próximos <strong>5 días hábiles</strong>, uno de nuestros técnicos se comunicará con usted para coordinar la instalación y activación del servicio que ha adquirido.
        </p>

        <p style="font-size: 15px;">
            Adjuntamos a este correo el contrato de servicios para su revisión. Si detecta alguna novedad o inconsistencia, no dude en contactarnos al correo:
            <a href="mailto:info@seroficom.org" style="color: #c00000; font-weight: bold; text-decoration: none;">info@seroficom.org</a>.
        </p>

        <p style="font-size: 15px;">Agradecemos su confianza y preferencia.</p>
        <p style="font-size: 15px;">Gracias por ser parte de <strong>SOCNET</strong>.</p>

        <hr style="margin: 25px 0; border: none; border-top: 1px solid #ddd;">

        <div style="text-align: center; font-size: 14px;">
            <p>📞 +593 958933197 | ☎️ 043903497</p>
            <p>🌐 <a href="https://www.seroficom.org" style="color: #c00000; text-decoration: none;">www.seroficom.org</a></p>
            <p>Síganos en nuestras redes sociales:<br> Facebook | Instagram</p>
        </div>
    </div>
</body>
</html>`;

    await transporter.sendMail({
        from: from,
        to: destination,
        subject: 'Bienvenido a SOCNET - Contrato de Servicios',
        html: htmlContent,
        attachments: attachments
    });
}

