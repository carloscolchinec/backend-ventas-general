"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const VentasController_1 = require("../controllers/VentasController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware); // Protect all ventas routes
router.get('/estadisticas', VentasController_1.VentasController.estadisticas);
router.get('/verificar-identificacion', VentasController_1.VentasController.verificarIdentificacion);
router.get('/', VentasController_1.VentasController.index);
router.get('/:id', VentasController_1.VentasController.show);
exports.default = router;
