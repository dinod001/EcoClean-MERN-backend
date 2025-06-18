import express from "express";
import { addService, deleteService, getAllServices, getServiceById, updateService } from "../controllers/serviceController.js";
import upload from "../config/multer.js";

const serviceRouter=express.Router()


serviceRouter.post("/add-new-service",upload.single("image"),addService)
serviceRouter.get("/get-service/:id",getServiceById)
serviceRouter.get("/get-all-services",getAllServices)
serviceRouter.delete("/delete-service/:id",deleteService)
serviceRouter.patch("/update-service/:id",upload.single("image"),updateService)

export default serviceRouter