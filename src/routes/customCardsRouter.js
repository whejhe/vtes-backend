//backend/src/routes/customCardsRouter.js
import express from 'express';
import { customCardsControllers } from '../controllers/index.js';
import multerMiddleware from '../middlewares/multer.middleware.js';

const router = express.Router();

const { 
    createCustomCard,
    getAllCustomCards,
    getCustomCardById, 
    getCustomCardsByDeckId, 
    updateCustomCard, 
    deleteCustomCard } = customCardsControllers;

// Rutas para la entidad Cards
router.post('/',multerMiddleware, createCustomCard);
router.get('/', getAllCustomCards);
router.get('/:id', getCustomCardById);
router.get('/:deckId', getCustomCardsByDeckId);
router.put('/:id',multerMiddleware, updateCustomCard);
router.delete('/:id', deleteCustomCard);

export default router;