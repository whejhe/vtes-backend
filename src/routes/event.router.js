import express from 'express';
// import { createEvent, getEvents, getEventById, updateEvent, deleteEvent } from '../controllers/event.controller.js';
import { eventsControllers } from '../controllers/index.js';

const router = express.Router();

const { createEvent, getEvents, getEventById, updateEvent, deleteEvent } = eventsControllers;

// Rutas para la entidad Event
router.post('admin/event', createEvent);
router.get('users/events', getEvents);
router.get('users/events/:id', getEventById);
router.put('admin/events/:id', updateEvent);
router.delete('admin/events/:id', deleteEvent);

export default router;