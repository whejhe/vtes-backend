// backend/src/controllers/deck.controllers.js
import Deck from "../models/deck.model.js";
import User from "../models/user.models.js";
import Cards from "../models/cards.model.js";

// Crear un nuevo mazo
const createDeck = async (req, res) => {
    try {
        console.log("Dentro de crear mazo ::: ", req.body);
        const { userId, name, description, category, isPublic, crypt, library, author } = req.body;
        //Obtener nick del usuario
        const newDeck = new Deck({ userId, name, description, category, isPublic, crypt, library, author });
        await newDeck.save();
        res.status(201).json({ id: newDeck._id, ...newDeck });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
};

// Obtener todos los mazos
const getDecks = async (req, res) => {
    try {
        const userId = req.user._id;
        console.log(req.user._id, '_id')
        const decks = await Deck.find({
            $or: [{ userId: { $in: [userId] } }, { isPublic: true }],
        });
        res.status(200).json(decks);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//Obtener mazo por ID
const getDeckById = async (req, res) => {
    try {
        const { id } = req.params;
        const deck = await Deck.findById(id).populate('crypt._id').populate('library._id');
        if (!deck) {
            return res.status(404).json({ error: "Mazo no encontrado" });
        }
        res.status(200).json(deck);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todas las cartas del mazo
const getCardsByDeckId = async (req, res) => {
    try {
        const { id } = req.params;
        const cardModel = Cards
        const deck = await Deck.findById(id).populate('crypt._id').populate('library._id');
        if (!deck) {
            return res.status(404).json({ error: "Mazo no encontrado" });
        }
        if (!deck.cardIds || deck.cardIds.length === 0) {
            return res.status(404).json({ error: "Mazo no contiene cartas" });
        }
        console.log(deck, ' deck')
        res.status(200).json(cards);
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
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
        const { name, isPublic, crypt, library, description, category } = req.body;
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: "No autorizado" });
        }
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        const updateDeck = {
            userId: req.user._id,
            name,
            isPublic,
            crypt,
            library,
            description,
            category
        }
        const deck = await Deck.findByIdAndUpdate(id, updateDeck, { new: true });
        if (!deck) {
            return res.status(404).json({ error: "Mazo no encontrado" });
        }
        res.status(200).json(deck);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Actualizar la visibilidad de un mazo
const updateDeckVisibility = async (req, res) => {
    try {
        const { id } = req.params;
        const { isPublic } = req.body;
        const updatedDeck = await Deck.findByIdAndUpdate(id, { isPublic }, { new: true });
        if (!updatedDeck) {
            return res.status(404).json({ error: "Mazo no encontrado" });
        }
        res.status(200).json(updatedDeck);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const addCardToDeck = async (req, res) => {
    try {
        const { id } = req.params;
        const { card, quantity } = req.body;
        const deck = await Deck.findById(id);
        if (!deck) {
            return res.status(404).json({ error: "Mazo no encontrado" });
        }
        if (card) {
            const existingCards = deck.cards.filter((cardInDeck) => cardInDeck.card && cardInDeck.card.toString());
            if (existingCards.length > 0) {
                existingCards.forEach((card) => {
                    card.quantity += quantity;
                });
                deck.markModified('cards');
            } else {
                deck.cards.push({ card: card, quantity: quantity });
            }
        }
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
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: "No autorizado" });
        }
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
    getCardsByDeckId,
    updateDeck,
    updateDeckVisibility,
    addCardToDeck,
    deleteDeck,
};

export default deckControllers;