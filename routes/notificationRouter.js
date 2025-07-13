import express from "express"; 
import {
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  getAllNotifications
} from "../controllers/notificationContoller.js";

const notificationRouter = express.Router();

notificationRouter.get("/get-notification/:id",getNotificationById);
notificationRouter.get("/get-all-notifications",getAllNotifications);
notificationRouter.post("/create-notification",createNotification)
notificationRouter.patch("/update-notification/:id",updateNotification)
notificationRouter.delete("/delete-notification/:id",deleteNotification)
export default notificationRouter;
