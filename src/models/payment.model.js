import mongoose, { Schema } from 'mongoose';

const paymentSchema = new Schema(
    {
        orderId: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
        },

        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
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
            default: 'pending',
        },
    },
    { timestamps: true }
);

export const Payment = mongoose.model('Payment', paymentSchema);
