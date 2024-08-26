import mongoose, { Schema } from 'mongoose';

const reviewSchema = new Schema({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },

    comment: {
        type: String,
        trim: true,
    },

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    }

}, { timestamps: true });

export const Review = mongoose.model("Review", reviewSchema);
