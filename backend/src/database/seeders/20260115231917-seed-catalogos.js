'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    // 1. METODOS PAGO
    await queryInterface.bulkInsert('metodos_pagos_ventas', [
      { codigo: 'FP01', nombre: 'EFECTIVO', activo: true, created_at: new Date(), updated_at: new Date() },
      { codigo: 'FP02', nombre: 'TRANSFERENCIA', activo: true, created_at: new Date(), updated_at: new Date() },
      { codigo: 'FP03', nombre: 'DEPOSITO', activo: true, created_at: new Date(), updated_at: new Date() },
      { codigo: 'FP04', nombre: 'TARJETA DE CREDITO / DEBITO', activo: true, created_at: new Date(), updated_at: new Date() }
    ], {});

    // 2. TIPOS BANCO
    await queryInterface.bulkInsert('tipo_banco_ventas', [
      { nombre: 'BANCO PICHINCHA', tipo: 'BANCO', activo: true, created_at: new Date(), updated_at: new Date() },
      { nombre: 'BANCO GUAYAQUIL', tipo: 'BANCO', activo: true, created_at: new Date(), updated_at: new Date() },
      { nombre: 'BANCO DEL PACIFICO', tipo: 'BANCO', activo: true, created_at: new Date(), updated_at: new Date() },
      { nombre: 'PRODUBANCO', tipo: 'BANCO', activo: true, created_at: new Date(), updated_at: new Date() },
      { nombre: 'COOP. JEP', tipo: 'COOPERATIVA', activo: true, created_at: new Date(), updated_at: new Date() }
    ], {});

    // 3. SERVICIOS ADICIONALES (Example)
    await queryInterface.bulkInsert('servicios_adicionales_ventas', [
      { codigo: 'SERV01', nombre: 'IP PUBLICA', periodicidad: 'MENSUAL', precio: 5.00, descripcion: 'Direccion IP estatica', activo: true, created_at: new Date(), updated_at: new Date() },
      { codigo: 'SERV02', nombre: 'ROUTER DUAL BAND', periodicidad: 'UNICO', precio: 35.00, descripcion: 'Router rompemuros', activo: true, created_at: new Date(), updated_at: new Date() }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('servicios_adicionales_ventas', null, {});
    await queryInterface.bulkDelete('tipo_banco_ventas', null, {});
    await queryInterface.bulkDelete('metodos_pagos_ventas', null, {});
  }
};
