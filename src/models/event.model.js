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
    description: {
        type: String,
        required: [true, 'La descripción del evento es obligatoria']
    },
    date: {
        type: Date,
        required: [true, 'La fecha del evento es obligatoria']
    }
},
{
    timestamps: true,
    versionKey: false
});


const Event = connectDB.model('Event', eventSchema);

export default Event;