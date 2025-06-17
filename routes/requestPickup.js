import express from "express";
import { deleteRequest, getALLpickup, getPickup, personnelGetALLpickup, personnelUpdateRequest, placeNewRequest, updateRequest } from "../controllers/requestPickupController.js";
import upload from "../config/multer.js";
import { personnelAuthentication } from "../middleware/personnelAuthMiddleware.js";


const requestPickupRouter=express.Router();

//place new request
requestPickupRouter.post("/add-pickup-request",upload.single("image"),placeNewRequest);
requestPickupRouter.patch("/update-pickup-request/:requestId",upload.single("image"),updateRequest);
requestPickupRouter.get("/get-pickup-request/:id",getPickup);
requestPickupRouter.get("/get-all-pickup-request",getALLpickup);
requestPickupRouter.delete("/delete-pickup-request/:requestId",deleteRequest);

//admin
requestPickupRouter.get("/get-all-request",personnelAuthentication,personnelGetALLpickup);
requestPickupRouter.patch("/update-request/:requestId",personnelAuthentication,upload.single("image"),personnelUpdateRequest);

export default requestPickupRouter;