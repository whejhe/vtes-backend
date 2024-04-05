import express from 'express';
// import { createLibrary, getLibraries, getLibraryById, updateLibrary, deleteLibrary } from '../controllers/library.controller.js';
import { libraryControllers } from '../controllers/index.js';

const router = express.Router();

const { createLibrary, getLibraries, getLibraryById, updateLibrary, deleteLibrary } = libraryControllers;

// Rutas para la entidad Library
router.post('/', createLibrary);
router.get('/', getLibraries);
router.get('/:id', getLibraryById);
router.put('/:id', updateLibrary);
router.delete('/:id', deleteLibrary);

export default router;