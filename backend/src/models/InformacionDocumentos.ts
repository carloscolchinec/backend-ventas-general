import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Venta } from './Venta';

@Table({
    tableName: 'informacion_documentos',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion'
})
export class InformacionDocumentos extends Model {
    @PrimaryKey
    @Column({ type: DataType.INTEGER, autoIncrement: true })
    id_informacion_documentos!: number;

    @ForeignKey(() => Venta)
    @Column({ type: DataType.INTEGER, allowNull: false })
    venta_id!: number;

    @BelongsTo(() => Venta)
    venta!: Venta;

    @Column(DataType.JSON)
    documentos!: any; // JSON with URLs or paths
}
