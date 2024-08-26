import { asyncHandler, ApiResponse, ApiError } from '../utlis/index.js';
import { User } from '../models/index.js';
import { uploadOnCloudinary } from '../utlis/cloudinary.js';

export const registerUser = asyncHandler(async (req, res) => {
    const { username, name, email, password, phoneNumber, address } = req.body;
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

    let avatarUrl;
    if (req.files?.avatar?.[0]?.path) {
        const avatarLocalPath = req.files.avatar[0].path;
        const response = await uploadOnCloudinary(avatarLocalPath);
        avatarUrl = response.url;
    }

    const userData = {
        username: username.toLowerCase(),
        email,
        name: name.toLowerCase(),
        phoneNumber,
        address: addressDetails,
        password,
    };

    if (avatarUrl) {
        userData.imageUrl = avatarUrl;
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
