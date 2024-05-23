import express from 'express';
import { iconControllers } from '../controllers/index.js';

const router = express.Router();

const { createIcon, getIcons, getIconsByType, getIconByName } = iconControllers;

// Rutas para la entidad Icon
router.post('/create', createIcon);
router.get('/get', getIcons);
router.get('/getByType', getIconsByType);
router.get('/getIconByName', getIconByName);

export default router;