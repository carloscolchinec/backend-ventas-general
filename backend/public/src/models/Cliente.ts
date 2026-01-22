import { Table, Column, Model, DataType, PrimaryKey, HasMany } from 'sequelize-typescript';
import { Venta } from './Venta';

@Table({
    tableName: 'clientes',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion'
})
export class Cliente extends Model {
    @PrimaryKey
    @Column({ type: DataType.INTEGER, autoIncrement: true })
    id_cliente!: number;

    @Column({ type: DataType.STRING, allowNull: false })
    nombres!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    apellidos!: string;

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    identificacion!: string;

    @Column(DataType.DATEONLY)
    fecha_nacimiento!: string;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    es_tercera_edad!: boolean;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    es_presenta_discapacidad!: boolean;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    es_jubilado!: boolean;

    @HasMany(() => Venta)
    ventas!: Venta[];
}
