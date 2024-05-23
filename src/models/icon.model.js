import mongoose from "mongoose";
import {connectDB} from "../service/mongoDB.js";
import { v4 as uuidv4 } from "uuid";

const { Schema } = mongoose;

const iconSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    type: {
        type: [String],
    },
    name: {
        type: String,
    },
    url: {
        type: String,
    },
    extension: {
        type: String,
    }
},{
    timestamps: false,
    versionKey: false,
    autoCreate: false
})

const Icons = connectDB.model('Icons', iconSchema);
export default Icons;