import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}


export async function connectToDatabase() {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("✅ Already connected to MongoDB.");
      return;
    }
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "ruet", // Ensure this is correct
    });
    console.log("✅ Connected to MongoDB.");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
}

