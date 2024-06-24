import mongoose from "mongoose";

let connected = false;

const connectDB = async () => {
  mongoose.set("strictQuery", true);

  // If database is already connected then do not connect again
  if (connected) {
    console.log("MongoDB is already connected...");
    return;
  }

  // Connect to MongoDB
  try {
    await mongoose.connect(String(process.env.MONGODB_URI));
    connected = true;
    console.log("MongoDB connected...");
  } catch (error) {
    console.error(error);
  }
};

export default connectDB;
