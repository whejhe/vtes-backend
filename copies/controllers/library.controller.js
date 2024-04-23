// Importa el modelo de Library
import Library from "../models/library.model.js";

// Crear una nueva biblioteca
const createLibrary = async (req, res) => {
    try {
        const { ownerId, name, deckIds } = req.body;
        const newLibrary = new Library({ ownerId, name, deckIds });
        await newLibrary.save();
        res.status(201).json(newLibrary);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todas las bibliotecas
const getLibraries = async (req, res) => {
    try {
        const libraries = await Library.find();
        res.status(200).json(libraries);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener una biblioteca por ID
const getLibraryById = async (req, res) => {
    try {
        const library = await Library.findById(req.params.id);
        if (!library) {
            return res.status(404).json({ error: "Biblioteca no encontrada" });
        }
        res.status(200).json(library);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar una biblioteca por ID
const updateLibrary = async (req, res) => {
    try {
        const library = await Library.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!library) {
            return res.status(404).json({ error: "Biblioteca no encontrada" });
        }
        res.status(200).json(library);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar una biblioteca por ID
const deleteLibrary = async (req, res) => {
    try {
        const { id } = req.params;
        const library = await Library.findByIdAndDelete(id);
        if (!library) {
            return res.status(404).json({ error: "Biblioteca no encontrada" });
        }
        res.status(200).json({ message: "Biblioteca eliminada correctamente" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const libraryControllers = {
    createLibrary,
    getLibraries,
    getLibraryById,
    updateLibrary,
    deleteLibrary
};

export default libraryControllers;