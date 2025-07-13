import mongoose from "mongoose";

//commentSchema for blog
const commentSchema = new mongoose.Schema({
  userId:{
        type:String,
        ref:"User",
        required:true
    },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Main Blog Post schema
const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnailUrl: {
      type: String,
    },
    displayImageUrls: {
      type: [String],
      default: [],
    },
    author: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("BlogPost", blogPostSchema);
