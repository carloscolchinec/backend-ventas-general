import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { VentasClienteCedula } from './VentasClienteCedula';

@Table({
    tableName: 'ventas_beneficiarios',
    timestamps: true,
})
export class VentaBeneficiario extends Model {
    @ForeignKey(() => VentasClienteCedula)
    @Column(DataType.INTEGER)
    venta_id!: number;

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

    @BelongsTo(() => VentasClienteCedula)
    venta!: VentasClienteCedula;

    @Column({ field: 'created_at' })
    createdAt!: Date;

    @Column({ field: 'updated_at' })
    updatedAt!: Date;
}
