import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req) {
  try {
    await connectToDatabase();

    // Extract query parameters from the request URL
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const _id = searchParams.get("_id");

    console.log("userId:", userId);
    console.log("id:", _id);

    if (!userId || !_id) {
      return new Response(JSON.stringify({ error: "Missing parameters" }), { status: 400 });
    }

    // Validate login
    const user = await User.findOne({ _id, userId });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch user" }), { status: 500 });
  }
}
