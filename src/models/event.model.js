//front/src/models/event.model.js
import mongoose from "mongoose";
import {connectDB} from "../service/mongoDB.js";
import { v4 as uuidv4 } from "uuid";


const { Schema } = mongoose;

const eventSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    creatorId: {
        type: String,
        ref: 'User',
        required: [true, 'El identificador del creador es obligatorio']
    },
    name: {
        type: String,
        required: [true, 'El nombre del evento es obligatorio']
    },
    email:{
        type: String,
        required: [true, 'El email del evento es obligatorio'],
    },
    provincia:{
        type: String,
        required: [true, 'La provincia del evento es obligatoria'],
    },
    localidad:{
        type: String,
        required: [true, 'La localidad del evento es obligatoria'],
    },
    direccion:{
        type: String,
        required: [true, 'La dirección del evento es obligatoria'],
    },
    description: {
        type: String,
        required: [true, 'La descripción del evento es obligatoria']
    },
    fecha: {
        type: Date,
        required: [true, 'La fecha del evento es obligatoria']
    },
    hora:{
        type: String,
        required: [true, 'La hora del evento es obligatoria'],
    },
    numMaxParticipantes:{
        type: Number,
        required:false,
    }
},
{
    timestamps: false,
    versionKey: false
});


const Event = connectDB.model('Event', eventSchema);

export default Event;
