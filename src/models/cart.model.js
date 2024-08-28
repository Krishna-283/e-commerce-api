import mongoose, { Schema } from 'mongoose';

const itemSchema = new Schema({
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
});

const cartSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },

        items: {
            type: [itemSchema],
            default: true,
        },

        totalPrice: {
            type: Number,
            default: 0,
        },

        totalItems: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

cartSchema.pre('save', async function (next) {
    if (!this.isModified('items')) return next();

    this.totalItems = this.items.reduce((acc, item) => acc + item.quantity, 0);

    this.totalPrice = 0;
    for (let item of this.items) {
        const product = await mongoose
            .model('Product')
            .findById(item.productId);
        if (product) {
            this.totalPrice += product.price * item.quantity;
        }
    }

    next();
});

export const Cart = mongoose.model('Cart', cartSchema);
