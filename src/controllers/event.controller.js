// backend/src/controllers/event.controller.js
import Event from "../models/event.model.js";
import EventUsers from "../models/event-users.model.js";
import User from "../models/user.models.js";

// Crear un nuevo evento
const createEvent = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        console.log('Usuario: ', user);
        if (!user) {
            return res.status(400).json({ error: "Usuario no encontrado" });
        }
        const { name, email, type, precio, provincia, localidad, direccion, description, fecha, hora, numMaxParticipantes } = req.body;
        const participantesInscritos = user.length;
        const newEvent = new Event({
            userId, name, email, type, precio, provincia, localidad, direccion, description, fecha, hora, numMaxParticipantes, participantesInscritos
        });
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
        const evento = await Event.findOne({ _id: eventId })
        if (!eventUsers) {
            return res.status(404).json({ error: 'No se encontraron usuarios inscritos en el evento' });
        }

        // Obtener los IDs de los jugadores del evento
        let players = eventUsers.userId.map(user => user._id);

        // Mezclar los jugadores aleatoriamente
        // players = players.sort(() => Math.random() - 0.5);

        let tiradas = [];
        for (let i = 0; i < players.length; i++) {
            tiradas.push({ userId: players[i], round1: getRandomNumber(), round2: getRandomNumber(), round3: getRandomNumber() });
        }

        // Ordenar los jugadores por cada ronda
        let round1Players = [...tiradas].sort((a, b) => b.round1 - a.round1);
        let round2Players = [...tiradas].sort((a, b) => b.round2 - a.round2);
        let round3Players = [...tiradas].sort((a, b) => b.round3 - a.round3);

        console.log(tiradas, 'tiradas \n\n ')
        console.log(round1Players, 'jugadores ronda 1')

        // Crear las mesas
        let totalPlayers = players.length;
        let playersPerTable = 5;
        let round1Tables = [];
        let round2Tables = [];
        let round3Tables = [];

        for (let i = 0; i < totalPlayers; i += playersPerTable) {
            round1Tables.push(round1Players.slice(i, i + playersPerTable));
            round2Tables.push(round2Players.slice(i, i + playersPerTable));
            round3Tables.push(round3Players.slice(i, i + playersPerTable));
        }

        for (let i = 0; i < 3; i++) {
            let tables
            switch (i) {
                case 0:
                    tables = round1Tables
                    break;
                case 1:
                    tables = round2Tables
                    break;
                case 2:
                    tables = round3Tables
                    break;
                default:
                    console.log('Error en el switch')
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

        }
        console.log(round1Tables, 'mesas ronda 1')
        // Se actualizan los jugadores de las mesas en el evento
        let ronda = [{
            numero: 1,
            mesas: round1Tables.map((table, index) => ({
                numero: index + 1,
                players: table.map(playerId => ({
                    userId: playerId.userId,
                    tablePoints: 0,
                    points: 0
                }))
            }))
        },
        {
            numero: 2,
            mesas: round2Tables.map((table, index) => ({
                numero: index + 1,
                players: table.map(playerId => ({
                    userId: playerId.userId,
                    tablePoints: 0,
                    points: 0
                }))
            }))
        },
        {
            numero: 3,
            mesas: round3Tables.map((table, index) => ({
                numero: index + 1,
                players: table.map(playerId => ({
                    userId: playerId.userId,
                    tablePoints: 0,
                    points: 0
                }))
            }))
        }];
        console.log(JSON.stringify(ronda), 'ronda entera a ver')
        const updatedEvent = await Event.findByIdAndUpdate(
            eventId, { ronda }, { new: true }).populate('ronda.mesas.players.userId', 'name email avatarUrl');

        console.log('Las mesas han sido actualizadas');
        console.log('Número de mesas: ', round1Tables.length);
        res.status(200).json(updatedEvent);
    } catch (error) {
        console.log('Error al sortear las mesas: ', error);
        res.status(400).json({ error: error.message });
    }
};


// REGISTRAR PUNTUACIONES DE LOS JUGADORES
export const registrarPuntuaciones = async (req, res) => {
    try {
        const { eventId, rondaNumber, tableNumber, playerScores } = req.body;

        // Validar la entrada
        if (!eventId || !rondaNumber || !tableNumber || !Array.isArray(playerScores)) {
            return res.status(400).json({ error: 'Datos inválidos' });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }

        const ronda = event.ronda.find(r => r.numero === rondaNumber);
        if (!ronda) {
            return res.status(404).json({ error: 'Ronda no encontrada' });
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


const getRandomNumber = () => {
    return Math.floor(Math.random() * 10000) + 1;
};

const tirada = async (req, res) => {
    try {
        const { eventId } = req.params;
        console.log('EventoID:', eventId);
        // const Event = await Event.findById(eventId);
        const evento = await Event.findOne({ _id: eventId });
        const eventUsers = await EventUsers.findOne({ eventId })
        if (!evento) {
            return res.status(404).json({ error: 'Evento sin usuarios asignados' });
        }
        console.log('Evento:', evento);

        for (let i = 0; i < eventUsers.userId.length; i++) {
            const user = await User.findById(eventUsers.userId[i]);
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            const round1 = getRandomNumber();
            const round2 = getRandomNumber();
            const round3 = getRandomNumber();
            evento.tiradas.push({ userId: evento.userId[i], round1, round2, round3 });
        }

        await evento.save();

        const tiradas = Event.tiradas.map(({ userId, round1, round2, round3 }) => ({
            userId,
            round1,
            round2,
            round3,
        }));
        console.log('Tiradas:', tiradas);
        res.status(200).json(tiradas);
    } catch (error) {
        console.error('Error al realizar las tiradas:', error);
        res.status(400).json({ error: error.message });
    }
};




const eventControllers = {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    sortearMesa,
    // reordenarMesas,
    registrarPuntuaciones,
    tirada
};

export default eventControllers;