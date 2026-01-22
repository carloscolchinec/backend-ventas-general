import { Table, Column, Model, DataType, BelongsTo, PrimaryKey, ForeignKey } from 'sequelize-typescript';
import { Rol } from './Rol';

@Table({
    tableName: 'usuarios',
    timestamps: false,
})
export class Usuario extends Model {
    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true, // Assuming it's auto-increment
        field: 'id_usuario'
    })
    id_usuario!: number;

    @ForeignKey(() => Rol)
    @Column(DataType.INTEGER)
    id_rol!: number;

    @Column(DataType.STRING)
    nombres!: string;

    @Column(DataType.STRING)
    apellidos!: string;

    @Column(DataType.STRING)
    identificacion!: string;

    @Column(DataType.STRING)
    correo_electronico!: string;

    @Column(DataType.STRING)
    password!: string;

    @Column(DataType.STRING)
    estado!: string;

    @Column(DataType.INTEGER)
    id_usuario_auditor!: number;

    // Timestamps mapping
    @Column({ field: 'fecha_creacion', type: DataType.DATE })
    fecha_creacion!: Date;

    @Column({ field: 'fecha_actualizacion', type: DataType.DATE })
    fecha_actualizacion!: Date;

    @BelongsTo(() => Rol)
    rol!: Rol;

    @Column(DataType.VIRTUAL)
    get nombreCompleto(): string {
        return `${this.nombres} ${this.apellidos}`;
    }
}
