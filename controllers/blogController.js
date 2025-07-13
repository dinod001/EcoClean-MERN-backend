import { v2 as cloudinary } from "cloudinary";
import BlogPost from "../schema/BlogPost.js";

// Create a blog post
export const createBlogPost = async (req, res) => {
  try {
    const { title, author, description, isPublished } = req.body;
    const thumbnailFile = req.files?.thumbnail?.[0];

    let thumbnailUrl = "";
    if (thumbnailFile) {
      const uploaded = await cloudinary.uploader.upload(thumbnailFile.path);
      thumbnailUrl = uploaded.secure_url;
    }

    const blogPostData = {
      title,
      author,
      description,
      isPublished: isPublished === "true",
      thumbnailUrl,
      displayImageUrls: [],
    };

    const newBlogPost = await BlogPost.create(blogPostData);
    res.status(201).json({ success: true, data: newBlogPost });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all blog posts
export const getAllBlogPosts = async (req, res) => {
  try {
    const blogPosts = await BlogPost.find();
    res.status(200).json({ success: true, data: blogPosts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a blog post by ID
export const getBlogPostById = async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, data: blogPost });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a blog post
export const updateBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, description, isPublished } = req.body;
    const thumbnailFile = req.files?.thumbnail?.[0];

    const updateData = {
      title,
      author,
      description,
      isPublished: isPublished === "true",
    };

    if (thumbnailFile) {
      const thumbnailUpload = await cloudinary.uploader.upload(thumbnailFile.path);
      updateData.thumbnailUrl = thumbnailUpload.secure_url;
    }

    const updatedBlogPost = await BlogPost.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    if (!updatedBlogPost) return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, data: updatedBlogPost });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a blog post
export const deleteBlogPost = async (req, res) => {
  try {
    const blogPost = await BlogPost.findByIdAndDelete(req.params.id);
    if (!blogPost) return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a comment
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, content } = req.body;
    const blog = await BlogPost.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog post not found" });
    blog.comments.push({ userId, content });
    await blog.save();
    res.status(201).json({ message: "Comment added", comment: blog.comments.at(-1) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;

    const blog = await BlogPost.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog post not found" });

    blog.comments = blog.comments.filter(c => c._id.toString() !== commentId);
    await blog.save();

    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

