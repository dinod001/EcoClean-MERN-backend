import express from "express"
import { personnelAuthentication } from "../middleware/personnelAuthMiddleware.js"
import { authenticateUser } from "../middleware/authMiddleware.js"
import upload from "../config/multer.js";
import {createBlogPost,getAllBlogPosts,getBlogPostById,updateBlogPost,deleteBlogPost} from "../controllers/blogController.js"

const blogRouter=express.Router()

//create blog post
blogRouter.post("/personnel/create-blog",personnelAuthentication,upload.single("image"),createBlogPost)
//get all blogs
blogRouter.get("/get-all-blogs",getAllBlogPosts)
//get blog by id
blogRouter.get("/get-blog/:id",getBlogPostById)
//update blog by id
blogRouter.patch("/personnel/update-blog/:id",personnelAuthentication,upload.single("image"),updateBlogPost)
//delete plog post by id
blogRouter.delete("/personnel/delete-blog/:id",personnelAuthentication,deleteBlogPost)
export default blogRouter;
