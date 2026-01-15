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
exports.connectDB = exports.sequelize = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv_1 = __importDefault(require("dotenv"));
const Usuario_1 = require("../models/Usuario");
// Import other models here as we create them
const Rol_1 = require("../models/Rol");
const Plan_1 = require("../models/Plan");
const MetodoPagoVenta_1 = require("../models/MetodoPagoVenta");
const PlanMetodoPago_1 = require("../models/PlanMetodoPago");
const TipoBancoVenta_1 = require("../models/TipoBancoVenta");
const ServicioAdicionalVenta_1 = require("../models/ServicioAdicionalVenta");
const VentasClienteCedula_1 = require("../models/VentasClienteCedula");
const VentaPagoTarjeta_1 = require("../models/VentaPagoTarjeta");
const VentaPagoCuenta_1 = require("../models/VentaPagoCuenta");
const VentaBeneficiario_1 = require("../models/VentaBeneficiario");
const VentasHistorial_1 = require("../models/VentasHistorial");
dotenv_1.default.config();
exports.sequelize = new sequelize_typescript_1.Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_password,
    database: process.env.DB_NAME,
    models: [Usuario_1.Usuario, Rol_1.Rol, Plan_1.Plan, MetodoPagoVenta_1.MetodoPagoVenta, PlanMetodoPago_1.PlanMetodoPago, TipoBancoVenta_1.TipoBancoVenta, ServicioAdicionalVenta_1.ServicioAdicionalVenta, VentasClienteCedula_1.VentasClienteCedula, VentaPagoTarjeta_1.VentaPagoTarjeta, VentaPagoCuenta_1.VentaPagoCuenta, VentaBeneficiario_1.VentaBeneficiario, VentasHistorial_1.VentasHistorial], // Add models here
    logging: console.log,
    define: {
        timestamps: false, // Default to false as per Laravel 'public $timestamps = false;'
    },
});
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.sequelize.authenticate();
        console.log('✅ Database connected successfully.');
    }
    catch (error) {
        console.error('❌ Database connection error:', error);
        process.exit(1);
    }
});
exports.connectDB = connectDB;
