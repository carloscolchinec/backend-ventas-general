"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CatalogosController_1 = require("../controllers/CatalogosController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Assuming these catalog routes are protected, or public? Laravel -> Route::middleware(['auth:api'...
// Flutter code sends header, so lets keep them protected.
router.get('/metodos-pago', authMiddleware_1.authMiddleware, CatalogosController_1.CatalogosController.metodosPago);
router.get('/tipos-banco', authMiddleware_1.authMiddleware, CatalogosController_1.CatalogosController.tiposBanco);
router.get('/servicios-adicionales', authMiddleware_1.authMiddleware, CatalogosController_1.CatalogosController.serviciosAdicionales);
exports.default = router;
