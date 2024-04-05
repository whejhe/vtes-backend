import mongoose from "mongoose";
import {connectDB} from "../service/mongoDB.js";
import { v4 as uuidv4 } from "uuid";


const { Schema } = mongoose;


const messageSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    postId: {
        type: String,
        ref: 'Post',
        required: [true, 'El identificador del post es obligatorio']
    },
    userId: {
        type: String,
        ref: 'User',
        required: [true, 'El identificador de usuario es obligatorio']
    },
    content: {
        type: String,
        required: [true, 'El contenido del mensaje es obligatorio']
    }
},{
    timestamps: true
});


export const Message = connectDB.model('Message', messageSchema);