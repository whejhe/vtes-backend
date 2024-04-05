import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import {connectDB} from "../service/mongoDB.js";


const { Schema } = mongoose;

const eventUsersSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    eventId: {
        type: String,
        ref: 'Event',
        required: [true, 'El identificador del evento es obligatorio']
    },
    userId: {
        type: String,
        ref: 'User',
        required: [true, 'El identificador de usuario es obligatorio']
    },
    score: {
        type: Number,
        default : 0
    },
    registrationStatus: {
        type: String,
        enum: ['confirmed', 'pending', 'cancelled', 'abandoned'],
        default: 'pending'
    },
    
});


const EventUsers = connectDB.model('EventUsers', eventUsersSchema);

export default EventUsers;