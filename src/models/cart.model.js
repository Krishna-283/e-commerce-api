import mongoose, { Schema } from 'mongoose';

const itemSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
    },

    quantity: {
        type: Number,
        min: 1,
    }
})

const cartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    items: {
        type: [itemSchema],
        required: true,
    }

}, { timestamps: true });

export const Cart = mongoose.model("Cart", cartSchema);
