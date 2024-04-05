import express from 'express';
// import { assignUserToEvent, getUsersForEvent, updateRegistrationStatus } from '../controllers/event-users.controller.js';
import { eventUsersControllers } from '../controllers/index.js';

const router = express.Router();

const { assignUserToEvent, getUsersForEvent, updateRegistrationStatus } = eventUsersControllers;

// Rutas para la entidad EventUsers
router.post('/events/users', assignUserToEvent);
router.get('/events/users/:eventId', getUsersForEvent);
router.put('/events/users/:id', updateRegistrationStatus);

export default router;