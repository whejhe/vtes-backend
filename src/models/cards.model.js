//backend/src/models/cards.model.js
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { connectDB } from "../service/mongoDB.js";


const { Schema } = mongoose;

const cardsSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    deckId: {
        type: String,
        ref: 'Deck'
    },
    name: {
        type: String,
        unique: true,
        required: [true, 'El nombre de la carta es obligatoria']
    },
    url: {
        type: String,
        unique: true,
        required: false
    },
    description: {
        type: String,
        required: [true, 'La descripción de la carta es obligatoria']
    },
    type: {
        type: String,
        required: [true, 'El tipo de la carta es obligatoria']
    }
});


const Cards = connectDB.model('Cards', cardsSchema);

export default Cards;