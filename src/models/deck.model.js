//backend/src/models/deck.model.js
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import {connectDB} from "../service/mongoDB.js";
import { ObjectId } from "mongodb";

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
        required: [true, 'El nombre del mazo es obligatorio'],
    },
    description:{
        type: String,
        required: false,
    },
    author:{
        type: String,
        default : "Anonymous",
        require: [true, 'El autor del mazo es obligatorio']
    },    
    category:{
        type: String,
    },
    isPublic: {
        type: Boolean,
        default: true,
        require: [true, 'El estado del mazo es obligatorio']    
    },
    crypt: [{
        _id: { type: ObjectId, ref: 'Cards' },
        quantity: { type: Number, default: 1 }
    }],
    library: [{
        _id: { type: ObjectId, ref: 'Cards' },
        quantity: { type: Number, default: 1 }
    }]
}, {versionKey: false});

const Deck = connectDB.model('Deck', deckSchema);

export default Deck;