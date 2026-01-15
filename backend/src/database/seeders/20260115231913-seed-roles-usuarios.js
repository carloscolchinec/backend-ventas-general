'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. ROLES
    await queryInterface.bulkInsert('roles', [
      {
        id_rol: 1,
        nombre_rol: 'ADMINISTRADOR',
        prefix_rol: 'ADMIN',
        descripcion_rol: 'Acceso total al sistema',
        estado: 'A'
      },
      {
        id_rol: 2,
        nombre_rol: 'VENDEDOR',
        prefix_rol: 'VEND',
        descripcion_rol: 'Acceso limitado a ventas',
        estado: 'A'
      }
    ], {});

    // 2. USUARIOS (Default Admin)
    const hashedPassword = await bcrypt.hash('test123', 10);

    await queryInterface.bulkInsert('usuarios', [{
      id_rol: 1,
      nombres: 'Carlos Ariel',
      apellidos: 'Colcha Benitez',
      identificacion: '0000000000',
      correo_electronico: 'carlosarielcb3@gmail.com',
      password: hashedPassword,
      estado: 'A',
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios', null, {});
    await queryInterface.bulkDelete('roles', null, {});
  }
};
