//backend/src/models/report.model.js
import express from "express";
import { reportController } from "../controllers/index.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

const { createReport , getReports} = reportController;

router.post("/",auth, createReport);
router.get("/list",auth, getReports);

export default router;