"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VentasClienteCedula = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const MetodoPagoVenta_1 = require("./MetodoPagoVenta");
const Plan_1 = require("./Plan");
const ServicioAdicionalVenta_1 = require("./ServicioAdicionalVenta");
const Usuario_1 = require("./Usuario");
const sequelize_typescript_2 = require("sequelize-typescript");
const VentaPagoTarjeta_1 = require("./VentaPagoTarjeta");
const VentaPagoCuenta_1 = require("./VentaPagoCuenta");
const VentaBeneficiario_1 = require("./VentaBeneficiario");
const VentasHistorial_1 = require("./VentasHistorial");
let VentasClienteCedula = class VentasClienteCedula extends sequelize_typescript_1.Model {
    // Extra property for virtual accessor
    get nombreCompleto() {
        return `${this.nombres} ${this.apellidos}`;
    }
};
exports.VentasClienteCedula = VentasClienteCedula;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, autoIncrement: true }),
    __metadata("design:type", Number)
], VentasClienteCedula.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], VentasClienteCedula.prototype, "serie_contrato", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], VentasClienteCedula.prototype, "identificacion", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], VentasClienteCedula.prototype, "nombres", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], VentasClienteCedula.prototype, "apellidos", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATEONLY),
    __metadata("design:type", String)
], VentasClienteCedula.prototype, "fecha_nacimiento", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], VentasClienteCedula.prototype, "es_tercera_edad", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], VentasClienteCedula.prototype, "es_presenta_discapacidad", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], VentasClienteCedula.prototype, "direccion", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], VentasClienteCedula.prototype, "referencia_domiciliaria", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], VentasClienteCedula.prototype, "ciudad", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], VentasClienteCedula.prototype, "provincia", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], VentasClienteCedula.prototype, "latitud", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], VentasClienteCedula.prototype, "longitud", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", Object)
], VentasClienteCedula.prototype, "telefonos", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", Object)
], VentasClienteCedula.prototype, "correos", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], VentasClienteCedula.prototype, "establecimiento", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], VentasClienteCedula.prototype, "tipo_cuenta_otro", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], VentasClienteCedula.prototype, "plan", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], VentasClienteCedula.prototype, "red_acceso", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], VentasClienteCedula.prototype, "nivel_comparticion", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], VentasClienteCedula.prototype, "dias_gratis", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], VentasClienteCedula.prototype, "cedula_frontal", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], VentasClienteCedula.prototype, "cedula_trasera", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], VentasClienteCedula.prototype, "planilla_luz", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], VentasClienteCedula.prototype, "firma", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], VentasClienteCedula.prototype, "estado", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING) // Sometimes backend logic puts text here?
    ,
    __metadata("design:type", String)
], VentasClienteCedula.prototype, "metodo_pago_texto", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], VentasClienteCedula.prototype, "dia_pago", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Usuario_1.Usuario),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], VentasClienteCedula.prototype, "id_usuario_registro", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => MetodoPagoVenta_1.MetodoPagoVenta),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], VentasClienteCedula.prototype, "metodo_pago_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Usuario_1.Usuario),
    __metadata("design:type", Usuario_1.Usuario)
], VentasClienteCedula.prototype, "usuarioRegistro", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => MetodoPagoVenta_1.MetodoPagoVenta),
    __metadata("design:type", MetodoPagoVenta_1.MetodoPagoVenta)
], VentasClienteCedula.prototype, "metodoPago", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => VentaPagoTarjeta_1.VentaPagoTarjeta),
    __metadata("design:type", VentaPagoTarjeta_1.VentaPagoTarjeta)
], VentasClienteCedula.prototype, "pagoTarjeta", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => VentaPagoCuenta_1.VentaPagoCuenta),
    __metadata("design:type", VentaPagoCuenta_1.VentaPagoCuenta)
], VentasClienteCedula.prototype, "pagoCuenta", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => VentaBeneficiario_1.VentaBeneficiario),
    __metadata("design:type", VentaBeneficiario_1.VentaBeneficiario)
], VentasClienteCedula.prototype, "beneficiario", void 0);
__decorate([
    (0, sequelize_typescript_2.HasMany)(() => VentasHistorial_1.VentasHistorial),
    __metadata("design:type", Array)
], VentasClienteCedula.prototype, "historial", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Plan_1.Plan, { foreignKey: 'plan', targetKey: 'nombre_plan' }),
    __metadata("design:type", Plan_1.Plan)
], VentasClienteCedula.prototype, "planEntity", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => ServicioAdicionalVenta_1.ServicioAdicionalVenta, 'servicio_adicional_venta', 'venta_id', 'servicio_adicional_id'),
    __metadata("design:type", Array)
], VentasClienteCedula.prototype, "serviciosAdicionales", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ field: 'created_at' }),
    __metadata("design:type", Date)
], VentasClienteCedula.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ field: 'updated_at' }),
    __metadata("design:type", Date)
], VentasClienteCedula.prototype, "updatedAt", void 0);
exports.VentasClienteCedula = VentasClienteCedula = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'ventas_clientes_cedula',
        timestamps: true,
    })
], VentasClienteCedula);
