import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";  // Assuming you have a User model

export async function GET(req) {
  try {
    await connectToDatabase();

    const userId = req.nextUrl.searchParams.get("userId"); // Get user ID from query params
    const type = req.nextUrl.searchParams.get("type"); // Get type from query params
    let posts;

    console.log('userId:', userId);
    console.log('type:', type);

    if (userId === "all") {
      if (type) {
        // If type is provided, fetch posts of that type
        posts = await Post.find({ type }).sort({ date: -1 });
      } else {
        // If no type is provided, fetch all posts
        posts = await Post.find().sort({ date: -1 });
      }
    } else {
      // Fetch posts of a specific user
      posts = await Post.find({ userId }).sort({ date: -1 });
    }

    // Fetch user data and merge it with each post
    const postsWithUserData = await Promise.all(
      posts.map(async (post) => {
        const user = await User.findOne({ userId: post.userId });

        // Add user data to each post
        return {
          ...post.toObject(),
          user: {
            userId: user.userId,
            name: user.name,
            image: user.image,  // Assuming 'pfp' is the field for profile picture URL
          },
        };
      })
    );

    // Return the posts with user data
    return Response.json(postsWithUserData);
  } catch (error) {
    console.error(error);  // Log the error for debugging
    return Response.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}


export async function POST(req) {
  try {
    await connectToDatabase();

    // Parse the request body (assumed to be JSON)
    const { userId, type, title, description } = await req.json();

    // Validate incoming data
    if (!userId || !type || !title || !description) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create the new post
    const newPost = new Post({
      userId,
      type,
      title,
      description,
      date: new Date().toISOString(), // Get current date in ISO format
    });

    // Save the new post to the database
    await newPost.save();

    // Fetch the user data based on the userId from the newly created post
    const user = await User.findOne({ userId: newPost.userId });

    // Merge the user data with the post data
    const postWithUserData = {
      ...newPost.toObject(),
      user: {
        userId: user.userId,
        name: user.name,
        image: user.image, // Assuming 'image' is the field for profile picture URL
      },
    };

    // Return the post with user data as response
    return Response.json( { status: 201, project: postWithUserData, success: true });
  } catch (error) {
    console.error(error);  // Log the error for debugging
    return Response.json({ error: "Failed to add post" }, { status: 500 });
  }
}


