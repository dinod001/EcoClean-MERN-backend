import express from "express";
import { addNewInquiry, deleteInquiry, getAllInquiries, getAllInquiriesByPersonnel, getInquiryById, updateInquiry } from "../controllers/customerInquiryController.js";
import { personnelAuthentication } from "../middleware/personnelAuthMiddleware.js";

const customerInquiryRouter=express.Router();


customerInquiryRouter.post("/add-new-inquiry",addNewInquiry)
customerInquiryRouter.patch("/update-inquiry/:id",updateInquiry)
customerInquiryRouter.get("/get-inquiry/:id",getInquiryById)
customerInquiryRouter.get("/get-all-inquiries",getAllInquiries)
customerInquiryRouter.delete("/delete-inquiry/:id",deleteInquiry)
customerInquiryRouter.get("/get-All-inquries-personnel",personnelAuthentication,getAllInquiriesByPersonnel)

export default customerInquiryRouter;