import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Define the User schema
const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  description: { type: String, default: "" },
  password: { type: String, required: true },
  image: { type: String, default: ""},
});

// Pre-save hook to hash the password before saving the user
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Automatically exclude password when sending user data (toJSON transformation)
UserSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password; // Remove the password field from the returned object
    return ret;
  },
});

// Export the User model
export default mongoose.models.User || mongoose.model("User", UserSchema);
