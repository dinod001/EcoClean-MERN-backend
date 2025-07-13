import mongoose from "mongoose";

// Blog Post Schema
const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    imageUrl: {
      type: String,
      default: "", // Optional: Add a default empty string if needed
    },
    author: {
      type: String,
      required: [true, "Author is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    status: {
      type: String,
      enum: ["Published", "Draft"],
      default: "Draft",
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Export the BlogPost model
export default mongoose.model("BlogPost", blogPostSchema);
