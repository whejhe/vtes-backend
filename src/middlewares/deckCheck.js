import Deck from '../models/deck.model.js';
import User from '../models/user.models.js';

export const deckCheck = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { user } = req
        // 
        // const userId = await Deck.findById(user._id);
        // 
        const deck = await Deck.findOne({ _id: id });
        // 
        if (!deck) {
            
            return res.status(404).json({ message: 'Deck not found' });
        }
        // Verificar si el mazo es público o pertenece al usuario actual
        // 
        if (!deck.isPublic && (deck.userId !== user._id) ) {
            return res.status(403).json({ message: 'Acceso denegado: este mazo no es publico' });
        }

        req.deck = await deck.populate(['crypt._id', 'library._id']);
        // 
        next();
    } catch (error) {
        // 
        res.status(400).json({ error: error.message });
    }
}
