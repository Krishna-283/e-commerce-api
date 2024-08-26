import mongoose, { Schema } from "mongoose";
import addressSchema from './address.model.js';

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    status: {
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },

    totalAmount: {
        type: Number,
        required: true,
    },

    paymentId: {
        type: Schema.Types.ObjectId,
        ref: 'Payment',
        required: true,
    },

    address: {
        type: addressSchema,
        required: true,
    }

}, { timestamps: true });

export const Order = mongoose.models("Order", orderSchema);
