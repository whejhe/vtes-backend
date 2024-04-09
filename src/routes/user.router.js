//backend/src/routes/user.router.js
import express from "express";
import { userControllers } from "../controllers/index.js";
// import { isPasswordValid, passwordHash } from '../middlewares/passwordHash.js';
import {auth} from "../middlewares/auth.js";
import multerMiddleware from "../middlewares/multer.middleware.js";

const router = express.Router();

const { 
    getUsers, 
    getUserById, 
    updateUser,
    updateProfileImage, 
    deleteUser,
    getAvatarOptions,
    getProfileImage,
    registerUser, 
    loginUser, 
    forgotPassword } = userControllers;

// Rutas para usuarios
router.get("/avatar-options", getAvatarOptions);
router.get("/profile-image/:id", getProfileImage);
router.post("/register",multerMiddleware,registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.put("/:id",updateProfileImage);
router.delete("/:id", auth, deleteUser);

export default router;