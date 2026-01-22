import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Venta } from './Venta';

@Table({
    tableName: 'informacion_domicilio',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion'
})
export class InformacionDomicilio extends Model {
    @PrimaryKey
    @Column({ type: DataType.INTEGER, autoIncrement: true })
    id_informacion_domicilio!: number;

    @ForeignKey(() => Venta)
    @Column({ type: DataType.INTEGER, allowNull: false })
    venta_id!: number;

    @BelongsTo(() => Venta)
    venta!: Venta;

    @Column({ type: DataType.STRING, allowNull: false })
    direccion!: string;

    @Column(DataType.STRING)
    referencia_domiciliaria!: string;

    @Column(DataType.STRING)
    ciudad!: string;

    @Column(DataType.STRING)
    provincia!: string;

    @Column(DataType.STRING)
    latitud!: string;

    @Column(DataType.STRING)
    longitud!: string;
}
