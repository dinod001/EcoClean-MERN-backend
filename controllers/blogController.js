import { v2 as cloudinary } from "cloudinary";
import BlogPost from "../schema/BlogPost.js";

//create a new blog post
export const createBlogPost = async (req, res) => {
  try {
    const { blogData } = req.body;
    const image = req.file; 

    if (!image) {
      return res.status(400).json({ success: false, message: "Thumbnail image not attached" });
    }

    const parsedBlogData = JSON.parse(blogData);

    const uploaded = await cloudinary.uploader.upload(image.path);
    parsedBlogData.imageUrl = uploaded.secure_url;


    parsedBlogData.isPublished = parsedBlogData.isPublished === "true";
    parsedBlogData.displayImageUrls = [];

    const newBlogPost = await BlogPost.create(parsedBlogData);
    res.status(201).json({ success: true, message: "Blog created", data: newBlogPost });
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
    const { blogData } = req.body;
    const thumbnailFile = req.file;

    const parsedBlogData = JSON.parse(blogData);

    const updateData = {
      title: parsedBlogData.title,
      author: parsedBlogData.author,
      description: parsedBlogData.description,
      isPublished: parsedBlogData.isPublished === "true",
    };

    if (thumbnailFile) {
      const thumbnailUpload = await cloudinary.uploader.upload(thumbnailFile.path);
      updateData.imageUrl = thumbnailUpload.secure_url;
    }

    const updatedBlogPost = await BlogPost.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    if (!updatedBlogPost) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.status(200).json({ success: true, message: "Blog updated", data: updatedBlogPost });
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

