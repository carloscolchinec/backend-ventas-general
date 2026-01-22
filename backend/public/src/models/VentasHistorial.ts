import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { VentasClienteCedula } from './VentasClienteCedula';
import { Usuario } from './Usuario';

@Table({
    tableName: 'ventas_historial',
    timestamps: true,
})
export class VentasHistorial extends Model {
    @ForeignKey(() => VentasClienteCedula)
    @Column(DataType.INTEGER)
    id_venta!: number;

    @ForeignKey(() => Usuario)
    @Column(DataType.INTEGER)
    id_usuario!: number;

    @Column(DataType.STRING)
    estado!: string;

    @Column(DataType.STRING)
    observacion!: string;

    @BelongsTo(() => VentasClienteCedula)
    venta!: VentasClienteCedula;

    @BelongsTo(() => Usuario)
    usuario!: Usuario;

    @Column({ field: 'created_at' })
    createdAt!: Date;

    @Column({ field: 'updated_at' })
    updatedAt!: Date;
}
