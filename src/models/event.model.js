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
    },
    name: {
        type: String,
        // required: [true, 'El nombre del evento es obligatorio']
    },
    email:{
        type: String,
        // required: [true, 'El email del evento es obligatorio'],
    },
    type: {
        type: String,
        required: [true, 'El tipo de evento es obligatorio'],
    },
    precio:{
        type: String,
        required: [true, 'El precio del evento es obligatorio'],
    },
    provincia:{
        type: String,
        // required: [true, 'La provincia del evento es obligatoria'],
    },
    localidad:{
        type: String,
    },
    direccion:{
        type: String,
        // required: [true, 'La dirección del evento es obligatoria'],
    },
    description: {
        type: String,
    },
    fecha: {
        type: String,
        // required: [true, 'La fecha del evento es obligatoria']
    },
    hora:{
        type: String,
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
