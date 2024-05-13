//backend/src/models/report.model.js
import mongoose from "mongoose";
import {connectDB} from "../service/mongoDB.js";
import { v4 as uuidv4 } from "uuid";

const { Schema } = mongoose;

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const reportSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    name: {
        type: String,
        required: [true, 'El nombre del reporte es obligatorio'],
        minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
        maxlength: [30, 'El nombre debe tener un maximo de 30 caracteres'],
    },
    email: {
        type: String,
        required: [true, 'El email del reporte es obligatorio'],
        validate: {
            validator: (v) => emailRegex.test(v),
            message: 'El email no es valido'
        }
    },
    notification: {
        type: Boolean,
    },
    comment:{
        type: String,
        required: [true, 'El comentario del reporte es obligatorio']
    },
    authorOfCard: {
        type: String,
        ref: 'CustomCard',
    },
    nameOfCard: {
        type: String,
        ref: 'CustomCard',
    }
},{
    timestamps: false,
    versionKey: false,
    autoCreate: false
});

const Report = connectDB.model('Report', reportSchema);

export default Report;