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
exports.CatalogosController = void 0;
const MetodoPagoVenta_1 = require("../models/MetodoPagoVenta");
const TipoBancoVenta_1 = require("../models/TipoBancoVenta");
const ServicioAdicionalVenta_1 = require("../models/ServicioAdicionalVenta");
class CatalogosController {
    // GET /catalogos/metodos-pago
    static metodosPago(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield MetodoPagoVenta_1.MetodoPagoVenta.findAll({
                    where: { activo: true }
                });
                return res.json({ data }); // Helper wrapper to match Flutter expectation if needed, or check existing Laravel response
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error al obtener métodos de pago' });
            }
        });
    }
    // GET /catalogos/tipos-banco
    static tiposBanco(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield TipoBancoVenta_1.TipoBancoVenta.findAll({
                    where: { activo: true }
                });
                return res.json({ data });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error al obtener tipos de banco' });
            }
        });
    }
    // GET /catalogos/servicios-adicionales
    static serviciosAdicionales(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield ServicioAdicionalVenta_1.ServicioAdicionalVenta.findAll({
                    where: { activo: true }
                });
                return res.json({ data });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error al obtener servicios adicionales' });
            }
        });
    }
}
exports.CatalogosController = CatalogosController;
