import express from 'express';
// import { createDeck, getDecksByUserId, updateDeckVisibility, addCardToDeck } from '../controllers/deck.controllers.js';
import { deckControllers } from '../controllers/index.js';

const router = express.Router();

const { createDeck, getDecks ,getDeckById, getDecksByUserId, updateDeck ,updateDeckVisibility, addCardToDeck, deleteDeck } = deckControllers;

// Rutas para la entidad Deck
router.post('/', createDeck);
router.get('/', getDecks);
router.get('/:id', getDeckById);
router.get('/:userId', getDecksByUserId);
router.put('/:id', updateDeck);
router.put('/:id/visibility', updateDeckVisibility);
router.put('/:id/add-card', addCardToDeck);
router.delete('/:id', deleteDeck);

export default router;