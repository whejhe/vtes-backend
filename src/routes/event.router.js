//front/src/routes/event.router.js
import express from 'express';
import { eventsControllers } from '../controllers/index.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

const { createEvent, getEvents, getEventById, updateEvent, deleteEvent } = eventsControllers;

// Rutas para la entidad Event
router.post('/admin/',auth, createEvent);
router.get('/users/', getEvents);
router.get('/users/:id', getEventById);
router.put('/admin/:id',auth, updateEvent);
router.delete('/admin/:id',auth, deleteEvent);

export default router;