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
    },
    customCardId: {
        type: String,
        ref: 'CustomCard',
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
    imageUrl: {
        type: String,
    },
    extension:{
        type: String,
        required: [true, 'La extensión de la imagen es obligatoria']
    },
    public: {
        type: Boolean,
        default: true,
    }
},{versionKey: false});


const Image = connectDB.model('Image', imageSchema);

export default Image;