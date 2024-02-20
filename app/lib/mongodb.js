import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("connection to MongoDB failed");
    console.log(`Error: ${error}`);
  }
};
