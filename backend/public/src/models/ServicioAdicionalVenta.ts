import { Table, Column, Model, DataType, PrimaryKey } from 'sequelize-typescript';

@Table({
    tableName: 'servicios_adicionales_ventas',
    timestamps: true,
})
export class ServicioAdicionalVenta extends Model {
    @PrimaryKey
    @Column({ type: DataType.INTEGER, autoIncrement: true })
    id!: number;

    @Column(DataType.STRING)
    codigo!: string;

    @Column(DataType.STRING)
    nombre!: string;

    @Column(DataType.STRING)
    periodicidad!: string; // 'MENSUAL' | 'UNICO'

    @Column(DataType.DECIMAL(10, 2))
    precio!: number;

    @Column(DataType.STRING)
    descripcion!: string;

    @Column(DataType.BOOLEAN)
    activo!: boolean;
}
