//backend/src/routes/user.router.js
import express from "express";
import { userControllers } from "../controllers/index.js";
import { passwordHash } from '../middlewares/passwordHash.js';

const router = express.Router();

const { getUsers, getUserById, updateUser, deleteUser, registerUser, loginUser, forgotPassword } = userControllers;

// Rutas para usuarios
router.post("/register",passwordHash, registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id",deleteUser);

export default router;