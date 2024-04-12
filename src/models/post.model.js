import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { connectDB } from "../service/mongoDB.js";

const { Schema } = mongoose;


const postSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4, 
    },
    forumId: {
        type: String,
        ref: 'Foro',
        required: [true, 'El identificador del foro es obligatorio']
    },
    authorId: {
        type: String,
        ref: 'User',
        required: [true, 'El identificador de usuario es obligatorio']
    },
    title: {
        type: String,
        required: [true, 'El título del post es obligatorio']
    },
    content: {
        type: String,
        required: [true, 'El contenido del post es obligatorio']
    }
},
{
    timestamps: true,
    versionKey: false
}); 


const Post = connectDB.model('Post', postSchema);

export default Post;