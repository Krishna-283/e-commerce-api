import mongoose, { Schema } from 'mongoose';
import { addressSchema } from './address.model.js';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
        minLength: 3,
        maxLength: 25
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true
    },

    phone_number: {
        type: String,
        required: [true, "Phone number is required"],
        unique: true,
        trim: true,
        minLength: 10,
        maxLength: 15
    },

    image_url: {
        type: String,
    },

    password: {
        type: String,
        required: [true, 'Password is required']
    },

    address: {
        type: addressSchema,
    },

    refreshToken: {
        type: String
    }

}, { timestamps: true })

userSchema.pre("Save", async function(next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
}

export const User = mongoose.model("User", userSchema);
