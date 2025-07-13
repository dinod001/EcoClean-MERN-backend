import express from "express"
import { personnelAuthentication } from "../middleware/personnelAuthMiddleware.js"
import { authenticateUser } from "../middleware/authMiddleware.js"
import {createBlogPost,getAllBlogPosts,getBlogPostById,updateBlogPost,deleteBlogPost,addComment,deleteComment } from "../controllers/blogController.js"

const blogRouter=express.Router()

//create blog post
blogRouter.post("/personnel/create-blog",personnelAuthentication,createBlogPost)
//get all blogs
blogRouter.get("/get-all-blogs",getAllBlogPosts)
//get blog by id
blogRouter.get("/get-blog/:id",getBlogPostById)
//update blog by id
blogRouter.patch("/personnel/update-blog/:id",personnelAuthentication,updateBlogPost)
//delete plog post by id
blogRouter.delete("/personnel/delete-blog/:id",personnelAuthentication,deleteBlogPost)
//add a blog comment
blogRouter.post("/user/add-blog-comment/:id",authenticateUser,addComment)
//delete a blog comment
blogRouter.delete("/user/blog/:id/delete-comment/:commentId",authenticateUser,deleteComment)
export default blogRouter;