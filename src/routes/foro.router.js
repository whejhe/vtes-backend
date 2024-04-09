import express from 'express';
// import { createForo, getForos, getForoById, updateForo, deleteForo } from '../controllers/foro.controllers.js';
import { foroControllers } from '../controllers/index.js';

const router = express.Router();

const { createForo, getForos, getForoById, updateForo, deleteForo } = foroControllers;

// Rutas para la entidad Foro
router.post('/', createForo);
router.get('/', getForos);
router.get('/:id', getForoById);
router.put('/:id', updateForo);
router.delete('/:id', deleteForo);

export default router;