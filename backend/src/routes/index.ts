import { Router } from 'express';
import authRoutes from './authRoutes';
import ventasRoutes from './ventasRoutes';
import catalogosRoutes from './catalogosRoutes';
import planesRoutes from './planesRoutes';

const router = Router();

router.use('/', authRoutes);
router.use('/ventas', ventasRoutes);
router.use('/catalogos', catalogosRoutes);
router.use('/planes', planesRoutes);

export default router;
