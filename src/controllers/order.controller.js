import { asyncHandler, ApiResponse, ApiError } from '../utlis/index.js';
import { Cart, Order, Product, User } from '../models/index.js';
import mongoose from 'mongoose';

export const createOrder = asyncHandler(async (req, res) => {
    const { address } = req.body;
    if (!address) {
        throw new ApiError(400, 'One or more missing fields');
    }
    const userId = req.user._id;

    const user = await User.findOne({ _id: userId });
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
        throw new ApiError(404, 'Cart not found');
    }

    for (const item of cart.items) {
        const product = await Product.findById(item.productId);
        if (!product) {
            throw new ApiError(404, `Product with ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
            throw new ApiError(400, `Not enough stock for ${item.productId}`);
        }

        product.stock -= item.quantity;
        await product.save();
    }

    const order = new Order({
        userId,
        address,
        totalAmount: cart.totalPrice,
        items: cart.items,
    });
    await order.save();

    return res
        .status(200)
        .json(new ApiResponse(200, order, 'Order created successfully'));
});

export const updateOrder = asyncHandler(async (req, res) => {
    const { orderId, paymentId } = req.body;
    if (!paymentId || !orderId) {
        throw new ApiError(400, 'One or more missing fields');
    }

    await Order.findByIdAndUpdate({ _id: orderId }, { paymentId });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, 'Order updated successfully'));
});

export const getOrdersByUser = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const orders = await Order.find({userId});
    if(!orders) {
        throw new ApiError(404, 'Orders not found');
    }

    return res.status(200).json(new ApiResponse(200, orders, 'Orders fetched successfully'));
})
