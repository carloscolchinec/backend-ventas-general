import { Table, Column, Model, DataType, PrimaryKey } from 'sequelize-typescript';

@Table({
    tableName: 'tipo_banco_ventas',
    timestamps: true,
})
export class TipoBancoVenta extends Model {
    @PrimaryKey
    @Column({ type: DataType.INTEGER, autoIncrement: true })
    id!: number;

    @Column(DataType.STRING)
    nombre!: string;

    @Column(DataType.STRING)
    tipo!: string; // 'BANCO' | 'COOPERATIVA' ?

    @Column(DataType.BOOLEAN)
    activo!: boolean;

    @Column({ field: 'created_at' })
    createdAt!: Date;

    @Column({ field: 'updated_at' })
    updatedAt!: Date;
}
