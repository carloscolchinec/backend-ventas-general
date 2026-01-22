'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            // 1. Create a Client
            const [clienteId] = await queryInterface.bulkInsert('clientes', [{
                nombres: 'JUAN ALBERTO',
                apellidos: 'PEREZ LOPEZ',
                identificacion: '1722334455',
                fecha_nacimiento: '1985-05-20',
                es_tercera_edad: false,
                es_presenta_discapacidad: false,
                es_jubilado: false,
                fecha_creacion: new Date(),
                fecha_actualizacion: new Date()
            }], { transaction, returning: ['id_cliente'] });

            // Note: returning id might depend on dialect/version, simpler to just query it if needed or assume auto increment starts at 1 if fresh. 
            // But let's assume we can fetch it or just use an arbitrary one if we were using UUIDs.
            // For auto-increment integer ID in bulkInsert sometimes it returns keys, sometimes not easily.
            // Let's fetch the ID back to be safe and robust.

            const clients = await queryInterface.sequelize.query(
                `SELECT id_cliente FROM clientes WHERE identificacion = '1722334455' LIMIT 1;`,
                { transaction, type: queryInterface.sequelize.QueryTypes.SELECT }
            );
            const id_cliente = clients[0].id_cliente;

            // 2. Create a Sale (Venta)
            await queryInterface.bulkInsert('ventas', [{
                cliente_id: id_cliente,
                serie_contrato: 'CTR-2026-001',
                tipo_contrato: 'ISP',
                sede_contrato: 'MATRIZ-QUITO',
                fecha_venta: new Date(),
                estado: 'APROBADO',
                fecha_creacion: new Date(),
                fecha_actualizacion: new Date()
            }], { transaction });

            const ventas = await queryInterface.sequelize.query(
                `SELECT id_venta FROM ventas WHERE serie_contrato = 'CTR-2026-001' LIMIT 1;`,
                { transaction, type: queryInterface.sequelize.QueryTypes.SELECT }
            );
            const id_venta = ventas[0].id_venta;

            // 3. Insert Details (Satellites)

            // Contacto
            await queryInterface.bulkInsert('informacion_contacto', [{
                venta_id: id_venta,
                telefonos: JSON.stringify(['0998877665', '022334455']),
                correos: JSON.stringify(['juan.perez@email.com']),
                fecha_creacion: new Date(),
                fecha_actualizacion: new Date()
            }], { transaction });

            // Domicilio
            await queryInterface.bulkInsert('informacion_domicilio', [{
                venta_id: id_venta,
                direccion: 'Av. Amazonas y Naciones Unidas',
                referencia_domiciliaria: 'Frente al CCI',
                ciudad: 'Quito',
                provincia: 'Pichincha',
                latitud: '-0.180653',
                longitud: '-78.467834',
                fecha_creacion: new Date(),
                fecha_actualizacion: new Date()
            }], { transaction });

            // Documentos
            await queryInterface.bulkInsert('informacion_documentos', [{
                venta_id: id_venta,
                documentos: JSON.stringify({
                    cedula_frontal: '/uploads/cedula_f.jpg',
                    contrato_firmado: '/uploads/contract.pdf'
                }),
                fecha_creacion: new Date(),
                fecha_actualizacion: new Date()
            }], { transaction });

            // Servicios Contratados
            await queryInterface.bulkInsert('informacion_servicios_contratados', [{
                venta_id: id_venta,
                plan_contratado: JSON.stringify({
                    nombre: 'PLAN FIBRA 500MB',
                    velocidad: 500,
                    precio_base: 29.99
                }),
                servicios_adicionales: JSON.stringify([
                    { nombre: 'IP Fija', precio: 5.00 },
                    { nombre: 'Router Dual Band', precio: 0.00 }
                ]),
                fecha_creacion: new Date(),
                fecha_actualizacion: new Date()
            }], { transaction });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.bulkDelete('informacion_servicios_contratados', null, { transaction });
            await queryInterface.bulkDelete('informacion_documentos', null, { transaction });
            await queryInterface.bulkDelete('informacion_domicilio', null, { transaction });
            await queryInterface.bulkDelete('informacion_contacto', null, { transaction });
            await queryInterface.bulkDelete('ventas', null, { transaction });
            await queryInterface.bulkDelete('clientes', { identificacion: '1722334455' }, { transaction });
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
};
