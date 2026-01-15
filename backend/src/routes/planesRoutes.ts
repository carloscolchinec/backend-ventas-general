import { Router } from 'express';
import { PlanesController } from '../controllers/PlanesController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', PlanesController.index);
router.get('/filtrar', PlanesController.filtrar);

export default router;
