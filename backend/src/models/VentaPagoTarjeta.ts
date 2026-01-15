import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { VentasClienteCedula } from './VentasClienteCedula';

@Table({
    tableName: 'ventas_pagos_tarjetas',
    timestamps: true,
})
export class VentaPagoTarjeta extends Model {
    @ForeignKey(() => VentasClienteCedula)
    @Column(DataType.INTEGER)
    venta_id!: number;

    @Column(DataType.STRING)
    tarjeta_numero_enc!: string;

    @Column(DataType.STRING)
    tarjeta_last4!: string;

    @Column(DataType.STRING)
    tarjeta_exp!: string;

    @BelongsTo(() => VentasClienteCedula)
    venta!: VentasClienteCedula;

    @Column({ field: 'created_at' })
    createdAt!: Date;

    @Column({ field: 'updated_at' })
    updatedAt!: Date;
}
