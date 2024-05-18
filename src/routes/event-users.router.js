//backend/src/routes/event-users.router.js
import express from 'express';
import { eventUsersControllers } from '../controllers/index.js';
import { auth } from "../middlewares/auth.js";

const router = express.Router();

const { addUserToEvent,addUserByEmail, getUsersForEvent, updateStatus, deleteUserFromEvent, tirada } = eventUsersControllers;

// Rutas para la entidad EventUsers
router.post('/users/:eventId', addUserToEvent);
router.post('/email/:eventId', addUserByEmail);
router.get('/:eventId', getUsersForEvent);
router.put('/:id', updateStatus);
router.put('/tirada/:eventId', tirada)
router.delete('/:eventId/users/:userId', auth, deleteUserFromEvent);


export default router;