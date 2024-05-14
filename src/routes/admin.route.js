import express from "express";
import { adminControllers } from "../controllers/index.js";

const router = express.Router();

const { cambiarPermisos, loginAdmin } = adminControllers;

// Rutas para administradores
router.post("/login", loginAdmin);
router.put("/permisos", cambiarPermisos);

export default router;