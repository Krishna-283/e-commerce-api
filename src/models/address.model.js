import { Schema } from 'mongoose';

export const addressSchema = new Schema({
    street: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },

    city: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },

    state: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },

    postalCode: {
        type: Number,
        required: true,
        trim: true,
    },

    country: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },

    landmark: {
        type: String,
        trim: true,
        lowercase: true,
    }

}, {_id: false});
