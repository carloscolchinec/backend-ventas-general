import express from 'express';
import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import app from './app';

// Import Models Explicitly
import { Cliente } from './models/Cliente';
import { Venta } from './models/Venta';
import { InformacionContacto } from './models/InformacionContacto';
import { InformacionDomicilio } from './models/InformacionDomicilio';
import { InformacionDocumentos } from './models/InformacionDocumentos';
import { InformacionBeneficiarioAdicional } from './models/InformacionBeneficiarioAdicional';
import { InformacionServiciosContratados } from './models/InformacionServiciosContratados';
import { Usuario } from './models/Usuario';
import { Rol } from './models/Rol';
import { MetodoPagoVenta } from './models/MetodoPagoVenta';
import { ServicioAdicionalVenta } from './models/ServicioAdicionalVenta';
import { TipoBancoVenta } from './models/TipoBancoVenta';
import { VentaBeneficiario } from './models/VentaBeneficiario';
import { VentaPagoCuenta } from './models/VentaPagoCuenta';
import { VentaPagoTarjeta } from './models/VentaPagoTarjeta';
import { VentasClienteCedula } from './models/VentasClienteCedula';
import { VentasHistorial } from './models/VentasHistorial';

// Load env vars
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

const port = process.env.PORT || 3000;

// Database Connection
export const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: false, // console.log
    models: [
        Cliente,
        Venta,
        InformacionContacto,
        InformacionDomicilio,
        InformacionDocumentos,
        InformacionBeneficiarioAdicional,
        InformacionServiciosContratados,
        Usuario,
        Rol,
        MetodoPagoVenta,
        ServicioAdicionalVenta,
        TipoBancoVenta,
        VentaBeneficiario,
        VentaPagoCuenta,
        VentaPagoTarjeta,
        VentasClienteCedula,
        VentasHistorial
    ],
});

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('✅ Base de datos conectada.');

        // Sync disabled in favor of migrations
        // await sequelize.sync({ alter: false }); 

        app.listen(port, () => {
            console.log(`🚀 Servidor corriendo en puerto ${port}`);
            console.log(`Environment: ${process.env.NODE_ENV}`);
        });
    } catch (error) {
        console.error('❌ Error al conectar BD:', error);
    }
}

startServer();
