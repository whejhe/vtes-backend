//backend/src/routes/deck.router.js
import express from 'express';
import { deckControllers } from '../controllers/index.js';
import { auth } from "../middlewares/auth.js";
import { printTxt } from '../middlewares/printTxt.js';
import { deckCheck } from '../middlewares/deckCheck.js';
import { generateDeckPDF } from '../middlewares/printPDF.js';


const router = express.Router();

const { createDeck, getDecks, getDeckById, getCardsByDeckId, getDecksByUserId, updateDeck, updateDeckVisibility, addCardToDeck, deleteDeck } = deckControllers;

// Rutas para la entidad Deck
router.get('/', auth, getDecks);
router.post('/', auth, createDeck);
router.get('/:id', getDeckById);
router.get('/:id/cards', getCardsByDeckId);
router.get('/:userId', getDecksByUserId);
router.put('/:id', auth, updateDeck);
router.put('/:id/visibility', auth, updateDeckVisibility);
router.put('/add-card/:id', addCardToDeck);
router.delete('/:id', auth, deleteDeck);
router.post('/printTxt/:id', auth, deckCheck, printTxt);
router.get('/printPDF/:id', auth, deckCheck, generateDeckPDF);

export default router;