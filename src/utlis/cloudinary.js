import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({
    path: './.env',
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    // secure: true,
});

export const uploadOnCloudinary = async localFilePath => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
        });
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.error(error);
        fs.unlinkSync(localFilePath);
        return null;
    }
};

export const deleteOnCloudinary = async imageUrl => {
    try {
        const result = await cloudinary.uploader.destroy(imageUrl);
        console.log(result);
        return result === 'true';
    } catch (error) {
        console.error(error);
        return false;
    }
};
