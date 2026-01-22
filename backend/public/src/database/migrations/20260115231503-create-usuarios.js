'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usuarios', {
      id_usuario: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_rol: {
        type: Sequelize.INTEGER,
        references: {
          model: 'roles',
          key: 'id_rol'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      nombres: {
        type: Sequelize.STRING
      },
      apellidos: {
        type: Sequelize.STRING
      },
      identificacion: {
        type: Sequelize.STRING
      },
      correo_electronico: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      estado: {
        type: Sequelize.STRING,
        defaultValue: 'A'
      },
      id_usuario_auditor: {
        type: Sequelize.INTEGER
      },
      fecha_creacion: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      fecha_actualizacion: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('usuarios');
  }
};
