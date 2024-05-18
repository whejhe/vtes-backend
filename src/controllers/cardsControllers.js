//backend/src/controllers/cardsControllers.js
import Cards from "../models/cards.model.js";

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
const deleteCard = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCard = await Cards.findByIdAndDelete({ _id: id });
        if (!deletedCard) {
            return res.status(404).json({ error: "Carta no encontrada" });
        }
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