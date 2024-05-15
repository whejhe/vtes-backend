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

        // Obtener el número de jugadores apuntados al torneo
        let players = eventUsers.userId.map(user => user._id);
        let totalPlayers = players.length;

        // Repartir a los jugadores en mesas de 5 jugadores cada una
        let playersPerTable = 5;
        let tables = [];
        for (let i = 0; i < totalPlayers; i += playersPerTable) {
            tables.push(players.slice(i, i + playersPerTable));
        }

        // Si una mesa tiene menos de 4 jugadores, se elimina un jugador de una mesa de 5 y se añade a la nueva
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
                // Si hay una mesa con menos de 4 jugadores y es la única mesa restante, buscar al usuario anónimo y agregarlo
                const tableWithLessThanFour = tables.find(table => table.length < 4);
                console.log("tableWithLessThanFour:", tableWithLessThanFour);
                console.log("tables.length:", tables.length);
                if (tableWithLessThanFour) {
                    console.log("Pase por aqui");
                    const anonymousUser = await User.findOne({ email: 'anonimo@gmail.com' });
                    if(!anonymousUser){
                        return res.status(404).json({ error: 'Jugador ficticio no encontrado' });
                    }
                    // console.log("anonymousUser:", anonymousUser);
                    if (anonymousUser) {
                        tableWithLessThanFour.push(anonymousUser._id);
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
        }

        // Se actualizan los jugadores de las mesas
        for (let i = 0; i < tables.length; i++) {
            const table = tables[i];
            for (let j = 0; j < table.length; j++) {
                const player = table[j];
                await EventUsers.findOneAndUpdate({ eventId, userId: player }, { table: i + 1 });
            }
        }

        
        console.log('Las mesas han sido actualizadas');
        console.log('Número de mesas: ', tables.length);
        res.status(200).json({ tables });
    } catch (error) {
        console.log('Error al sortear las mesas: ', error);
        res.status(400).json({ error: error.message });
    }
};

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