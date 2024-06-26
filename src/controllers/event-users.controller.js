// backend/src/controllers/event-users.controller.js
import EventUsers from "../models/event-users.model.js";
import Event from "../models/event.model.js";
import User from "../models/user.models.js";
import jwt from "jsonwebtoken";

// Añadir usuarios a un evento
const addUserToEvent = async (req, res) => {
    try {
        let eventUsers, evento;
        const { eventId } = req.params;
        if (eventId) {
            eventUsers = await EventUsers.findOne({ eventId });
            evento = await Event.findOne({ _id: eventId });
        } else {
            return res.status(400).json({ error: 'No se proporcionó el ID del eventUsers' });
        }
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'No se proporcionaron IDs de usuarios' });
        } else if (eventUsers.userId.includes(userId)) {
            return res.status(400).json({ error: 'El usuario ya se encuentra en el eventUsers' });
        }
        eventUsers.userId.push(userId)
        let updatedEvent = await eventUsers.save();


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
        
        res.status(400).json({ error: error.message });
    }
};


// ELIMINAR USUARIO DE UN EVENTO
// const deleteUserFromEvent = async (req, res) => {
//     const token = req.header('Authorization').replace('Bearer ', '');
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded._id).select('-password -__v');
    
//     if (user.role !== 'ADMIN' && user.role !== 'COLLABORATOR' && user.role !== 'SUPER_ADMIN') {
//         return res.status(403).json({ error: 'No tienes los permisos para eliminar este usuario' });
//     }
//     const { eventId, userId } = req.params;
//     try {
//         const event = await Event.findById(eventId);
//         if (!event) {
//             return res.status(404).json({ error: 'Evento no encontrado' });
//         }
//         const userToDelete = await User.findById(userId);
//         if (!userToDelete) {
//             return res.status(404).json({ error: 'Usuario no encontrado' });
//         }
//         const eventUser = await EventUsers.findOne({ eventId });
//         if (!eventUser) {
//             return res.status(404).json({ error: 'Usuario no es parte del evento' });
//         }
//         const userIndex = eventUser.userId.indexOf(userId);
//         if (userIndex > -1) {
//             eventUser.userId.splice(userIndex, 1);
//             await eventUser.save();
//             res.status(200).json({ message: 'Usuario eliminado correctamente' });
//         } else {
//             return res.status(404).json({ error: 'Usuario no es parte del evento' });
//         }
//     } catch (error) {
        
//         res.status(400).json({ error: error.message });
//     }
// };
const deleteUserFromEvent = async (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select('-password -__v');

    const { eventId, userId } = req.params;

    // Verificar permisos
    if (user._id.toString() !== userId && user.role !== 'ADMIN' && user.role !== 'COLLABORATOR' && user.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'No tienes los permisos para eliminar este usuario' });
    }

    try {
        // Buscar el evento
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }

        // Buscar el usuario a eliminar
        const userToDelete = await User.findById(userId);
        if (!userToDelete) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Buscar la relación usuario-evento
        const eventUser = await EventUsers.findOne({ eventId });
        if (!eventUser) {
            return res.status(404).json({ error: 'Usuario no es parte del evento' });
        }

        // Verificar si el usuario es parte del evento
        const userIndex = eventUser.userId.indexOf(userId);
        if (userIndex > -1) {
            eventUser.userId.splice(userIndex, 1);
            await eventUser.save();

            // Eliminar el usuario del evento si es necesario
            event.ranking = event.ranking.filter(r => r.userId !== userId);
            event.tiradas = event.tiradas.filter(t => t.userId !== userId);
            event.ronda.forEach(ronda => {
                ronda.mesas.forEach(mesa => {
                    mesa.players = mesa.players.filter(player => player.userId !== userId);
                });
            });

            await event.save();

            res.status(200).json({ message: 'Usuario eliminado correctamente' });
        } else {
            return res.status(404).json({ error: 'Usuario no es parte del evento' });
        }
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
            
        } else {
            
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


const eventUsersControllers = {
    addUserToEvent,
    getUsersForEvent,
    updateStatus,
    deleteUserFromEvent,
    addUserByEmail,
    // tirada,
};

export default eventUsersControllers;

