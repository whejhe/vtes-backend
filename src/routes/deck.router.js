//backend/src/routes/deck.router.js
import express from 'express';
// import { createDeck, getDecksByUserId, updateDeckVisibility, addCardToDeck } from '../controllers/deck.controllers.js';
import { deckControllers } from '../controllers/index.js';
import { auth } from "../middlewares/auth.js";


const router = express.Router();

const { createDeck, getDecks ,getDeckById, getCardsByDeckId, getDecksByUserId, updateDeck ,updateDeckVisibility, addCardToDeck, deleteDeck } = deckControllers;

// Rutas para la entidad Deck
router.get('/', getDecks);
router.post('/', createDeck);
router.get('/:id', getDeckById);
router.get('/:id/cards', getCardsByDeckId);
router.get('/:userId', getDecksByUserId);
router.put('/:id', updateDeck);
router.put('/:id/visibility',auth, updateDeckVisibility);
router.put('/:id/add-card',auth, addCardToDeck);
router.delete('/:id',auth, deleteDeck);

export default router;