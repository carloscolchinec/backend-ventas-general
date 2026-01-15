import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import { Usuario } from '../models/Usuario';
// Import other models here as we create them
import { Rol } from '../models/Rol';
import { MetodoPagoVenta } from '../models/MetodoPagoVenta';
import { TipoBancoVenta } from '../models/TipoBancoVenta';
import { ServicioAdicionalVenta } from '../models/ServicioAdicionalVenta';
import { VentasClienteCedula } from '../models/VentasClienteCedula';
import { VentaPagoTarjeta } from '../models/VentaPagoTarjeta';
import { VentaPagoCuenta } from '../models/VentaPagoCuenta';
import { VentaBeneficiario } from '../models/VentaBeneficiario';
import { VentasHistorial } from '../models/VentasHistorial';

dotenv.config();

export const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_password,
    database: process.env.DB_NAME,
    models: [Usuario, Rol, MetodoPagoVenta, TipoBancoVenta, ServicioAdicionalVenta, VentasClienteCedula, VentaPagoTarjeta, VentaPagoCuenta, VentaBeneficiario, VentasHistorial], // Add models here
    logging: console.log,
    define: {
        timestamps: false, // Default to false as per Laravel 'public $timestamps = false;'
    },
});

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully.');
    } catch (error) {
        console.error('❌ Database connection error:', error);
        process.exit(1);
    }
};
