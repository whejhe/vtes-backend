//backend/src/models/report.model.js
import Report from "../models/report.model.js";
import Cards from "../models/customCards.model.js";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.URL || 'https://localhost';

// Crear un nuevo reporte
const createReport = async (req, res) => {
    try {
        
        const { name, email, comment, authorOfCard, nameOfCard, notification, isChecked } = req.body;
        const newReport = new Report({ name, email, comment, authorOfCard, nameOfCard, notification, isChecked });
        await newReport.save();
        res.status(201).json(newReport);
    } catch (error) {
        
        res.status(400).json({ error: error.message });
    }
};

// Obtener todos los reportes
const getReports = async (req, res) => {
    try {
        const reports = await Report.find();
        res.status(200).json(reports);
    } catch (error) {
        
        res.status(400).json({ error: error.message });
    }
};

const getReportById = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await Report.findById(id);
        if (!report) {
            return res.status(404).json({ message: 'Reporte no encontrado' });
        }
        res.status(200).json(report);
    } catch (error) {
        
        res.status(400).json({ error: error.message });
    }
};

// Marcar como visto
const updateIsChecked = async (req, res) => {
    try {
        const { id } = req.params;
        const { isChecked } = req.body;
        const updatedReport = await Report.findByIdAndUpdate(id,{ isChecked }, { new: true });
        if (!updatedReport) {
            return res.status(404).json({ message: 'Reporte no encontrado' });
        }
        res.status(200).json(updatedReport);
    } catch (error) {
        
        res.status(400).json({ error: error.message });
    }
}

// Actualizar estado de reporte
const updateReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { notification } = req.body;
        const updatedReport = await Report.findByIdAndUpdate(id,{ notification }, { new: true });
        if (!updatedReport) {
            return res.status(404).json({ message: 'Reporte no encontrado' });
        }
        res.status(200).json(updatedReport);
    } catch (error) {
        
        res.status(400).json({ error: error.message });
    }
};

// Elimina Reporte por ID
const deleteReportById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedReport = await Report.findByIdAndDelete(id);
        if (!deletedReport) {
            return res.status(404).json({ message: 'Reporte no encontrado' });
        }
        res.status(200).json({ message: 'Reporte eliminado correctamente' });
    } catch (error) {
        
        res.status(400).json({ error: error.message });
    }
};

const reportController = {
    createReport,
    getReports,
    getReportById,
    updateReport,
    updateIsChecked,
    deleteReportById
}

export default reportController;