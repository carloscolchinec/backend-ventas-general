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
exports.MetodoPagoVenta = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Plan_1 = require("./Plan");
const PlanMetodoPago_1 = require("./PlanMetodoPago");
let MetodoPagoVenta = class MetodoPagoVenta extends sequelize_typescript_1.Model {
};
exports.MetodoPagoVenta = MetodoPagoVenta;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, autoIncrement: true }),
    __metadata("design:type", Number)
], MetodoPagoVenta.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], MetodoPagoVenta.prototype, "codigo", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], MetodoPagoVenta.prototype, "nombre", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], MetodoPagoVenta.prototype, "activo", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ field: 'created_at' }),
    __metadata("design:type", Date)
], MetodoPagoVenta.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ field: 'updated_at' }),
    __metadata("design:type", Date)
], MetodoPagoVenta.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => Plan_1.Plan, () => PlanMetodoPago_1.PlanMetodoPago),
    __metadata("design:type", Array)
], MetodoPagoVenta.prototype, "planes", void 0);
exports.MetodoPagoVenta = MetodoPagoVenta = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'metodos_pagos_ventas',
        timestamps: true, // Laravel has created_at/updated_at by default unless disabled
    })
], MetodoPagoVenta);
