// backend/src/controllers/event-users.controller.js
import EventUsers from "../models/event-users.model.js";

// Añadir usuarios a un evento
const addUserToEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { userId } = req.body;
        if (!userId) {
            console.log(userId, 'userId');
            return res.status(400).json({ error: 'No se proporcionaron IDs de usuarios' });
        }
        const eventUser = new EventUsers({ eventId, userId });
        await eventUser.save();
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
        const event = await EventUsers.findById(eventId);
        if(!event) {
            return res.status(404).json({ error: "Evento no encontrado" });
        }
        const eventUsers = await EventUsers.find({ eventId }).populate('userId');
        // const users = eventUsers.map(eventUser => eventUser.userId);
        // if (!users) {
        //     return res.status(404).json({ error: "No se encontraron usuarios" });
        // }
        res.status(200).json(eventUsers);
    } catch (error) {
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
    updateStatus
};

export default eventUsersControllers;