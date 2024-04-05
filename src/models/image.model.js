import mongoose from "mongoose";
import {connectDB} from "../service/mongoDB.js";
import { v4 as uuidv4 } from "uuid";

const { Schema } = mongoose;

const imageSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    userId: {
        type: String,
        ref: 'User',
        required: [true, 'El identificador de usuario es obligatorio']
    },
    name: {
        type: String,
        unique: true,
        required: [true, 'El nombre de la imagen es obligatorio']
    },
    type: {
        type: String,
        required: [true, 'El tipo de la imagen es obligatorio']
    },
    description: {
        type: String,
        required: [true, 'La descripción de la imagen es obligatoria']
    },
    imageUrl: {
        type: String,
        required: [true, 'La URL de la imagen es obligatoria']
    },
    public: {
        type: Boolean,
        default: true,
    }
});


const Image = connectDB.model('Image', imageSchema);

export default Image;