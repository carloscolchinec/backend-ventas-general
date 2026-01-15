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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VentasController = void 0;
const VentasClienteCedula_1 = require("../models/VentasClienteCedula");
const VentaBeneficiario_1 = require("../models/VentaBeneficiario");
const MetodoPagoVenta_1 = require("../models/MetodoPagoVenta");
const VentaPagoTarjeta_1 = require("../models/VentaPagoTarjeta");
const VentaPagoCuenta_1 = require("../models/VentaPagoCuenta");
const Plan_1 = require("../models/Plan");
const VentasHistorial_1 = require("../models/VentasHistorial");
// import { ServicioAdicionalVenta } from '../models/ServicioAdicionalVenta';
class VentasController {
    // GET /ventas
    static index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                // @ts-ignore
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id_usuario;
                // @ts-ignore
                const userRol = (_b = req.user) === null || _b === void 0 ? void 0 : _b.rol;
                const whereClause = (userRol === 'admin') ? {} : { id_usuario_registro: userId };
                const ventas = yield VentasClienteCedula_1.VentasClienteCedula.findAll({
                    where: whereClause,
                    include: [
                        { model: VentaBeneficiario_1.VentaBeneficiario },
                        { model: MetodoPagoVenta_1.MetodoPagoVenta },
                        { model: VentaPagoTarjeta_1.VentaPagoTarjeta },
                        { model: VentaPagoCuenta_1.VentaPagoCuenta, include: ['tipoBanco'] }
                    ],
                    order: [['created_at', 'DESC']],
                    limit: 100
                });
                return res.json({ ventas });
            }
            catch (error) {
                console.error('Error fetching ventas:', error);
                return res.status(500).json({ message: 'Error al obtener ventas.' });
            }
        });
    }
    // GET /ventas/estadisticas
    static estadisticas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Logic mirrored from VentasClienteController::estadisticas
                // Laravel: 
                // $registrados = VentasClienteCedula::where('estado', 'A')->count();
                // $rechazados = VentasClienteCedula::where('estado', 'R')->count();
                // $procesoInstalacion = VentasClienteCedula::where('estado', 'I')->count(); // Assuming 'I' is install process for now, logic to be verified
                // Using simple counts for demo matching user request "statistics"
                const registrados = yield VentasClienteCedula_1.VentasClienteCedula.count({ where: { estado: 'A' } });
                const rechazados = yield VentasClienteCedula_1.VentasClienteCedula.count({ where: { estado: 'R' } });
                const procesoInstalacion = yield VentasClienteCedula_1.VentasClienteCedula.count({ where: { estado: 'P' } }); // P = Pendiente/Proceso? Verify actual logic later
                return res.json({
                    registrados,
                    rechazados,
                    proceso_instalacion: procesoInstalacion // Using snake_case for consistency with previous API
                });
            }
            catch (error) {
                console.error('Error fetching statistics:', error);
                return res.status(500).json({ message: 'Error al obtener estadísticas.' });
            }
        });
    }
    // GET /ventas/verificar-identificacion?identificacion=xyz
    static verificarIdentificacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { identificacion } = req.query;
                if (!identificacion) {
                    return res.status(400).json({ message: 'Identificación requerida.' });
                }
                const existingSale = yield VentasClienteCedula_1.VentasClienteCedula.findOne({
                    where: { identificacion: identificacion }
                });
                if (existingSale) {
                    return res.json({
                        exists: true,
                        message: 'El cliente ya tiene una venta registrada.',
                        venta: existingSale
                    });
                }
                return res.json({
                    exists: false,
                    message: 'Identificación disponible.'
                });
            }
            catch (error) {
                console.error('Error verifying ID:', error);
                return res.status(500).json({ message: 'Error al verificar identificación.' });
            }
        });
    }
    // GET /ventas/:id
    static show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                // Search by ID or Identificacion
                const whereClause = isNaN(Number(id))
                    ? { identificacion: id }
                    : { id: id };
                const venta = yield VentasClienteCedula_1.VentasClienteCedula.findOne({
                    where: whereClause,
                    include: [
                        { model: VentaBeneficiario_1.VentaBeneficiario },
                        { model: MetodoPagoVenta_1.MetodoPagoVenta },
                        { model: VentaPagoTarjeta_1.VentaPagoTarjeta },
                        { model: VentaPagoCuenta_1.VentaPagoCuenta, include: ['tipoBanco'] },
                        { model: Plan_1.Plan, as: 'planEntity' },
                        { model: VentasHistorial_1.VentasHistorial }
                        // { model: ServicioAdicionalVenta } // Start with basic includes, check join table if needed
                    ]
                });
                if (!venta) {
                    return res.status(404).json({ message: 'Venta no encontrada.' });
                }
                // In Laravel, 'rawData' logic in Flutter suggests it receives flat JSON, 
                // but strict relationship structure is cleaner. 
                // We return the sequelize object which serializes to JSON.
                // Flutter expects 'plan_entity' -> mapped by 'planEntity' in JSON (if configured)
                return res.json(venta);
            }
            catch (error) {
                console.error('Error fetching venta detail:', error);
                return res.status(500).json({ message: 'Error al obtener detalle de venta.' });
            }
        });
    }
}
exports.VentasController = VentasController;
