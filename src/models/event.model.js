//front/src/models/event.model.js

import mongoose from "mongoose";
import { connectDB } from "../service/mongoDB.js";
import { v4 as uuidv4 } from "uuid";

const { Schema } = mongoose;

const playerSchema = new Schema({
    userId: {
        type: String,
        ref: 'User',
        required: true
    },
    tiradaAleatoria: {
        type: Number,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    tablePoints: {
        type: Number,
        required: true
    },
}, { _id: false });  // Deshabilitar generación automática de _id

const tableSchema = new Schema({
    ronda: {
        type: Number,
        default: 1,
    },
    numero: {
        type: Number,
        required: true
    },
    players: [playerSchema]
}, { _id: false }); 

const eventSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    creatorId: {
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
    mesas: [tableSchema]
},
{
    timestamps: false,
    versionKey: false
});

const Event = connectDB.model('Event', eventSchema);

export default Event;
