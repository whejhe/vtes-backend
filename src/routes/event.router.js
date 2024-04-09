import express from 'express';
// import { createEvent, getEvents, getEventById, updateEvent, deleteEvent } from '../controllers/event.controller.js';
import { eventsControllers } from '../controllers/index.js';

const router = express.Router();

const { createEvent, getEvents, getEventById, updateEvent, deleteEvent } = eventsControllers;

// Rutas para la entidad Event
router.post('/admin/', createEvent);
router.get('/users/', getEvents);
router.get('users/:id', getEventById);
router.put('admin/:id', updateEvent);
router.delete('admin/:id', deleteEvent);

export default router;