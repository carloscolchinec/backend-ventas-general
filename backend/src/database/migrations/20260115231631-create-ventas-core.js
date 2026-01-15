'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Ventas Cliente Cedula
    await queryInterface.createTable('ventas_clientes_cedula', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      serie_contrato: { type: Sequelize.STRING },
      identificacion: { type: Sequelize.STRING },
      nombres: { type: Sequelize.STRING },
      apellidos: { type: Sequelize.STRING },
      fecha_nacimiento: { type: Sequelize.DATEONLY },
      es_tercera_edad: { type: Sequelize.BOOLEAN },
      es_presenta_discapacidad: { type: Sequelize.BOOLEAN },
      direccion: { type: Sequelize.STRING },
      referencia_domiciliaria: { type: Sequelize.STRING },
      ciudad: { type: Sequelize.STRING },
      provincia: { type: Sequelize.STRING },
      latitud: { type: Sequelize.STRING },
      longitud: { type: Sequelize.STRING },
      telefonos: { type: Sequelize.JSON },
      correos: { type: Sequelize.JSON },
      establecimiento: { type: Sequelize.STRING },
      plan: {
        type: Sequelize.STRING
      },
      red_acceso: { type: Sequelize.STRING },
      nivel_comparticion: { type: Sequelize.STRING },
      dias_gratis: { type: Sequelize.INTEGER },
      cedula_frontal: { type: Sequelize.STRING },
      cedula_trasera: { type: Sequelize.STRING },
      planilla_luz: { type: Sequelize.STRING },
      firma: { type: Sequelize.STRING },
      estado: { type: Sequelize.STRING },
      metodo_pago_texto: { type: Sequelize.STRING },
      dia_pago: { type: Sequelize.INTEGER },
      id_usuario_registro: {
        type: Sequelize.INTEGER,
        references: {
          model: 'usuarios',
          key: 'id_usuario'
        }
      },
      metodo_pago_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'metodos_pagos_ventas',
          key: 'id'
        }
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // 2. Ventas Beneficiarios
    await queryInterface.createTable('ventas_beneficiarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      venta_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ventas_clientes_cedula',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      identificacion: { type: Sequelize.STRING },
      nombres: { type: Sequelize.STRING },
      apellidos: { type: Sequelize.STRING },
      porcentaje: { type: Sequelize.DECIMAL(5, 2) },
      cedula_frontal: { type: Sequelize.STRING },
      cedula_trasera: { type: Sequelize.STRING },
      carnet: { type: Sequelize.STRING },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // 3. Ventas Pagos Tarjetas
    await queryInterface.createTable('ventas_pagos_tarjetas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      venta_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ventas_clientes_cedula',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      tarjeta_numero_enc: { type: Sequelize.STRING },
      tarjeta_last4: { type: Sequelize.STRING },
      tarjeta_exp: { type: Sequelize.STRING },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // 4. Ventas Pagos Cuentas
    await queryInterface.createTable('ventas_pagos_cuentas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      venta_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ventas_clientes_cedula',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      tipo_banco_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'tipo_banco_ventas',
          key: 'id'
        }
      },
      cuenta_numero_enc: { type: Sequelize.STRING },
      tipo_cuenta: { type: Sequelize.STRING },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // 5. Ventas Historial
    await queryInterface.createTable('ventas_historial', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_venta: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ventas_clientes_cedula',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        references: {
          model: 'usuarios',
          key: 'id_usuario'
        }
      },
      estado: { type: Sequelize.STRING },
      observacion: { type: Sequelize.STRING },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // 6. Servicio Adicional Venta (Pivot)
    await queryInterface.createTable('servicio_adicional_venta', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      venta_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ventas_clientes_cedula',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      servicio_adicional_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'servicios_adicionales_ventas',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      precio_unitario: { type: Sequelize.DECIMAL(10, 2) },
      cantidad: { type: Sequelize.INTEGER },
      total: { type: Sequelize.DECIMAL(10, 2) },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('servicio_adicional_venta');
    await queryInterface.dropTable('ventas_historial');
    await queryInterface.dropTable('ventas_pagos_cuentas');
    await queryInterface.dropTable('ventas_pagos_tarjetas');
    await queryInterface.dropTable('ventas_beneficiarios');
    await queryInterface.dropTable('ventas_clientes_cedula');
  }
};
