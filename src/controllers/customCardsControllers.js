//backend/src/controllers/customCardsControllers.js
import Cards from "../models/customCards.model.js";
import User from "../models/user.models.js";


const createCustomCard = async (req, res) => {
    try {
        const { name, capacity, clan, disciplines, group, logoColor, description, filename } = req.body;
        const image = req.file.path;
        const url = `http://localhost:3000/uploads/customCards/${filename}`;
        const newCustomCard = new Cards({ name, capacity, image, clan, disciplines, group, logoColor, description, url });
        await newCustomCard.save();
        res.status(201).json(newCustomCard);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const uploadCustomCard = async (req, res) => {
    try{
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        
        const { name, disciplines, clan, capacity, group, type, isPublic, description, filename } = req.body;
        const author = req.user.nick;
        const url = `http://localhost:3000/uploads/customCards/${filename}`;
        const newCustomCard = new Cards({userId, disciplines, author, name, clan, capacity, group, type, isPublic, description, image: filename, url });
        await newCustomCard.save();
        res.status(201).json(newCustomCard);
    }catch(error){
        console.log('Error al subir la Imagen: ',error);
        res.status(400).json({ error: error.message });
    }
}


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
const updateCustomCard = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, capacity, clan, disciplines, group, type, logoColor, description, isPublic, costPool, costBoold, url } = req.body;
        let image = req.body.image;
        if (req.file) {
            image = req.file.path;
        }
        const updatedCustomCard = await Cards.findByIdAndUpdate(id, { name, capacity, image, clan, disciplines, group,type, logoColor, description, isPublic, costPool, costBoold, url }, { new: true });
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
    uploadCustomCard,
    getAllCustomCards,
    getCustomCardById,
    getCustomCardsByDeckId,
    updateCustomCard,
    deleteCustomCard
};

export default customCardsControllers;