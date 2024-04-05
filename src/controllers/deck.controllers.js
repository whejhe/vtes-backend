// backend/src/controllers/deck.controllers.js
import { Deck } from "../models/deck.model.js";

// Crear un nuevo mazo
const createDeck = async (req, res) => {
    try {
        console.log("Dentro de crear mazo ::: ", req.body);
        const { userId, name, publico, cardIds } = req.body;
        const newDeck = new Deck({ userId, name, publico, cardIds });
        await newDeck.save();
        res.status(201).json(newDeck);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todos los mazos
const getDecks = async (req, res) => {
    try {
        const decks = await Deck.find();
        res.status(200).json(decks);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//Obtener mazo por ID
const getDeckById = async (req, res) => {
    try {
        const { id } = req.params;
        const deck = await Deck.findById(id);
        if (!deck) {
            return res.status(404).json({ error: "Mazo no encontrado" });
        }
        res.status(200).json(deck);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todos los mazos de un usuario
const getDecksByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const decks = await Deck.find({ userId });
        res.status(200).json(decks);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar mazo por ID
const updateDeck = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, publico, cardIds } = req.body;
        const updatedDeck = await Deck.findByIdAndUpdate(id, { name, publico, cardIds }, { new: true });
        if (!updatedDeck) {
            return res.status(404).json({ error: "Mazo no encontrado" });
        }
        res.status(200).json(updatedDeck);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar la visibilidad de un mazo
const updateDeckVisibility = async (req, res) => {
    try {
        const { id } = req.params;
        const { publico } = req.body;
        const updatedDeck = await Deck.findByIdAndUpdate(id, { publico }, { new: true });
        if (!updatedDeck) {
            return res.status(404).json({ error: "Mazo no encontrado" });
        }
        res.status(200).json(updatedDeck);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Agregar una carta a un mazo
const addCardToDeck = async (req, res) => {
    try {
        const { id } = req.params;
        const { cardId } = req.body;
        const deck = await Deck.findById(id);
        if (!deck) {
            return res.status(404).json({ error: "Mazo no encontrado" });
        }
        deck.cardIds.push(cardId);
        await deck.save();
        res.status(200).json(deck);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un mazo por ID
const deleteDeck = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDeck = await Deck.findByIdAndDelete(id);
        if (!deletedDeck) {
            return res.status(404).json({ error: "Mazo no encontrado" });
        }
        res.status(200).json({ message: "Mazo eliminado correctamente" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deckControllers = {
    createDeck,
    getDecks,
    getDeckById,
    getDecksByUserId,
    updateDeck,
    updateDeckVisibility,
    addCardToDeck,
    deleteDeck
};

export default deckControllers;