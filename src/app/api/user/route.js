import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req) {
  try {
    await connectToDatabase();
    const userId = req.nextUrl.searchParams.get("userId"); // Get user ID from query params
    if(userId=="all"){
      const users = await User.find();
      return Response.json(users); 
    }
    const user = await User.findOne({ userId });
    return Response.json(user);
  } catch (error) {
    return Response.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
    try {
      // Extract userId and description from the request body
      const { description } = await req.json();
      const userId = req.nextUrl.searchParams.get("userId");  // Get the userId from the URL parameters
  
      // Ensure the description is provided
      if (!description) {
        return new Response(JSON.stringify({ error: "Description is required" }), { status: 400 });
      }
  
      // Connect to MongoDB
      await connectToDatabase();
  
      // Find the user by userId and update the description
      const user = await User.findOne({ userId });
  
      if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
      }
  
      // Update the user's description
      user.description = description;
      await user.save();
  
      // Return a success response
      return new Response(JSON.stringify({ message: "Description updated successfully" }), { status: 200 });
    } catch (error) {
      console.error("Error updating user description:", error);
      return new Response(JSON.stringify({ error: "Failed to update description" }), { status: 500 });
    }
  }