'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {

        await queryInterface.createTable('clientes', {
            id_cliente: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            nombres: { type: Sequelize.STRING, allowNull: false },
            apellidos: { type: Sequelize.STRING, allowNull: false },
            identificacion: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            fecha_nacimiento: { type: Sequelize.DATEONLY },

            es_tercera_edad: { type: Sequelize.BOOLEAN, defaultValue: false },
            es_presenta_discapacidad: { type: Sequelize.BOOLEAN, defaultValue: false },
            es_jubilado: { type: Sequelize.BOOLEAN, defaultValue: false },

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

        await queryInterface.createTable('ventas', {
            id_venta: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            cliente_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'clientes',
                    key: 'id_cliente'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            },

            id_vendedor: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'usuarios',
                    key: 'id_usuario'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },

            serie_contrato: { type: Sequelize.STRING, unique: true },
            tipo_contrato: { type: Sequelize.STRING },
            sede_contrato: { type: Sequelize.STRING },
            fecha_venta: {
                type: Sequelize.DATEONLY,
                defaultValue: Sequelize.literal('CURRENT_DATE')
            },
            estado: {
                type: Sequelize.STRING,
                defaultValue: 'BORRADOR'
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

        await queryInterface.createTable('informacion_contacto', {
            id_informacion_contacto: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            venta_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'ventas',
                    key: 'id_venta'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            telefonos: {
                type: Sequelize.JSON
            },
            correos: {
                type: Sequelize.JSON
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

        await queryInterface.createTable('informacion_domicilio', {
            id_informacion_domicilio: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            venta_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'ventas',
                    key: 'id_venta'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            direccion: { type: Sequelize.STRING, allowNull: false },
            referencia_domiciliaria: { type: Sequelize.STRING },
            ciudad: { type: Sequelize.STRING },
            provincia: { type: Sequelize.STRING },
            latitud: { type: Sequelize.STRING },
            longitud: { type: Sequelize.STRING },

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

        await queryInterface.createTable('informacion_documentos', {
            id_informacion_documentos: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            venta_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'ventas',
                    key: 'id_venta'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            documentos: {
                type: Sequelize.JSON
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

        await queryInterface.createTable('informacion_beneficiario_adicional', {
            id_informacion_beneficiario_adicional: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            venta_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'ventas',
                    key: 'id_venta'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            identificacion: { type: Sequelize.STRING },
            nombres: { type: Sequelize.STRING },
            apellidos: { type: Sequelize.STRING },
            porcentaje: { type: Sequelize.DECIMAL(5, 2) },
            cedula_frontal: { type: Sequelize.STRING },
            cedula_trasera: { type: Sequelize.STRING },
            carnet: { type: Sequelize.STRING },

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

        await queryInterface.createTable('informacion_servicios_contratados', {
            id_informacion_servicios_contratados: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            venta_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'ventas',
                    key: 'id_venta'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            plan_contratado: {
                type: Sequelize.JSON
            },
            servicios_adicionales: {
                type: Sequelize.JSON
            },
            informacion_pago: {
                type: Sequelize.JSON
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
        await queryInterface.dropTable('informacion_servicios_contratados');
        await queryInterface.dropTable('informacion_beneficiario_adicional');
        await queryInterface.dropTable('informacion_documentos');
        await queryInterface.dropTable('informacion_domicilio');
        await queryInterface.dropTable('informacion_contacto');
        await queryInterface.dropTable('ventas');
        await queryInterface.dropTable('clientes');
    }
};
