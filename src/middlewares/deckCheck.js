import Deck from '../models/deck.model.js';

export const deckCheck = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deck = await Deck.findById(id).populate('crypt._id').populate('library._id');
        if (!deck) {
            console.log("Deck not found");
            return res.status(404).json({ message: 'Deck not found' });
        }

        req.deck = deck;
        console.log('Deck found:', deck);
        next();
    } catch (error) {
        console.log('Error al obtener el ID del mazo', error);
        res.status(400).json({ error: error.message });
    }
}
