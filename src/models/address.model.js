import { Schema } from 'mongoose';

export const addressSchema = new Schema({
    street: {
        type: String,
        required: true,
        trim: true,
    },

    city: {
        type: String,
        required: true,
        trim: true,
    },

    state: {
        type: String,
        required: true,
        trim: true,
    },

    postal_code: {
        type: Number,
        required: true,
        trim: true,
    },

    country: {
        type: String,
        required: true,
        trim: true,
    },

    landmark: {
        type: String,
        trim: true
    }

});
