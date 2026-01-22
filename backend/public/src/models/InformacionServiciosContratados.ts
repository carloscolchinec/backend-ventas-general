import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Venta } from './Venta';

@Table({
    tableName: 'informacion_servicios_contratados',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion'
})
export class InformacionServiciosContratados extends Model {
    @PrimaryKey
    @Column({ type: DataType.INTEGER, autoIncrement: true })
    id_informacion_servicios_contratados!: number;

    @ForeignKey(() => Venta)
    @Column({ type: DataType.INTEGER, allowNull: false })
    venta_id!: number;

    @BelongsTo(() => Venta)
    venta!: Venta;

    @Column(DataType.JSON)
    plan_contratado!: any;

    @Column(DataType.JSON)
    servicios_adicionales!: any;

    @Column(DataType.JSON)
    informacion_pago!: any;
}
