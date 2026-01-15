"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const catalogosRoutes_1 = __importDefault(require("./catalogosRoutes"));
const ventasRoutes_1 = __importDefault(require("./ventasRoutes"));
const router = (0, express_1.Router)();
// Mount auth routes directly to match /api/login
router.use('/', authRoutes_1.default);
router.use('/catalogos', catalogosRoutes_1.default);
router.use('/ventas', ventasRoutes_1.default);
exports.default = router;
