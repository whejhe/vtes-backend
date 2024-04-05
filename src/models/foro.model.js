import mongoose from "mongoose";
import {connectDB} from "../service/mongoDB.js";
import { v4 as uuidv4 } from "uuid";


const { Schema } = mongoose;

const foroSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    userId: {
        type: String,
        ref: 'User',
        required: [true, 'El identificador de usuario es obligatorio']
    },
    title: {
        type: String,
        required: [true, 'El título del foro es obligatorio'],
        // select: false,
    },
    content: {
        type: String,
        required: [true, 'El contenido del foro es obligatorio'],
    }
},{
    timestamps: true
});


export const Foro = connectDB.model('Foro', foroSchema);