import mongoose from "mongoose";

const connectDB = async () => {
    console.log("Connecting MongoDB...");

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });

        console.log("MongoDB Connected");

    } catch (error) {

        console.error("MongoDB Error:");
        console.error(error.message);

        process.exit(1);
    }
};

export default connectDB;