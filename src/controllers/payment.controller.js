import { asyncHandler, ApiResponse, ApiError } from '../utlis/index.js';
import { Order, Payment } from '../models/index.js';

export const createPayment = asyncHandler(async (req, res) => {
    const { orderId, paymentMethod } = req.body;
    if (!orderId || !paymentMethod) {
        throw new ApiError(400, 'One or missing fields');
    }

    const userId = req.user._id;

    const order = await Order.findById(orderId);
    if (!order) {
        throw new ApiError(404, 'Order not found');
    }

    const payment = new Payment({
        userId,
        orderId,
        paymentMethod,
        amount: order.totalAmount,
    });

    await payment.save();

    return res
        .status(200)
        .json(new ApiResponse(200, payment, 'Payment success'));
});

export const updatePayment = asyncHandler(async (req, res) => {
    const { status, paymentId } = req.body;
    if (!paymentId || !status) {
        throw new ApiError(400, 'One or more missing fields');
    }

    await Payment.findByIdAndUpdate({ _id: paymentId }, { status });

    return res
        .status(200)
        .json(new ApiResponse(200, 'Payment updated sccessfully'));
});

export const getPayment = asyncHandler(async (req, res) => {
    const { paymentId } = req.params;
    if (!paymentId) {
        throw new ApiError(400, 'One or more missing fields');
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
        throw new ApiError(404, 'Order not found');
    }

    return res
        .status(200)
        .json(new ApiResponse(200, payment, 'Payment fetched successfully'));
});
