// backend/src/models/event-users.model.js
import mongoose from "mongoose";
import { connectDB } from "../service/mongoDB.js";

const { Schema } = mongoose;

const eventUsersSchema = new Schema({
    eventId: {
        type: String,
        ref: 'Event',
        required: true,
        _id: true,
    },
    userId: {
        type: [String],
        ref: 'User',
        required: true
    },
    // tiradas: [tiradaSchema]
}, {
    versionKey: false,
    autoCreate: false,
    timestamps: false,
    id: false,
});

const EventUsers = connectDB.model('EventUsers', eventUsersSchema);

export default EventUsers;
