//backend/src/controllers/cardsControllers.js
import Cards from "../models/cards.model.js";
import User from "../models/user.models.js";
import Deck from "../models/deck.model.js";

// Crear una nueva carta
const createCard = async (req, res) => {
    try {
        const { name, url, types, clans, capacity, disciplines, card_text, sets, group } = req.body;
        const newCard = new Cards({ name, url, types, clans, capacity, disciplines, card_text, sets, group });
        await newCard.save();
        res.status(201).json(newCard);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todas las cartas
const getCards = async (req, res) => {
    try {
        const cards = await Cards.find();
        res.status(200).json(cards);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener una carta por ID
const getCardsById = async (req, res) => {
    try {
        const { id } = req.params;
        const card = await Cards.findById(id);
        if (!card) {
            return res.status(404).json({ error: "Carta no encontrada" });
        }
        res.status(200).json(card);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar la información de una carta
const updateCard = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, image, description, type } = req.body;
        const updatedCard = await Cards.findByIdAndUpdate(id, { name, image, description, type }, { new: true });
        if (!updatedCard) {
            return res.status(404).json({ error: "Carta no encontrada" });
        }
        res.status(200).json(updatedCard);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar una carta
// const deleteCard = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const deletedCard = await Cards.findByIdAndDelete({ _id: id });
//         if (!deletedCard) {
//             return res.status(404).json({ error: "Carta no encontrada" });
//         }
//         res.status(200).json({ message: "Carta eliminada correctamente" });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };
const deleteCard = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        // Verificar que el usuario está autenticado
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: "No autorizado" });
        }

        // Buscar la carta por ID
        const card = await Cards.findById(id);
        if (!card) {
            return res.status(404).json({ error: "Carta no encontrada" });
        }

        // Buscar el mazo que contiene la carta
        const deck = await Deck.findOne({ 
            $or: [
                { 'crypt._id': id }, 
                { 'library._id': id }
            ] 
        });

        if (!deck) {
            return res.status(404).json({ error: "Mazo no encontrado" });
        }

        // Verificar que el usuario es el propietario del mazo o un administrador
        if (deck.userId.toString() !== userId.toString() && req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
            return res.status(403).json({ error: "Acceso denegado" });
        }

        // Eliminar la carta de los arrays del mazo
        deck.crypt = deck.crypt.filter(card => card._id.toString() !== id);
        deck.library = deck.library.filter(card => card._id.toString() !== id);
        await deck.save();

        // Eliminar la carta
        // await Cards.findByIdAndDelete(id);

        res.status(200).json({ message: "Carta eliminada correctamente" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const cardsControllers = {
    createCard,
    getCards,
    getCardsById,
    updateCard,
    deleteCard
};


export default cardsControllers;