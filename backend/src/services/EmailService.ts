import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export class EmailService {
    private static transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    static async sendContractEmail(to: string, clientName: string, contractPath: string) {
        try {
            const logoPath = path.join(__dirname, '../../src/assets/images'); // Adjust path if needed for dist

            const mailOptions = {
                from: process.env.SMTP_FROM,
                to: to,
                subject: 'Bienvenido a SOCNET',
                html: `
                    <!DOCTYPE html>
                    <html lang="es">
                    <head>
                        <meta charset="UTF-8">
                        <title>Bienvenido a SOCNET</title>
                        <style>
                            @media only screen and (max-width: 600px) {
                                .logo-container { flex-direction: column !important; align-items: center !important; text-align: center !important; }
                                .logo-container img { max-width: 80px !important; height: auto !important; margin-bottom: 10px !important; }
                            }
                        </style>
                    </head>
                    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb; color: #333;">
                        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 25px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                            
                            <!-- Logos -->
                            <table style="width: 100%; margin-bottom: 25px;">
                                <tr>
                                    <td style="text-align: left;">
                                        <img src="cid:logo_seroficom" alt="Logo Seroficom" style="height: 40px; max-width: 150px;">
                                    </td>
                                    <td style="text-align: right;">
                                        <img src="cid:logo_socnet" alt="Logo Socnet" style="height: 35px; max-width: 100px;">
                                    </td>
                                </tr>
                            </table>

                            <!-- Saludo -->
                            <h2 style="text-align: center; color: #c00000; font-size: 20px;">Estimado/a ${clientName}:</h2>

                            <!-- Contenido -->
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

                            <!-- Separador -->
                            <hr style="margin: 25px 0; border: none; border-top: 1px solid #ddd;">

                            <!-- Contacto -->
                            <div style="text-align: center; font-size: 14px;">
                                <p>📞 +593 958933197 | ☎️ 043903497</p>
                                <p>🌐 <a href="https://www.seroficom.org" style="color: #c00000; text-decoration: none;">www.seroficom.org</a></p>
                                <p>Síganos en nuestras redes sociales:<br> Facebook | Instagram</p>
                            </div>

                        </div>
                    </body>
                    </html>
                `,
                attachments: [
                    {
                        filename: `Contrato-${clientName.replace(/\s+/g, '_')}.pdf`,
                        path: contractPath
                    },
                    {
                        filename: 'logo_seroficom.png',
                        path: path.join(logoPath, 'logo_seroficom.png'),
                        cid: 'logo_seroficom'
                    },
                    {
                        filename: 'logo_socnet.png',
                        path: path.join(logoPath, 'logo_socnet.png'),
                        cid: 'logo_socnet'
                    }
                ]
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('Message sent: %s', info.messageId);
            return info;
        } catch (error) {
            console.error('Error sending email:', error);
            return null;
        }
    }

    static async sendNotificationEmail(to: string, venta: any, contractPath: string, vendedorName: string) {
        try {
            const mailOptions = {
                from: process.env.SMTP_FROM,
                to: to, // 'ventas@seroficom.org'
                subject: `Nueva Venta - ${venta.nombres} ${venta.apellidos} - ${venta.identificacion}`,
                html: `
                    <h3>Nueva Venta Registrada</h3>
                    <p><strong>Cliente:</strong> ${venta.nombres} ${venta.apellidos}</p>
                    <p><strong>Cédula:</strong> ${venta.identificacion}</p>
                    <p><strong>Plan:</strong> ${venta.plan}</p>
                    <p><strong>Vendedor:</strong> ${vendedorName}</p>
                    <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
                    <hr>
                    <p>Se adjunta el contrato generado.</p>
                `,
                attachments: [
                    {
                        filename: `Contrato-${venta.identificacion}.pdf`,
                        path: contractPath
                    }
                ]
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('Notification sent: %s', info.messageId);
            return info;
        } catch (error) {
            console.error('Error sending notification email:', error);
            return null;
        }
    }
}
