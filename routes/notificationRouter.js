import express from "express";
import {getAllNotifications, getNotificationById } from "../controllers/notificationContoller.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const notificationRouter=express.Router()

notificationRouter.get("/get-notification/:id",authenticateUser,getNotificationById)
notificationRouter.get("/get-All-notifications",authenticateUser,getAllNotifications)


export default notificationRouter;