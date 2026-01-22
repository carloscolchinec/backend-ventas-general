import { Table, Column, Model, DataType, HasMany, PrimaryKey } from 'sequelize-typescript';
import { Usuario } from './Usuario';

@Table({
    tableName: 'roles',
    timestamps: false,
})
export class Rol extends Model {
    @PrimaryKey
    @Column(DataType.INTEGER)
    id_rol!: number;

    @Column(DataType.STRING)
    nombre_rol!: string;

    @Column(DataType.STRING)
    prefix_rol!: string;

    @Column(DataType.STRING)
    descripcion_rol!: string;

    @Column(DataType.STRING)
    estado!: string;

    @HasMany(() => Usuario)
    usuarios!: Usuario[];
}
