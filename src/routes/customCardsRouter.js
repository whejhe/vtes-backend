//backend/src/routes/customCardsRouter.js
import express from 'express';
import { customCardsControllers } from '../controllers/index.js';
import { multerMiddleware, resizeImage } from '../middlewares/multer.middleware.js';
import {errorMiddleware} from '../middlewares/error.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

const {
    createCustomCard,
    uploadCustomCard,
    getAllCustomCards,
    getCustomCardById,
    getCustomCardsByDeckId,
    updateCustomCard,
    deleteCustomCard } = customCardsControllers;

// Rutas para la entidad Cards
router.post('/',auth, multerMiddleware, createCustomCard);
router.get('/', getAllCustomCards);
router.put('/upload',errorMiddleware, auth, multerMiddleware, resizeImage, uploadCustomCard);
router.get('/:id', getCustomCardById);
router.get('/:deckId', getCustomCardsByDeckId);
router.put('/:id',auth, multerMiddleware, updateCustomCard);
router.delete('/:id',auth, deleteCustomCard);

export default router;