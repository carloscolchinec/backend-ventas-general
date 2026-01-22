import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { VentasClienteCedula } from './VentasClienteCedula';
import { TipoBancoVenta } from './TipoBancoVenta';

@Table({
    tableName: 'ventas_pagos_cuentas',
    timestamps: true,
})
export class VentaPagoCuenta extends Model {
    @ForeignKey(() => VentasClienteCedula)
    @Column(DataType.INTEGER)
    venta_id!: number;

    @ForeignKey(() => TipoBancoVenta)
    @Column(DataType.INTEGER)
    tipo_banco_id!: number;

    @Column(DataType.STRING)
    cuenta_numero_enc!: string;

    @Column(DataType.STRING)
    tipo_cuenta!: string;

    @BelongsTo(() => VentasClienteCedula)
    venta!: VentasClienteCedula;

    @BelongsTo(() => TipoBancoVenta)
    tipoBanco!: TipoBancoVenta;

    @Column({ field: 'created_at' })
    createdAt!: Date;

    @Column({ field: 'updated_at' })
    updatedAt!: Date;
}
