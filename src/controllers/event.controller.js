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
                tiradaAleatoria: Math.floor(Math.random() * 1000) + 1,
                tablePoints: 0,
                points: 0
            }))
        }));

        // await Event.findByIdAndUpdate(eventId, { mesas });
        const updatedEvent = await Event.findByIdAndUpdate(eventId, { mesas }, { new: true }).populate('mesas.players.userId', 'name email avatarUrl');

        console.log('Las mesas han sido actualizadas');
        console.log('Número de mesas: ', tables.length);
        // res.status(200).json({ tables });
        res.status(200).json(updatedEvent);
    } catch (error) {
        console.log('Error al sortear las mesas: ', error);
        res.status(400).json({ error: error.message });
    }
};



// const updateTiradaAleatoria = async (req, res) => {
//     try {
//         const eventId = req.params.eventId;
//         const userId = req.params.userId;
//         const tiradaAleatoria = Math.floor(Math.random() * 1000) + 1;
//         const updatedEvent = await EventUsers.findOneAndUpdate({ eventId, userId }, { tiradaAleatoria }, { new: true });
//         res.status(200).json(updatedEvent);
//     } catch (error) {
//         console.log('Error al actualizar la tirada aleatoria: ', error);
//         res.status(400).json({ error: error.message });
//     }
// };

// Método para registrar las puntuaciones de las partidas
export const registrarPuntuaciones = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const matchResults = req.body.matchResults;

        const usuariosEvento = await EventUsers.findOne({ eventId });
        if (!usuariosEvento) {
            return res.status(404).json({ error: 'No se encontraron usuarios inscritos en el evento' });
        }

        // matchResults es un array de objetos con la estructura:
        // [{ userId: 'user1', eliminaciones: 2, sobrevivió: true, mesaId: 'mesa1' }, ...]

        matchResults.forEach(resultado => {
            const indiceJugador = usuariosEvento.userId.findIndex(user => user.toString() === resultado.userId);
            if (indiceJugador !== -1) {
                usuariosEvento.eliminationPoints[indiceJugador] += resultado.eliminaciones;
                if (resultado.sobrevivió) {
                    usuariosEvento.eliminationPoints[indiceJugador] += 0.5;
                }
            }
        });

        // Calcular puntos de mesa y actualizar tablePoints
        const puntoDeMesa = 1; // Punto de mesa para el jugador con más puntos de victoria
        const resultadosAgrupadosPorMesa = agruparPor(matchResults, 'mesaId');

        Object.values(resultadosAgrupadosPorMesa).forEach(mesa => {
            const mesaOrdenada = mesa.sort((a, b) => b.eliminaciones - a.eliminaciones);
            const mayorPuntuacion = mesaOrdenada[0].eliminaciones;

            mesaOrdenada.forEach(jugador => {
                const indiceJugador = usuariosEvento.userId.findIndex(user => user.toString() === jugador.userId);
                if (jugador.eliminaciones === mayorPuntuacion) {
                    usuariosEvento.tablePoints[indiceJugador] += puntoDeMesa;
                }
            });
        });

        await usuariosEvento.save();
        res.status(200).json(usuariosEvento);
    } catch (error) {
        console.error('Error al registrar las puntuaciones: ', error);
        res.status(400).json({ error: error.message });
    }
};

// Función auxiliar para agrupar por clave especificada
const agruparPor = (array, clave) => {
    return array.reduce((resultado, valorActual) => {
        (resultado[valorActual[clave]] = resultado[valorActual[clave]] || []).push(valorActual);
        return resultado;
    }, {});
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