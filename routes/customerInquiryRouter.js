import express from "express";
import { addNewInquiry, deleteInquiry, getAllInquiries, getInquiryById, updateInquiry } from "../controllers/customerInquiryController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const customerInquiryRouter=express.Router();


customerInquiryRouter.post("/add-new-inquiry",authenticateUser,addNewInquiry)
customerInquiryRouter.patch("/update-inquiry/:id",authenticateUser,updateInquiry)
customerInquiryRouter.get("/get-inquiry/:id",authenticateUser,getInquiryById)
customerInquiryRouter.get("/get-all-inquiries",authenticateUser,getAllInquiries)
customerInquiryRouter.delete("/delete-inquiry/:id",authenticateUser,deleteInquiry)

export default customerInquiryRouter;