import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        required: true,
        trim: true,
    },

    category: {
        type: String,
        enum: ['category1', 'category2', 'category3', 'category4'],
        required: true
    },

    price: {
        type: Number,
        required: true,
    },

    stock: {
        type: Number,
        required: true,
    },

    image_url: {
        type: String
    }

}, { timestamps: true })

export const Product = mongoose.model("Product", productSchema);
