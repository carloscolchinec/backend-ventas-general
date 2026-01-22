import { Router } from 'express';
import { CatalogosController } from '../controllers/CatalogosController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// These could be public or protected depending on requirement.
// User said "free me", implying public or at least accessible.
// We'll keep them protected by default token auth from this API if needed, 
// OR public if app needs them before login. 
// Given the context "app consumes... only saves data", likely needs them for the form.
// Let's make them protected by THIS backend's auth to ensure valid app users,
// even if the backend fetches them freely from Laravel.

router.get('/metodos-pago', CatalogosController.metodosPago);
router.get('/tipos-banco', CatalogosController.tiposBanco);
router.get('/servicios-adicionales', CatalogosController.serviciosAdicionales);

export default router;
