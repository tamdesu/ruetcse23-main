import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    // Parse request body correctly
    const { userId, password } = await req.json();
    console.log(userId, password)

    // Connect to MongoDB
    await connectToDatabase();

    // Find the user by userId
    const user = await User.findOne({ userId });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Compare the password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return new Response(JSON.stringify({ error: "Password incorrect" }), { status: 401 });
    }

    // Return user details if password is correct
    return new Response(JSON.stringify({ message: "Login successful", user: { _id: user._id, userId: user.userId } }), { status: 200 });

  } catch (error) {
    console.error("Error logging in user", error);
    return new Response(JSON.stringify({ error: "Failed to log user in" }), { status: 500 });
  }
}
