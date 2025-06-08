import express from "express";
import { deleteRequest, getALLpickup, getPickup, placeNewRequest, updateRequest } from "../controllers/requestPickupController.js";
import upload from "../config/multer.js";


const requestPickupRouter=express.Router();

//place new request
requestPickupRouter.post("/add-pickup-request",upload.single("image"),placeNewRequest);
requestPickupRouter.patch("/update-pickup-request/:requestId",upload.single("image"),updateRequest);
requestPickupRouter.get("/get-pickup-request/:id",getPickup);
requestPickupRouter.get("/get-all-pickup-request",getALLpickup);
requestPickupRouter.delete("/delete-pickup-request/:requestId",deleteRequest);

export default requestPickupRouter;