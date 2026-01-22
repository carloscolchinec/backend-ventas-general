import { Table, Column, Model, DataType, PrimaryKey, BelongsToMany } from 'sequelize-typescript';

@Table({
    tableName: 'metodos_pagos_ventas',
    timestamps: true, // Laravel has created_at/updated_at by default unless disabled
})
export class MetodoPagoVenta extends Model {
    @PrimaryKey
    @Column({ type: DataType.INTEGER, autoIncrement: true })
    id!: number;

    @Column(DataType.STRING)
    codigo!: string; // FP01, FP02, etc.

    @Column(DataType.STRING)
    nombre!: string;

    @Column(DataType.BOOLEAN)
    activo!: boolean;

    @Column({ field: 'created_at' })
    createdAt!: Date;

    @Column({ field: 'updated_at' })
    updatedAt!: Date;

}
