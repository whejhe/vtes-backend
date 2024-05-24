//front/src/routes/event.router.js
import express from 'express';
import { eventsControllers } from '../controllers/index.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

const { createEvent, getEvents, getEventById, updateEvent, deleteEvent, sortearMesa, tirada, sumarPuntuaciones } = eventsControllers;

// Rutas para la entidad Event
router.post('/admin/',auth, createEvent);
router.get('/', getEvents);
router.get('/users/:id', getEventById);
router.put('/admin/:id',auth, updateEvent);
router.delete('/admin/:id',auth, deleteEvent);
router.post('/admin/sort-tables/:eventId', auth, sortearMesa);
// router.put('/admin/sort-tables/:eventId/reordenar', reordenarMesas )
// router.put('/registrarPuntuaciones', registrarPuntuaciones);
router.put('/tirada/:eventId',auth, tirada);
router.get('/sumarPuntuaciones/:eventId',auth, sumarPuntuaciones)


export default router;