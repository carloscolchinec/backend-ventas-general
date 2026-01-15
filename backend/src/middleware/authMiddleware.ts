import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedToken {
    id_usuario: number;
    rol: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'No se proporcionó token de autenticación.' });
    }

    const token = authHeader.split(' ')[1]; // Bearer TOKEN

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;

        // Map legacy/standard claims to our expected interface
        const userPayload = {
            ...decoded,
            id_usuario: decoded.id_usuario || decoded.id || decoded.sub,
            rol: decoded.rol || decoded.role || 'user' // fallback
        };

        // Attach user to request
        (req as any).user = userPayload;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};
