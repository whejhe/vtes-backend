//backend/src/routes/cards.router.js
import express from 'express';
import { cardsControllers } from '../controllers/index.js';

const router = express.Router();

const { createCard,getCards, getCardsById, updateCard, deleteCard } = cardsControllers;

// Rutas para la entidad Cards
router.post('/', createCard);
router.get('/', getCards);
router.get('/:id', getCardsById);
router.put('/:id', updateCard);
router.delete('/:id', deleteCard);

export default router;