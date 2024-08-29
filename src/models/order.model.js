import mongoose, { Schema } from 'mongoose';
import { addressSchema } from './address.model.js';

const orderSchema = new Schema(
    {
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

        address: {
            type: addressSchema,
            required: true,
        },

        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                    default: 1,
                },
            },
        ],
    },
    { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);
