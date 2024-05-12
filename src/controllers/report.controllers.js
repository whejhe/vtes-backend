//backend/src/models/report.model.js
import Report from "../models/report.model.js";
import Cards from "../models/customCards.model.js";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.URL || 'https://localhost';

// Crear un nuevo reporte
const createReport = async (req, res) => {
    try {
        
        const { name, email, comment, authorOfCard, nameOfCard, notification } = req.body;
        const newReport = new Report({ name, email, comment, authorOfCard, nameOfCard, notification });
        await newReport.save();
        res.status(201).json(newReport);
    } catch (error) {
        console.log("Error al crear el reporte: ",error);
        res.status(400).json({ error: error.message });
    }
};

// Obtener todos los reportes
const getReports = async (req, res) => {
    try {
        const reports = await Report.find();
        res.status(200).json(reports);
    } catch (error) {
        console.log("Error al obtener los reportes: ",error);
        res.status(400).json({ error: error.message });
    }
};

// Elimina Reporte por ID
const deleteReport = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedReport = await Report.findByIdAndDelete(id);
        if (!deletedReport) {
            return res.status(404).json({ message: 'Reporte no encontrado' });
        }
        res.status(200).json({ message: 'Reporte eliminado correctamente' });
    } catch (error) {
        console.log("Error al eliminar el reporte: ",error);
        res.status(400).json({ error: error.message });
    }
};

const reportController = {
    createReport,
    getReports,
    deleteReport
}

export default reportController;