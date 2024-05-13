//backend/src/models/report.model.js
import express from "express";
import { reportController } from "../controllers/index.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

const { createReport , getReports,getReportById, updateReport, deleteReport} = reportController;

router.post("/",auth, createReport);
router.get("/list",auth, getReports);
router.get("/:id",auth, getReportById);
router.put("/update/:id",auth, updateReport);
router.delete("/:id",auth, deleteReport);

export default router;