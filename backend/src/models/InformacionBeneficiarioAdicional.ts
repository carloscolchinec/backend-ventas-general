import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Venta } from './Venta';

@Table({
    tableName: 'informacion_beneficiario_adicional',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion'
})
export class InformacionBeneficiarioAdicional extends Model {
    @PrimaryKey
    @Column({ type: DataType.INTEGER, autoIncrement: true })
    id_informacion_beneficiario_adicional!: number;

    @ForeignKey(() => Venta)
    @Column({ type: DataType.INTEGER, allowNull: false })
    venta_id!: number;

    @BelongsTo(() => Venta)
    venta!: Venta;

    @Column(DataType.STRING)
    identificacion!: string;

    @Column(DataType.STRING)
    nombres!: string;

    @Column(DataType.STRING)
    apellidos!: string;

    @Column(DataType.DECIMAL(5, 2))
    porcentaje!: number;

    @Column(DataType.STRING)
    cedula_frontal!: string;

    @Column(DataType.STRING)
    cedula_trasera!: string;

    @Column(DataType.STRING)
    carnet!: string;
}
