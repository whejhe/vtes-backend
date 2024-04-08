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
router.post('/customCards',multerMiddleware, createCustomCard);
router.get('/customCards', getAllCustomCards);
router.get('/customCards/:id', getCustomCardById);
router.get('/customCards/:deckId', getCustomCardsByDeckId);
router.put('/customCards/:id',multerMiddleware, updateCustomCard);
router.delete('/customCards/:id', deleteCustomCard);

export default router;