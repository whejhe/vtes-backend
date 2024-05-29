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
    },
    clan: {
        type: String,
    },
    disciplines: {
        type: [String],
    },
    group: {
        type: Number,
        min: 1,
        max: 7
    },
    type:{
        type: [String],
        required: [true, 'El tipo de la carta es obligatorio']
    },
    logoColor: {
        type: String,
    },
    description: {
        type: String,
    },
    isPublic: {
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
    },
    url:{
        type: String,
    }
},{
    versionKey: false,
    timestamps: false
});

const Cards = connectDB.model('customCards', customCardsSchema);

export default Cards;
