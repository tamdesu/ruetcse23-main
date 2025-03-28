import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import cloudinary from "cloudinary";
import { NextResponse } from "next/server";

// Configure Cloudinary
cloudinary.v2.config({ cloudinary_url: process.env.CLOUDINARY_URL });

export async function POST(req) {
  try {
    const { userId, image } = await req.json(); // Get the form data from request

    if (!userId || !image) {
      return NextResponse.json({ error: "Missing userId or image" }, { status: 400 });
    }

    // Convert Base64 string to binary buffer
    const buffer = Buffer.from(image, 'base64');

    // Connect to the database
    await connectToDatabase();

    // Upload the image to Cloudinary as a buffer
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload_stream(
        { folder: "profile_pictures", resource_type: "auto" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer); // Pass the buffer to the upload stream
    });

    // Update MongoDB with new profile picture URL
    const updatedUser = await User.findOneAndUpdate(
      { userId },
      { image: uploadResponse.secure_url },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Profile picture updated successfully",
      user: {
        userId: updatedUser.userId,
        name: updatedUser.name,
        image: updatedUser.image,
      },
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    return NextResponse.json({ error: "Failed to update profile picture" }, { status: 500 });
  }
}
