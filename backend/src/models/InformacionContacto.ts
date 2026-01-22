import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Venta } from './Venta';

@Table({
    tableName: 'informacion_contacto',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion'
})
export class InformacionContacto extends Model {
    @PrimaryKey
    @Column({ type: DataType.INTEGER, autoIncrement: true })
    id_informacion_contacto!: number;

    @ForeignKey(() => Venta)
    @Column({ type: DataType.INTEGER, allowNull: false })
    venta_id!: number;

    @BelongsTo(() => Venta)
    venta!: Venta;

    @Column(DataType.JSON)
    telefonos!: any; // string[] array

    @Column(DataType.JSON)
    correos!: any; // string[] array
}
