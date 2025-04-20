import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conectionString = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connected to MongoDB ${conectionString.connection.host}`);
    } catch (err) {
        console.log("Failed to connect to MongoDB", err);
        process.exit(1);
    }
};