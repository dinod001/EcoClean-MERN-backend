import express from "express";
import {getAllNotifications, getNotificationById } from "../controllers/notificationContoller.js";

const notificationRouter=express.Router()

notificationRouter.get("/get-notification/:id",getNotificationById)
notificationRouter.get("/get-All-notifications",getAllNotifications)


export default notificationRouter;