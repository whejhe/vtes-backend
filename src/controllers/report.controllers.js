//backend/src/models/report.model.js
import Report from "../models/report.model.js";
import Cards from "../models/customCards.model.js";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.URL || 'https://localhost';

// Crear un nuevo reporte
const createReport = async (req, res) => {
    try {
        const { name, email, comment, authorOfCard, nameOfCard } = req.body;
        const newReport = new Report({ name, email, comment, authorOfCard, nameOfCard });
        await newReport.save();
        res.status(201).json(newReport);
    } catch (error) {
        console.log("Error al crear el reporte: ",error);
        res.status(400).json({ error: error.message });
    }
};

const reportController = {
    createReport,
}

export default reportController;