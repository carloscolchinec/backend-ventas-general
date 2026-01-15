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
exports.VentaPagoCuenta = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const VentasClienteCedula_1 = require("./VentasClienteCedula");
const TipoBancoVenta_1 = require("./TipoBancoVenta");
let VentaPagoCuenta = class VentaPagoCuenta extends sequelize_typescript_1.Model {
};
exports.VentaPagoCuenta = VentaPagoCuenta;
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => VentasClienteCedula_1.VentasClienteCedula),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], VentaPagoCuenta.prototype, "venta_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => TipoBancoVenta_1.TipoBancoVenta),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], VentaPagoCuenta.prototype, "tipo_banco_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], VentaPagoCuenta.prototype, "cuenta_numero_enc", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], VentaPagoCuenta.prototype, "tipo_cuenta", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => VentasClienteCedula_1.VentasClienteCedula),
    __metadata("design:type", VentasClienteCedula_1.VentasClienteCedula)
], VentaPagoCuenta.prototype, "venta", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => TipoBancoVenta_1.TipoBancoVenta),
    __metadata("design:type", TipoBancoVenta_1.TipoBancoVenta)
], VentaPagoCuenta.prototype, "tipoBanco", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ field: 'created_at' }),
    __metadata("design:type", Date)
], VentaPagoCuenta.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ field: 'updated_at' }),
    __metadata("design:type", Date)
], VentaPagoCuenta.prototype, "updatedAt", void 0);
exports.VentaPagoCuenta = VentaPagoCuenta = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'ventas_pagos_cuentas',
        timestamps: true,
    })
], VentaPagoCuenta);
