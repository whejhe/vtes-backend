//backend/src/models/deck.model.js
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import {connectDB} from "../service/mongoDB.js";

const { Schema } = mongoose;

const deckSchema = new Schema({
    _id: {
        type: String,
        default:uuidv4
    },
    userId: {
        type: String,
        ref: 'User',
        required: [true, 'El identificador de usuario es obligatorio']
    },
    name: {
        type: String,
        required: [true, 'El nombre del mazo es obligatorio']
    },
    publico: {
        type: Boolean,
        default: true,
    },
    cardIds:{
        type: [String],
        ref: 'Cards'
    }
});

export const Deck = connectDB.model('Deck', deckSchema)