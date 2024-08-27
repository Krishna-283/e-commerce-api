import { ApiError, asyncHandler } from '../utlis/index.js';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const tokens =
            req.cookies?.accessToken ||
            req.header('Authorization')?.replace('Bearer', '');
        if (!tokens) {
            throw new ApiError(401, 'Unauthorized request');
        }

        const decodedToken = jwt.verify(
            tokens,
            process.env.ACCESS_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id).select(
            '-password -refreshToken'
        );
        if (!user) {
            throw new ApiError(401, 'Invalid access Token');
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || 'Invalid access token');
    }
});

export const verifyAdmin = asyncHandler(async (req, _, next) => {
    if (req.user?.role !== 'admin') {
        throw new ApiError(401, 'Unauthorized requesst');
    }
    next();
});
