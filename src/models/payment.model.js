import mongoose, { Schema } from 'mongoose';

const paymentSchema = new Schema({
    orderId: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },

    amount: {
        type: Number,
        required: true,
    },

    paymentMethod: {
        type: String,
        enum: ['credit', 'cash', 'upi', 'debit'],
        required: true,
    },

    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        required: true,
    }


}, { timestamps: true });

export const Payment = mongoose.models('Payment', paymentSchema);
