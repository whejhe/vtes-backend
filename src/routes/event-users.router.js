//backend/src/routes/event-users.router.js
import express from 'express';
import { eventUsersControllers } from '../controllers/index.js';

const router = express.Router();

const { addUserToEvent, getUsersForEvent, updateStatus } = eventUsersControllers;

// Rutas para la entidad EventUsers
router.post('/users/:eventId', addUserToEvent);
router.get('/users/:eventId', getUsersForEvent);
router.put('/users/:id', updateStatus);

export default router;