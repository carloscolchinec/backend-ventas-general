import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo, HasOne, BelongsToMany } from 'sequelize-typescript';
import { MetodoPagoVenta } from './MetodoPagoVenta';
import { ServicioAdicionalVenta } from './ServicioAdicionalVenta';
import { Usuario } from './Usuario';
import { HasMany } from 'sequelize-typescript';
import { VentaPagoTarjeta } from './VentaPagoTarjeta';
import { VentaPagoCuenta } from './VentaPagoCuenta';
import { VentaBeneficiario } from './VentaBeneficiario';
import { VentasHistorial } from './VentasHistorial';

@Table({
    tableName: 'ventas_clientes_cedula',
    timestamps: true,
})
export class VentasClienteCedula extends Model {
    @PrimaryKey
    @Column({ type: DataType.INTEGER, autoIncrement: true })
    id!: number;

    @Column(DataType.STRING)
    serie_contrato!: string;

    @Column(DataType.STRING)
    identificacion!: string;

    @Column(DataType.STRING)
    nombres!: string;

    @Column(DataType.STRING)
    apellidos!: string;

    @Column(DataType.DATEONLY)
    fecha_nacimiento!: string;

    @Column(DataType.BOOLEAN)
    es_tercera_edad!: boolean;

    @Column(DataType.BOOLEAN)
    es_presenta_discapacidad!: boolean;

    @Column(DataType.STRING)
    direccion!: string;

    @Column(DataType.STRING)
    referencia_domiciliaria!: string;

    @Column(DataType.STRING)
    ciudad!: string;

    @Column(DataType.STRING)
    provincia!: string;

    @Column(DataType.STRING)
    latitud!: string;

    @Column(DataType.STRING)
    longitud!: string;

    @Column(DataType.JSON)
    telefonos!: any;

    @Column(DataType.JSON)
    correos!: any;

    @Column(DataType.STRING)
    establecimiento!: string;


    @Column(DataType.STRING)
    plan!: string;

    @Column(DataType.STRING)
    red_acceso!: string;

    @Column(DataType.STRING)
    nivel_comparticion!: string;

    @Column(DataType.INTEGER)
    dias_gratis!: number;

    @Column(DataType.STRING)
    cedula_frontal!: string;

    @Column(DataType.STRING)
    cedula_trasera!: string;

    @Column(DataType.STRING)
    planilla_luz!: string;

    @Column(DataType.STRING)
    firma!: string;

    @Column(DataType.STRING)
    estado!: string; // 'A', 'I', 'P', 'R', etc.

    @Column(DataType.STRING) // Sometimes backend logic puts text here?
    metodo_pago_texto!: string;

    @Column(DataType.INTEGER)
    dia_pago!: number;


    // Foreign Keys
    @ForeignKey(() => Usuario)
    @Column(DataType.INTEGER)
    id_usuario_registro!: number;

    @ForeignKey(() => MetodoPagoVenta)
    @Column(DataType.INTEGER)
    metodo_pago_id!: number;

    // Relationships
    @BelongsTo(() => Usuario)
    usuarioRegistro!: Usuario;

    @BelongsTo(() => MetodoPagoVenta)
    metodoPago!: MetodoPagoVenta;

    @HasOne(() => VentaPagoTarjeta)
    pagoTarjeta!: VentaPagoTarjeta;

    @HasOne(() => VentaPagoCuenta)
    pagoCuenta!: VentaPagoCuenta;

    @HasOne(() => VentaBeneficiario)
    beneficiario!: VentaBeneficiario;

    @HasMany(() => VentasHistorial)
    historial!: VentasHistorial[];

    @BelongsToMany(() => ServicioAdicionalVenta, 'servicio_adicional_venta', 'venta_id', 'servicio_adicional_id')
    serviciosAdicionales!: ServicioAdicionalVenta[];

    // Extra property for virtual accessor
    get nombreCompleto(): string {
        return `${this.nombres} ${this.apellidos}`;
    }
    @Column({ field: 'created_at' })
    createdAt!: Date;

    @Column({ field: 'updated_at' })
    updatedAt!: Date;
}
