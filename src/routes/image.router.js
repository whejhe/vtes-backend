//backend/src/routes/image.router.js
import express from 'express';
// import { createImage, getImages, getImageById, updateImage, deleteImage } from '../controllers/image.controller.js';
import { imageControllers } from '../controllers/index.js';

const router = express.Router();

const { createImage, getImages, getAvatars,getImageByName, getImageById, getImagesByUserId, updateImage, deleteImage } = imageControllers;

// Rutas para la entidad Image
router.post('/', createImage);
router.get('/avatars', getAvatars);
router.get('/', getImages);
router.get('/:name', getImageByName)
router.get('/:id', getImageById);
router.get('/:userId', getImagesByUserId);
router.put('/:id', updateImage);
router.delete('/:id', deleteImage);

export default router;