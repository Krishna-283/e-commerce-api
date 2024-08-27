import { asyncHandler, ApiResponse, ApiError } from '../utlis/index.js';
import { User } from '../models/index.js';
import { uploadOnCloudinary } from '../utlis/cloudinary.js';
import jwt from 'jsonwebtoken';

const generateAccessAndRefreshTokens = async userId => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, 'Something went wrong while generating tokens');
    }
};

export const registerUser = asyncHandler(async (req, res) => {
    const { username, name, email, password, phoneNumber, address, role } =
        req.body;
    const addressDetails = {
        street: address?.street || '',
        city: address?.city || '',
        state: address?.state || '',
        postalCode: address?.postalCode || '',
        country: address?.country || '',
        landmark: address?.landmark || '',
    };

    if (
        [
            username,
            name,
            email,
            password,
            phoneNumber,
            addressDetails.street,
            addressDetails.city,
            addressDetails.state,
            addressDetails.postalCode,
            addressDetails.country,
        ].some(field => field?.trim() === '')
    ) {
        throw new ApiError(400, 'All fields required');
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }, { phoneNumber }],
    });

    if (existedUser) {
        throw new ApiError(409, 'User already exist');
    }

    const userData = {
        username: username.toLowerCase(),
        email,
        name: name.toLowerCase(),
        phoneNumber,
        address: addressDetails,
        password,
        role,
    };

    if (req.files?.avatar?.[0]?.path) {
        const avatarLocalPath = req.files.avatar[0].path;
        const response = await uploadOnCloudinary(avatarLocalPath);
        userData.imageUrl = response.url;
    }

    const user = new User(userData);
    await user.save();

    const createdUser = await User.findOne(user._id).select(
        '-password -refreshToken'
    );
    if (!createdUser) {
        throw new ApiError(500, 'Something went wrong while creating user');
    }

    return res
        .status(201)
        .json(
            new ApiResponse(200, createdUser, 'User registered successfully')
        );
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
    if (!email && !username) {
        throw new ApiError(400, 'username or email is required');
    }

    const user = await User.findOne({
        $or: [{ username }, { email }],
    });
    if (!user) {
        throw new ApiError(404, 'user does not exists');
    }

    const isValidPassword = await user.isPasswordCorrect(password);
    if (!isValidPassword) {
        throw new ApiError(404, 'Invalid user credentials');
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user._id
    );
    const loggedInUser = await User.findById(user._id).select(
        '-password -refreshToken'
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                'User logged In Successfully'
            )
        );
});

export const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(new ApiResponse(200, {}, 'User logged out'));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookie?.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(401, 'unauthorized request');
    }

    try {
        const decodeToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_ACCESS_SECRET
        );

        const user = await User.findById(decodeToken._id);
        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, 'Invalid refresh token');
        }

        const options = {
            httpOnly: true,
            secure: true,
        };

        const { accessToken, newRefreshToken } =
            await generateAccessAndRefreshTokens(user._id);

        return res
            .status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', newRefreshToken, options)
            .json(
                new ApiResponse(200, {
                    accessToken,
                    refreshToken: newRefreshToken,
                })
            );
    } catch (error) {
        throw new ApiError(401, error?.message, 'Invali refresh token');
    }
});

export const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        throw new ApiError(401, 'Invalid old password');
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, 'Password changed successfully'));
});

export const getUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, 'user fetched successfully'));
});
