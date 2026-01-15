"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public routes
router.post('/login', AuthController_1.AuthController.login);
// Protected routes
router.get('/user/me', authMiddleware_1.authMiddleware, AuthController_1.AuthController.me);
// router.post('/logout', authMiddleware, AuthController.logout); // Optional if needed
exports.default = router;
