import { Request, Response } from 'express';
import { Usuario } from '../models/Usuario';
import { Rol } from '../models/Rol';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthController {
    // Login
    static async login(req: Request, res: Response) {
        try {
            const { correo_electronico, password } = req.body;

            if (!correo_electronico || !password) {
                return res.status(400).json({
                    status: 400,
                    message: 'El correo electrónico y la contraseña son obligatorios.'
                });
            }

            // Check user
            const user = await Usuario.findOne({
                where: { correo_electronico },
                include: [Rol]
            });

            if (!user) {
                return res.status(404).json({
                    status: 404,
                    message: 'El usuario no está registrado.'
                });
            }

            // Check password
            // Note: Laravel uses Bcrypt. verification should work if logic is same.
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({
                    status: 401,
                    message: 'Credenciales inválidas. Por favor, verifica tu correo y contraseña.'
                });
            }

            // Generate Token
            const token = jwt.sign(
                { id_usuario: user.id_usuario, rol: user.rol?.nombre_rol },
                process.env.JWT_SECRET || 'secret',
                { expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as any }
            );

            return res.status(200).json({
                status: 200,
                message: 'Inicio de sesión exitoso.',
                data: {
                    access_token: token,
                    token_type: 'bearer',
                    expires_in: 86400, // 1 day in seconds
                    user: {
                        id_usuario: user.id_usuario,
                        nombres: user.nombres,
                        apellidos: user.apellidos,
                        correo_electronico: user.correo_electronico,
                        rol: user.rol?.nombre_rol,
                        prefix_rol: user.rol?.prefix_rol,
                    }
                }
            });

        } catch (error) {
            console.error('Login Error:', error);
            return res.status(500).json({
                status: 500,
                message: 'Ocurrió un problema al intentar iniciar sesión.',
                error: error
            });
        }
    }

    // Me
    static async me(req: Request, res: Response) {
        try {
            // @ts-ignore - User attached by middleware
            const userId = req.user?.id_usuario;

            if (!userId) {
                return res.status(401).json({ message: 'No autenticado.' });
            }

            const user = await Usuario.findByPk(userId, { include: [Rol] });

            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }

            return res.status(200).json({
                status: 200,
                message: 'Datos del usuario obtenidos correctamente.',
                data: {
                    id_usuario: user.id_usuario,
                    nombres: user.nombres,
                    apellidos: user.apellidos,
                    correo_electronico: user.correo_electronico,
                    rol: user.rol?.nombre_rol,
                    prefix_rol: user.rol?.prefix_rol,
                }
            });

        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Error al obtener datos del usuario.',
                error: error
            });
        }
    }
}
