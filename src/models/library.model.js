import mongoose from "mongoose";
import { connectDB } from "../service/mongoDB.js";
import { v4 as uuidv4 } from "uuid";


const { Schema } = mongoose;

const librarySchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    ownerId: {
        type: String,
        ref: 'User',
        required: [true, 'El identificador del propietario es obligatorio']
    },
    name: {
        type: String,
        unique: true,
        required: [true, 'El nombre de la biblioteca es obligatorio']
    },
    deckIds: {
        type: [String],
        ref: 'Deck',
        required: [true, 'Los identificadores de los mazos son obligatorios']
    }
},{versionKey: false});


const Library = connectDB.model('Library', librarySchema)

export default Library;