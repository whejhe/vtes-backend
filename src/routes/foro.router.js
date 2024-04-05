import express from 'express';
// import { createForo, getForos, getForoById, updateForo, deleteForo } from '../controllers/foro.controllers.js';
import { foroControllers } from '../controllers/index.js';

const router = express.Router();

const { createForo, getForos, getForoById, updateForo, deleteForo } = foroControllers;

// Rutas para la entidad Foro
router.post('/foro', createForo);
router.get('/foros', getForos);
router.get('/foros/:id', getForoById);
router.put('/foros/:id', updateForo);
router.delete('/foros/:id', deleteForo);

export default router;