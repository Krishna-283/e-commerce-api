import { asyncHandler, ApiResponse, ApiError } from '../utlis/index.js';
import { Product, Review } from '../models/index.js';

export const addReview = asyncHandler(async (req, res) => {
    const { rating, title, comment } = req.body;
    const { productId } = req.params;
    if (!rating || !title || !comment) {
        throw new ApiError(400, 'One or more missing fields');
    }

    if (rating < 1 || rating > 5) {
        throw new ApiError(400, 'Rating out of range');
    }

    const userId = req.user._id;

    const product = await Product.findOne({ _id: productId });
    if (!product) {
        throw new ApiError(404, 'Product not found');
    }

    const review = new Review({
        userId,
        productId,
        comment,
        rating,
    });

    await review.save();

    const createdReview = await Review.findById(review._id);

    return res
        .status(200)
        .json(new ApiResponse(200, createdReview, 'Review added successfully'));
});

export const deleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    if (!reviewId) {
        throw new ApiError(400, 'Review id required');
    }

    const isDeleted = await Review.findByIdAndDelete({ _id: reviewId });
    if (!isDeleted) {
        throw new ApiError(500, 'Error deleting review');
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, 'Review deleted successfully'));
});

export const getAllProductReview = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    if (!productId) {
        throw new ApiError(400, 'Product id is required');
    }

    const reviews = await Review.find({ productId });
    if (!reviews) {
        throw new ApiError(404, 'Product review not found');
    }

    return res
        .status(200)
        .json(new ApiResponse(200, reviews, 'Reviews fetched successfully'));
});

export const getReviewById = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    if (!reviewId) {
        throw new ApiError(400, 'Review id required');
    }

    const review = await Review.findById({ _id: reviewId });
    if (!review) {
        throw new ApiError(404, 'Review not found');
    }

    return res
        .status(200)
        .json(new ApiResponse(200, review, 'Review fetched successfully'));
});
