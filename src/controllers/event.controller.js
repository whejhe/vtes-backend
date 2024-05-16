// backend/src/controllers/event.controller.js
import Event from "../models/event.model.js";
import EventUsers from "../models/event-users.model.js";
import User from "../models/user.models.js";

// Crear un nuevo evento
const createEvent = async (req, res) => {
    try {
        const { name, email, type, precio, provincia, localidad, direccion, description, fecha, hora, numMaxParticipantes } = req.body;
        const newEvent = new Event({ creatorId: req.user._id, name, email, type, precio, provincia, localidad, direccion, description, fecha, hora, numMaxParticipantes });
        await newEvent.save();
        const newEventUsers = new EventUsers({ eventId: newEvent._id });
        await newEventUsers.save();
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

// SORTEAR MESAS DE UN EVENTO
export const sortearMesa = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const eventUsers = await EventUsers.findOne({ eventId }).populate('userId');
        if (!eventUsers) {
            return res.status(404).json({ error: 'No se encontraron usuarios inscritos en el evento' });
        }

        // Obtener los IDs de los jugadores del evento
        let players = eventUsers.userId.map(user => user._id);
        
        // Mezclar los jugadores aleatoriamente
        players = players.sort(() => Math.random() - 0.5);

        let totalPlayers = players.length;
        let playersPerTable = 5;
        let tables = [];

        for (let i = 0; i < totalPlayers; i += playersPerTable) {
            tables.push(players.slice(i, i + playersPerTable));
        }

        while (tables.some(table => table.length < 4)) {
            let tableWithFive = tables.find(table => table.length === 5);
            if (tableWithFive) {
                let playerToMove = tableWithFive.pop();
                let lastTable = tables[tables.length - 1];
                if (lastTable.length < 5) {
                    lastTable.push(playerToMove);
                } else {
                    tables.push([playerToMove]);
                }
            } else {
                const tableWithLessThanFour = tables.find(table => table.length < 4);
                if (tableWithLessThanFour) {
                    const anonymousUser = await User.findOne({ email: 'anonimo@gmail.com' });
                    if (!anonymousUser) {
                        return res.status(404).json({ error: 'Jugador ficticio no encontrado' });
                    }
                    tableWithLessThanFour.push(anonymousUser._id);
                } else {
                    break;
                }
            }
        }

        // Se actualizan los jugadores de las mesas en el evento
        let mesas = tables.map((table, index) => ({
            numero: index + 1,
            players: table.map(playerId => ({
                userId: playerId, 
                // tiradaAleatoria: Math.floor(Math.random() * 1000) + 1,
                tablePoints: 0,
                points: 0
            }))
        }));

        const updatedEvent = await Event.findByIdAndUpdate(eventId, { mesas }, { new: true }).populate('mesas.players.userId', 'name email avatarUrl');

        console.log('Las mesas han sido actualizadas');
        console.log('Número de mesas: ', tables.length);
        res.status(200).json(updatedEvent);
    } catch (error) {
        console.log('Error al sortear las mesas: ', error);
        res.status(400).json({ error: error.message });
    }
};


// REGISTRAR PUNTUACIONES DE LOS JUGADORES
export const registrarPuntuaciones = async (req, res) => {
    try {
        const { eventId, tableNumber, playerScores } = req.body;

        // Validar la entrada
        if (!eventId || !tableNumber || !Array.isArray(playerScores)) {
            return res.status(400).json({ error: 'Datos inválidos' });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }

        const table = event.mesas.find(mesa => mesa.numero === tableNumber);
        if (!table) {
            return res.status(404).json({ error: 'Mesa no encontrada' });
        }

        // Actualizar los puntajes de los jugadores
        playerScores.forEach(({ userId, points, tablePoints }) => {
            const player = table.players.find(player => player.userId === userId);
            if (player) {
                player.points = points;
                player.tablePoints = tablePoints;
            }
        });

        await event.save();

        res.status(200).json({ message: 'Puntuaciones actualizadas correctamente' });
    } catch (error) {
        console.error('Error al registrar puntuaciones: ', error);
        res.status(500).json({ error: 'Error al registrar puntuaciones' });
    }
};



const eventControllers = {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    sortearMesa,
    registrarPuntuaciones
};

export default eventControllers;