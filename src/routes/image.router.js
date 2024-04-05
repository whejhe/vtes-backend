import express from 'express';
// import { createImage, getImages, getImageById, updateImage, deleteImage } from '../controllers/image.controller.js';
import { imageControllers } from '../controllers/index.js';

const router = express.Router();

const { createImage, getImages, getImageById, getImagesByUserId, updateImage, deleteImage } = imageControllers;

// Rutas para la entidad Image
router.post('/image', createImage);
router.get('/images', getImages);
router.get('/images/:id', getImageById);
router.get('/images/:userId', getImagesByUserId);
router.put('/images/:id', updateImage);
router.delete('/images/:id', deleteImage);

export default router;