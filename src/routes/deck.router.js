//backend/src/routes/deck.router.js
import express from 'express';
import { deckControllers } from '../controllers/index.js';
import { auth } from "../middlewares/auth.js";


const router = express.Router();

const { createDeck, getDecks ,getDeckById, getCardsByDeckId, getDecksByUserId, updateDeck ,updateDeckVisibility, addCardToDeck, deleteDeck, printTxt, printtoPDF } = deckControllers;

// Rutas para la entidad Deck
router.get('/', getDecks);
router.post('/',auth, createDeck);
router.get('/:id', getDeckById);
router.get('/:id/cards', getCardsByDeckId);
router.get('/:userId', getDecksByUserId);
router.put('/:id',auth, updateDeck);
router.put('/:id/visibility',auth, updateDeckVisibility);
router.put('/add-card/:id', addCardToDeck);
router.delete('/:id',auth, deleteDeck);
router.post('/printTxt/:id', printTxt);
router.post('/printPDF/:id', printtoPDF);

export default router;