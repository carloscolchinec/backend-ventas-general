"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const Usuario_1 = require("../models/Usuario");
const Rol_1 = require("../models/Rol");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthController {
    // Login
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const { correo_electronico, password } = req.body;
                if (!correo_electronico || !password) {
                    return res.status(400).json({
                        status: 400,
                        message: 'El correo electrónico y la contraseña son obligatorios.'
                    });
                }
                // Check user
                const user = yield Usuario_1.Usuario.findOne({
                    where: { correo_electronico },
                    include: [Rol_1.Rol]
                });
                if (!user) {
                    return res.status(404).json({
                        status: 404,
                        message: 'El usuario no está registrado.'
                    });
                }
                // Check password
                // Note: Laravel uses Bcrypt. verification should work if logic is same.
                const isMatch = yield bcryptjs_1.default.compare(password, user.password);
                if (!isMatch) {
                    return res.status(401).json({
                        status: 401,
                        message: 'Credenciales inválidas. Por favor, verifica tu correo y contraseña.'
                    });
                }
                // Generate Token
                const token = jsonwebtoken_1.default.sign({ id_usuario: user.id_usuario, rol: (_a = user.rol) === null || _a === void 0 ? void 0 : _a.nombre_rol }, process.env.JWT_SECRET || 'secret', { expiresIn: (process.env.JWT_EXPIRES_IN || '1d') });
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
                            rol: (_b = user.rol) === null || _b === void 0 ? void 0 : _b.nombre_rol,
                            prefix_rol: (_c = user.rol) === null || _c === void 0 ? void 0 : _c.prefix_rol,
                        }
                    }
                });
            }
            catch (error) {
                console.error('Login Error:', error);
                return res.status(500).json({
                    status: 500,
                    message: 'Ocurrió un problema al intentar iniciar sesión.',
                    error: error
                });
            }
        });
    }
    // Me
    static me(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                // @ts-ignore - User attached by middleware
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id_usuario;
                if (!userId) {
                    return res.status(401).json({ message: 'No autenticado.' });
                }
                const user = yield Usuario_1.Usuario.findByPk(userId, { include: [Rol_1.Rol] });
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
                        rol: (_b = user.rol) === null || _b === void 0 ? void 0 : _b.nombre_rol,
                        prefix_rol: (_c = user.rol) === null || _c === void 0 ? void 0 : _c.prefix_rol,
                    }
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: 500,
                    message: 'Error al obtener datos del usuario.',
                    error: error
                });
            }
        });
    }
}
exports.AuthController = AuthController;
