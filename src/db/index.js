import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}`)
        // await new Promise((resolve, reject) => {
        //     setTimeout(() => {
        //         resolve()
        //     }, 1000)
        // })
        console.log('MongoDB connected')
    } catch (error) {
        console.log("MongoDB connection failed: ", error)
        process.exit(1)
    }
}
