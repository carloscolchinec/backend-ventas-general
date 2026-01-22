import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post('/login', AuthController.login);

// Protected routes
router.get('/user/me', authMiddleware, AuthController.me);
// router.post('/logout', authMiddleware, AuthController.logout); // Optional if needed

export default router;
