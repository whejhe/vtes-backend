// //front/src/models/event.model.js
import mongoose from "mongoose";
import { connectDB } from "../service/mongoDB.js";
import { v4 as uuidv4 } from "uuid";

const { Schema } = mongoose;

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
const priceRegex = /^\d+(\.\d{2})?$/;

const eventSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    userId: {
        type: String,
        ref: 'User',
    },
    name: {
        type: String,
        minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
        maxlength: [30, 'El nombre debe tener un maximo de 30 caracteres'],
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        validate: {
            validator: (v) => emailRegex.test(v),
            message: 'El email no es valido'
        }
    },
    type: {
        type: String,
        required: [true, 'El tipo de torneo es obligatorio'],
    },
    precio: {
        type: String,
        required: [true, 'El precio del torneo es obligatorio'],
        validate: {
            validator: (v) => priceRegex.test(v),
            message: 'El precio del torneo no es valido, Ejemplo: 0.00'
        }
    },
    provincia: {
        type: String,
        required: [true, 'La provincia es obligatoria'],
    },
    localidad: {
        type: String,
        required: [true, 'La localidad es obligatoria'],
    },
    direccion: {
        type: String,
    },
    description: {
        type: String,
    },
    fecha: {
        type: String,
        required: [true, 'La fecha es obligatoria'],
    },
    hora: {
        type: String,
        required: [true, 'La hora es obligatoria'],
        validate: {
            validator: (v) => timeRegex.test(v),
            message: 'El formato de la hora no es valido. Ejemplo: 00:00'
        }
    },
    numMaxParticipantes: {
        type: Number,
        required: false,
    },
    participantesInscritos:{
        type: Number,
        required: false,
    },
    ronda: [
        {
            numero: {
                type: Number,
                required: true
            },
            mesas: [
                {
                    numero: {
                        type: Number,
                        required: true
                    },
                    players: [
                        {
                            userId: {
                                type: String,
                                ref: 'User'
                            },
                            tablePoints: {
                                type: Number,
                                default: 0
                            },
                            points: {
                                type: Number,
                                default: 0
                            }
                        }
                    ]
                }
            ]
        }
    ]
},
{
    timestamps: false,
    versionKey: false
});



const Event = connectDB.model('Event', eventSchema);

export default Event;
