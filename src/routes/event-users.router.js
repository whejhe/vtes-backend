import express from 'express';
// import { assignUserToEvent, getUsersForEvent, updateRegistrationStatus } from '../controllers/event-users.controller.js';
import { eventUsersControllers } from '../controllers/index.js';

const router = express.Router();

const { assignUserToEvent, getUsersForEvent, updateRegistrationStatus } = eventUsersControllers;

// Rutas para la entidad EventUsers
router.post('/users', assignUserToEvent);
router.get('/users/:eventId', getUsersForEvent);
router.put('/users/:id', updateRegistrationStatus);

export default router;