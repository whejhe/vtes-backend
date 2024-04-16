// Importa el modelo de Event
import Event from "../models/event.model.js";
import User from "../models/user.models.js";


// Crear un nuevo evento
const createEvent = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Acceso denegado' });
        }
        const { name,email, provincia,localidad,direccion, description, fecha, hora, numMaxParticipantes } = req.body;
        const newEvent = new Event({ creatorId:req.user._id, name, email, provincia,localidad,direccion, description, fecha, hora, numMaxParticipantes });
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todos los eventos
const getEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener un evento por ID
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: "Evento no encontrado" });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar un evento por ID
const updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!event) {
            return res.status(404).json({ error: "Evento no encontrado" });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un evento por ID
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findByIdAndDelete(id);
        if (!event) {
            return res.status(404).json({ error: "Evento no encontrado" });
        }
        res.status(200).json({ message: "Evento eliminado correctamente" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const eventControllers = {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent
};

export default eventControllers;