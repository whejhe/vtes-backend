//backend/src/routes/event-users.router.js
import express from 'express';
import { eventUsersControllers } from '../controllers/index.js';
import { auth } from "../middlewares/auth.js";

const router = express.Router();

const { addUserToEvent, getUsersForEvent, updateStatus, deleteUserFromEvent } = eventUsersControllers;

// Rutas para la entidad EventUsers
router.post('/users/:eventId', addUserToEvent);
router.get('/:eventId', getUsersForEvent);
router.put('/:id', updateStatus);
router.delete('/:id', auth, deleteUserFromEvent );

export default router;