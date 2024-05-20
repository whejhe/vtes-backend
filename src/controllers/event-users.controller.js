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


// ELIMINAR USUARIO DE UN EVENTO
const deleteUserFromEvent = async (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select('-password -__v');
    console.log('Usuario: ', user);
    if (user.role !== 'ADMIN' && user.role !== 'COLLABORATOR' && user.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'No tienes los permisos para eliminar este usuario' });
    }
    const { eventId, userId } = req.params;
    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }
        const userToDelete = await User.findById(userId);
        if (!userToDelete) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        const eventUser = await EventUsers.findOne({ eventId });
        if (!eventUser) {
            return res.status(404).json({ error: 'Usuario no es parte del evento' });
        }
        const userIndex = eventUser.userId.indexOf(userId);
        if (userIndex > -1) {
            eventUser.userId.splice(userIndex, 1);
            await eventUser.save();
            res.status(200).json({ message: 'Usuario eliminado correctamente' });
        }else{
            return res.status(404).json({ error: 'Usuario no es parte del evento' });
        }
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

//AÑADIR DESDE ADMINISTRACION A USUARIOS POR EMAIL
const addUserByEmail = async (req, res) => {
    const { email } = req.body;
    const { eventId } = req.params;
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select('-password -__v');
    if (user.role !== 'ADMIN' && user.role !== 'COLLABORATOR' && user.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'No tienes los permisos para añadir otros Usuarios' });
    }

    try {
        let evento;
        if (eventId) {
            evento = await EventUsers.findOne({ eventId });
            console.log('Evento: ', evento);
        }else{
            console.log('No se proporcionó el ID del evento: ', eventId);
            return res.status(404).json({ error: 'ID de evento no proporcionado' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const eventUser = await EventUsers.findOne({ eventId });
        if (!eventUser) {
            return res.status(404).json({ error: 'Evento sin usuarios asignados' });
        }

        if (eventUser.userId.includes(user._id)) {
            return res.status(400).json({ error: 'El usuario ya se encuentra en el evento' });
        }

        eventUser.userId.push(user._id);
        await eventUser.save();

        res.status(201).json({ message: 'Usuario agregado correctamente por correo electrónico' });
    } catch (error) {
        console.error('Error al añadir usuario por correo electrónico: ', error);
        res.status(400).json({ error: error.message });
    }
};

export const tirada = async (req, res) => {
    try {
        const eventId = req.params.eventId;

        // Validar que el eventId sea válido
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }

        // Obtener los usuarios inscritos en el evento
        const eventUsers = await EventUsers.find({ eventId }).populate('userId');

        // Generar y almacenar las tiradas por usuario
        const tiradas = await Promise.all(eventUsers.map(async (eventUser) => {
            let availableNumbers = Array.from({ length: 1000 }, (_, i) => i + 1);

            const round1 = getRandomNumber(availableNumbers);
            const round2 = getRandomNumber(availableNumbers);
            const round3 = getRandomNumber(availableNumbers);

            // Actualizar los campos de tirada en el documento EventUsers
            eventUser.tiradas.push({ userId: eventUser.userId._id, round1, round2, round3 });
            await eventUser.save();

            return {
                userId: eventUser.userId._id,
                round1,
                round2,
                round3,
            };
        }));

        res.status(200).json(tiradas);
    } catch (error) {
        console.error('Error al realizar las tiradas:', error);
        res.status(400).json({ error: error.message });
    }
};

function getRandomNumber(availableNumbers) {
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const randomNumber = availableNumbers[randomIndex];
    availableNumbers.splice(randomIndex, 1);
    return randomNumber;
}


const eventUsersControllers = {
    addUserToEvent,
    getUsersForEvent,
    updateStatus,
    deleteUserFromEvent,
    addUserByEmail,
    tirada,
};

export default eventUsersControllers;

