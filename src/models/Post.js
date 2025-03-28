import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['resources', 'projects', "random"],  // restricts type to 'resources' or 'projects'
    message: '{VALUE} is not a valid type' // optional custom error message
  },
  title: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, required: true },
});

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
