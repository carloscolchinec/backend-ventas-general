import { Router } from 'express';
import { PdfController } from '../controllers/PdfController';

const router = Router();

// GET /api/pdf/contrato/:serie
// Note: User asked for /pdf/contrato/:serie (root level perhaps?)
// But our app mounts on /api. 
// If user wants explicitly /pdf outside of /api, we need to adjust app.ts.
// For now, I'll put it technically under /api/pdf, but if I mount it in app.ts separately I can get /pdf.
// User said: "pasando en la url /pdf/contrato/(serie-contrato)"

router.get('/contrato/:serie', PdfController.viewContract);

export default router;
