import { Router } from 'express';
import { VentasController } from '../controllers/VentasController';
import { authMiddleware } from '../middleware/authMiddleware';
import { upload } from '../utils/fileUpload';

const router = Router();

router.use(authMiddleware); // Protect all ventas routes

router.get('/estadisticas', VentasController.estadisticas);
router.get('/verificar-identificacion', VentasController.verificarIdentificacion);
router.get('/', VentasController.index);
router.post('/', upload.fields([
    { name: 'cedula_frontal', maxCount: 1 },
    { name: 'cedula_trasera', maxCount: 1 },
    { name: 'planilla_luz', maxCount: 1 },
    { name: 'firma', maxCount: 1 },
    // Beneficiary Docs
    { name: 'beneficiario_cedula_frontal', maxCount: 1 },
    { name: 'beneficiario_cedula_trasera', maxCount: 1 },
    { name: 'beneficiario_carnet', maxCount: 1 },
]), VentasController.store);
router.get('/:id', VentasController.show);
router.get('/:id/historial', VentasController.getHistory);
router.patch('/:id/estado', VentasController.updateStatus);

export default router;
