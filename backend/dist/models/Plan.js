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
exports.Plan = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const MetodoPagoVenta_1 = require("./MetodoPagoVenta");
const PlanMetodoPago_1 = require("./PlanMetodoPago");
let Plan = class Plan extends sequelize_typescript_1.Model {
};
exports.Plan = Plan;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        autoIncrement: true,
        field: 'id_plan' // Explicitly mapped
    }),
    __metadata("design:type", Number)
], Plan.prototype, "id_plan", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Plan.prototype, "nombre_plan", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Plan.prototype, "descripcion_plan", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Plan.prototype, "mb_subida", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Plan.prototype, "mb_bajada", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2)),
    __metadata("design:type", Number)
], Plan.prototype, "precio", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Plan.prototype, "nivel_comparticion", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Plan.prototype, "tipo_red", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Plan.prototype, "estado", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => MetodoPagoVenta_1.MetodoPagoVenta, () => PlanMetodoPago_1.PlanMetodoPago),
    __metadata("design:type", Array)
], Plan.prototype, "metodosDePago", void 0);
exports.Plan = Plan = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'planes',
        timestamps: false,
    })
], Plan);
