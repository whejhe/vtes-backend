//backend/src/controllers/customCardsControllers.js
import Cards from "../models/customCards.model.js";


const createCustomCard = async (req, res) => {
    try {
        const { name, capacity, clan, disciplines, group, logoColor, description } = req.body;
        const image = req.file.path;
        const newCustomCard = new Cards({ name, capacity, image, clan, disciplines, group, logoColor, description });
        await newCustomCard.save();
        res.status(201).json(newCustomCard);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const getCustomCardById = async (req, res) => {
    try {
        const { id } = req.params;
        const customCard = await Cards.findById(id);
        if (!customCard) {
            return res.status(404).json({ error: "Carta personalizada no encontrada" });
        }
        res.status(200).json(customCard);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Obtener todas las cartas personalizadas de un mazo
const getCustomCardsByDeckId = async (req, res) => {
    try {
        const { deckId } = req.params;
        const customCards = await Cards.find({ deckId });
        res.status(200).json(customCards);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todas las cartas personalizadas
const getAllCustomCards = async (req, res) => {
    try {
        const customCards = await Cards.find();
        res.status(200).json(customCards);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Actualizar la información de una carta personalizada
// const updateCustomCard = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { name, cost, image, clan, disciplines, description, group, type } = req.body;
//         const updatedCustomCard = await Cards.findByIdAndUpdate(id, { name, cost, image, clan, disciplines, description, group, type }, { new: true });
//         if (!updatedCustomCard) {
//             return res.status(404).json({ error: "Carta personalizada no encontrada" });
//         }
//         res.status(200).json(updatedCustomCard);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };
const updateCustomCard = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, capacity, clan, disciplines, group, logoColor, description } = req.body;
        let image = req.body.image;
        if (req.file) {
            image = req.file.path;
        }
        const updatedCustomCard = await Cards.findByIdAndUpdate(id, { name, capacity, image, clan, disciplines, group, logoColor, description }, { new: true });
        if (!updatedCustomCard) {
            return res.status(404).json({ error: "Carta personalizada no encontrada" });
        }
        res.status(200).json(updatedCustomCard);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar una carta personalizada
const deleteCustomCard = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCustomCard = await Cards.findByIdAndDelete(id);
        if (!deletedCustomCard) {
            return res.status(404).json({ error: "Carta personalizada no encontrada" });
        }
        res.status(200).json({ message: "Carta personalizada eliminada correctamente" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const customCardsControllers = {
    createCustomCard,
    getAllCustomCards,
    getCustomCardById,
    getCustomCardsByDeckId,
    updateCustomCard,
    deleteCustomCard
};

export default customCardsControllers;