// Importa el modelo de EventUsers
import EventUsers from "../models/event-users.model.js";

// Asignar usuario a un evento
const assignUserToEvent = async (req, res) => {
    try {
        const { eventId, userId } = req.body;
        const newEventUser = new EventUsers({ eventId, userId });
        await newEventUser.save();
        res.status(201).json(newEventUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todos los usuarios asignados a un evento
const getUsersForEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const users = await EventUsers.find({ eventId });
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar el estado de inscripción de un usuario a un evento
const updateRegistrationStatus = async (req, res) => {
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
    assignUserToEvent,
    getUsersForEvent,
    updateRegistrationStatus
};

export default eventUsersControllers;