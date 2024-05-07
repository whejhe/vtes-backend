// backend/src/controllers/event-users.controller.js
import EventUsers from "../models/event-users.model.js";
import Event from "../models/event.model.js";
import User from "../models/user.models.js";
import jwt from "jsonwebtoken";

// Añadir usuarios a un evento
const addUserToEvent = async (req, res) => {
    try {
        let evento
        const { eventId } = req.params;
        if (eventId) {
            evento = await EventUsers.findOne({ eventId });
        } else {
            return res.status(400).json({ error: 'No se proporcionó el ID del evento' });
        }
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'No se proporcionaron IDs de usuarios' });
        } else if (evento.userId.includes(userId)) {
            return res.status(400).json({ error: 'El usuario ya se encuentra en el evento' });
        }
        evento.userId.push(userId)
        await evento.save();
        res.status(201).json({ message: "Usuarios agregados correctamente" });
    } catch (error) {
        console.error('Error al añadir usuarios: ', error);
        res.status(400).json({ error: error.message });
    }
};

// Obtener todos los usuarios asignados a un evento
const getUsersForEvent = async (req, res) => {
    try {
        const { eventId } = req.params;        
        const eventUsers = await EventUsers.findOne({ eventId }).populate('userId');
        if (!eventUsers) {
            return res.status(404).json({ error: "No se encontraron usuarios" });
        }
        res.status(200).json(eventUsers);
    } catch (error) {
        console.log('Se produjo un error durante la busqueda de usuarios para el evento: ',error);
        res.status(400).json({ error: error.message });
    }
};

// Elimanar usuario de un evento
const deleteUserFromEvent = async (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select('-password -__v');
    console.log('Usuario: ', user);
    if (user.role !== 'ADMIN' && user.role !== 'COLLABORATOR') {
        return res.status(403).json({ error: 'No tienes los permisos para eliminar este usuario' });
    }
    const { id } = req.params;
    const { userId } = req.body;
    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }
        const userToDelete = await User.findById(userId);
        if (!userToDelete) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        const eventUser = await EventUsers.findOne({ eventId: id, userId: userId });
        if (!eventUser) {
            return res.status(404).json({ error: 'Usuario no es parte del evento' });
        }
        await EventUsers.findByIdAndDelete(eventUser._id);
        res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.log('Error al eliminar usuario del evento: ', error);
        res.status(400).json({ error: error.message });
    }
};


// Actualizar el estado de inscripción de un usuario a un evento
const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { registrationStatus } = req.body;
        const updatedEventUser = await EventUsers.findByIdAndUpdate(id, { registrationStatus }, { new: true });
        if (!updatedEventUser) {
            return res.status(404).json({ error: "Usuario de evento no encontrado" });
        }
        res.status(200).json(updatedEventUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const eventUsersControllers = {
    addUserToEvent,
    getUsersForEvent,
    updateStatus,
    deleteUserFromEvent
};

export default eventUsersControllers;