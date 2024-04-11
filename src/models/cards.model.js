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
    _name: {
        type: String,
        unique: true,
        required: [true, 'El nombre de la carta es obligatoria']
    },
    url: {
        type: String,
        unique: true,
        required: false
    },
    types:{
        type: [String],
        required: [true, 'El tipo de la carta es obligatoria']
    },
    clans:{
        type: [String],
        required: false
    },
    capacity:{
        type: Number,
    },
    disciplines:{
        type: [String],
        required: false
    },
    card_text:{
        type: String,
        required: false
    },
    description: {
        type: String,
        required: [true, 'La descripción de la carta es obligatoria']
    },
    sets:{
        type: [String],
        required: false
    },
    group:{
        type: String,
        required: false
    },
    type: {
        type: String,
        required: [true, 'El tipo de la carta es obligatoria']
    }
});


const Cards = connectDB.model('Cards', cardsSchema);

export default Cards;