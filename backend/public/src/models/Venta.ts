import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo, HasOne } from 'sequelize-typescript';
import { Cliente } from './Cliente';
import { Usuario } from './Usuario';
import { InformacionContacto } from './InformacionContacto';
import { InformacionDomicilio } from './InformacionDomicilio';
import { InformacionDocumentos } from './InformacionDocumentos';
import { InformacionBeneficiarioAdicional } from './InformacionBeneficiarioAdicional';
import { InformacionServiciosContratados } from './InformacionServiciosContratados';

@Table({
    tableName: 'ventas',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion'
})
export class Venta extends Model {
    @PrimaryKey
    @Column({ type: DataType.INTEGER, autoIncrement: true })
    id_venta!: number;

    @ForeignKey(() => Cliente)
    @Column({ type: DataType.INTEGER, allowNull: false })
    cliente_id!: number;

    @BelongsTo(() => Cliente)
    cliente!: Cliente;

    @ForeignKey(() => Usuario)
    @Column({ type: DataType.INTEGER, allowNull: true })
    id_vendedor!: number;

    @BelongsTo(() => Usuario)
    vendedor!: Usuario;

    @Column({ type: DataType.STRING, unique: true })
    serie_contrato!: string;

    @Column(DataType.STRING)
    tipo_contrato!: string;

    @Column(DataType.STRING)
    sede_contrato!: string;

    @Column({ type: DataType.DATEONLY, defaultValue: DataType.NOW })
    fecha_venta!: string;

    @Column({ type: DataType.STRING, defaultValue: 'BORRADOR' })
    estado!: string;

    // Relaciones 1:1 con tablas de información
    @HasOne(() => InformacionContacto)
    informacionContacto!: InformacionContacto;

    @HasOne(() => InformacionDomicilio)
    informacionDomicilio!: InformacionDomicilio;

    @HasOne(() => InformacionDocumentos)
    informacionDocumentos!: InformacionDocumentos;

    @HasOne(() => InformacionBeneficiarioAdicional)
    informacionBeneficiarioAdicional!: InformacionBeneficiarioAdicional;

    @HasOne(() => InformacionServiciosContratados)
    informacionServiciosContratados!: InformacionServiciosContratados;
}
