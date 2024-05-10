//backend/src/models/report.model.js
import express from "express";
import { reportController } from "../controllers/index.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

const { createReport } = reportController;

router.post("/",auth, createReport);

export default router;