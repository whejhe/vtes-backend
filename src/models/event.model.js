// //front/src/models/event.model.js

import mongoose from "mongoose";
import { connectDB } from "../service/mongoDB.js";
import { v4 as uuidv4 } from "uuid";

const { Schema } = mongoose;

const eventSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    userId: {
        type: String,
        ref: 'User',
    },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    type: {
        type: String,
        required: [true, 'El tipo de evento es obligatorio'],
    },
    precio: {
        type: String,
        required: [true, 'El precio del evento es obligatorio'],
    },
    provincia: {
        type: String,
    },
    localidad: {
        type: String,
    },
    direccion: {
        type: String,
    },
    description: {
        type: String,
    },
    fecha: {
        type: String,
    },
    hora: {
        type: String,
    },
    numMaxParticipantes: {
        type: Number,
        required: false,
    },
    participantesInscritos:{
        type: Number,
        required: false,
    }
},
{
    timestamps: false,
    versionKey: false
});

const Event = connectDB.model('Event', eventSchema);

export default Event;
