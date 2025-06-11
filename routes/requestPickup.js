import express from "express";
import { deleteRequest, getALLpickup, getPickup, placeNewRequest, updateRequest } from "../controllers/requestPickupController.js";
import upload from "../config/multer.js";
import { authenticateUser } from "../middleware/authMiddleware.js";


const requestPickupRouter=express.Router();

//place new request
requestPickupRouter.post("/add-pickup-request",authenticateUser,upload.single("image"),placeNewRequest);
requestPickupRouter.patch("/update-pickup-request/:requestId",authenticateUser,upload.single("image"),updateRequest);
requestPickupRouter.get("/get-pickup-request/:id",authenticateUser,getPickup);
requestPickupRouter.get("/get-all-pickup-request",authenticateUser,getALLpickup);
requestPickupRouter.delete("/delete-pickup-request/:requestId",authenticateUser,deleteRequest);

export default requestPickupRouter;