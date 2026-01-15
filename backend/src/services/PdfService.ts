import puppeteer from 'puppeteer';
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';

export class PdfService {
    static async generateContract(venta: any, outputPath: string): Promise<string> {

        // Prepare Data
        // Images must be accessible to puppeteer. Best using base64 or file schema for absolute paths.
        // We'll use file schema with absolute paths.

        const assetsDir = path.join(__dirname, '../../src/assets/images');
        const uploadsDir = path.join(__dirname, '../../public/assets/images/ventas');

        const getImgPath = (filename: string, isUpload = true) => {
            const dir = isUpload ? uploadsDir : assetsDir;
            const fullPath = path.join(dir, filename);
            if (fs.existsSync(fullPath)) {
                // Convert to base64 to avoid file permission issues in some environments, though file:// works usually
                const bitmap = fs.readFileSync(fullPath);
                const ext = path.extname(fullPath).substring(1);
                return `data:image/${ext};base64,${bitmap.toString('base64')}`;
            }
            return ''; // Or placeholder
        };

        const data = {
            cliente: {
                ...venta.dataValues, // Get raw sequelize values
                // Ensure specific fields
                firma: getImgPath(venta.firma),
                cedula_frontal: getImgPath(venta.cedula_frontal),
                cedula_trasera: getImgPath(venta.cedula_trasera),
                planilla_luz: getImgPath(venta.planilla_luz),
                metodoPago: venta.MetodoPagoVenta?.dataValues || {},
                serviciosAdicionales: venta.servicios_adicionales || [], // This comes from JSON in body, not relation yet? 
                // Note: In Controller store, services are parsed JSON. If coming from DB model, need relation loaded.
                // For 'store' context, it's just created, so body values are available.
                // But in 'store', 'nuevaVenta' has 'id'. 
                // We should pass the full object which has parsed fields from 'store' logic.
            },
            plan: {
                nombre_plan: venta.plan || 'NO DEFINIDO',
                mb_subida: venta.planDetails?.mb_subida || 'N/A',
                mb_bajada: venta.planDetails?.mb_bajada || 'N/A',
                precio: venta.planDetails?.precio || '0.00'
            },
            datosPrestador: {
                ciudad_fecha: 'SANTA ELENA',
                direccion: 'BARRIO GUAYAQUIL #430',
                provincia: 'SANTA ELENA',
                ciudad: 'SANTA ELENA',
                canton: 'SANTA ELENA',
                parroquia: 'SAN JOSÉ DE ANCÓN',
                telefono: '0958933197'
            },
            fechaActual: new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),

            // Images
            logoSeroficom: getImgPath('logo_seroficom.png', false),
            logoSocnet: getImgPath('logo_socnet.png', false),
            logoSocnetBackground: getImgPath('logo_socnetd.png', false),
            firmaPrestador: getImgPath('FJORGE1.bmp', false)
        };

        // Render EJS
        const templatePath = path.join(__dirname, '../templates/contrato.ejs');
        const html = await ejs.renderFile(templatePath, data);

        // Puppeteer PDF
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        await page.setContent(html, { waitUntil: 'load' });

        // emulate print
        await page.emulateMediaType('screen'); // CSS logic usually screen or print, blade has print styles?

        await page.pdf({
            path: outputPath,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '0px',
                bottom: '0px',
                left: '0px',
                right: '0px'
            }
        });

        await browser.close();

        return outputPath;
    }
}
