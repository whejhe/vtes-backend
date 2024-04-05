import express from 'express';
import { cardsControllers } from '../controllers/index.js';

const router = express.Router();

const { createCard,getCards, getCardsById, getCardsByDeckId, updateCard, deleteCard } = cardsControllers;

// Rutas para la entidad Cards
router.post('/', createCard);
router.get('/', getCards);
router.get('/:id', getCardsById);
router.get('/:deckId', getCardsByDeckId);
router.put('/:id', updateCard);
router.delete('/:id', deleteCard);

export default router;