//backend/src/routes/image.router.js
import express from 'express';
import { imageControllers } from '../controllers/index.js';
import { multerMiddleware, resizeImage } from '../middlewares/multer.middleware.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

const { createImage, uploadAvatar, getImages, getAvatars,
    getAvatarByUserId,getImageByName, getImageById, 
    getImagesByUserId, updateImage, deleteImage } = imageControllers;

// Rutas para la entidad Image
router.post('/', createImage);
router.put('/upload/:userId', auth ,multerMiddleware, resizeImage, uploadAvatar);
router.get('/avatars', getAvatars);
router.get('/avatars/:userId',getAvatarByUserId);
router.get('/', getImages);
router.get('/:name', getImageByName)
router.get('/:id', getImageById);
router.get('/:userId', getImagesByUserId);
router.put('/:id', updateImage);
router.delete('/:id', deleteImage);

export default router;