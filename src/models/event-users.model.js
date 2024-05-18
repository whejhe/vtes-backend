// backend/src/models/event-users.model.js
import mongoose from "mongoose";
import { connectDB } from "../service/mongoDB.js";

const { Schema } = mongoose;

const tiradaSchema = new Schema({
    userId: {
        type: String,
        ref: 'User',
        required: true
    },
    round1: {
        type: Number,
        default: null
    },
    round2: {
        type: Number,
        default: null
    },
    round3: {
        type: Number,
        default: null
    }
}, {
    _id: false
});

const eventUsersSchema = new Schema({
    eventId: {
        type: String,
        ref: 'Event',
        required: true
    },
    userId: {
        type: String,
        ref: 'User',
        required: true
    },
    tiradas: [tiradaSchema]
}, {
    versionKey: false,
    autoCreate: false,
    timestamps: false
});

const EventUsers = connectDB.model('EventUsers', eventUsersSchema);

export default EventUsers;
