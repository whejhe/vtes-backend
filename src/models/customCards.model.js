//backend/src/models/customCards.model.js
import mongoose from "mongoose";
import {connectDB} from "../service/mongoDB.js";
import { v4 as uuidv4 } from "uuid";

const { Schema } = mongoose;

const customCardsSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    userId:{
        type: String,
        ref: 'User',
        required: [true, 'El identificador de usuario es obligatorio']
    },
    name: {
        type: String,
        unique: true,
        required: [true, 'El nombre de la carta es obligatoria']
    },
    author:{
        type: String,
        required: [true, 'El autor de la carta es obligatorio']
    },
    capacity: {
        type: Number,
        required: false,
        min: 1,
        max: 11
    },
    image: {
        type: String,
        required: [true, 'La imagen de la carta es obligatoria']
    },
    clan: {
        type: String,
        required: [true, 'El clan de la carta es obligatorio']
    },
    disciplines: {
        type: [String],
        required: [true, 'Las disciplinas de la carta son obligatorias']
    },
    group: {
        type: Number,
        required: [true, 'El grupo de la carta es obligatorio'],
        min: 1,
        max: 7
    },
    type:{
        type: [String],
        required: [true, 'El tipo de la carta es obligatorio']
    },
    logoColor: {
        type: String,
        required: [true, 'El color del logo es obligatorio']
    },
    description: {
        type: String,
        required: [true, 'La descripción de la carta es obligatoria']
    },
    publico: {
        type:Boolean,
        default: true
    },
    costBlood: {
        type: Number,
        required: false,
        min: 0,
        max:11,
    },
    costPool: {
        type: Number,
        required: false,
        min: 0,
        max: 6,
    }
});

const Cards = connectDB.model('customCards', customCardsSchema);

export default Cards;
