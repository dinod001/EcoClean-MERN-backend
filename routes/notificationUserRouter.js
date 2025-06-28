import express from "express"; 
import {
  getAllNotifications
} from "../controllers/notificationUserController.js";

const notificationUserRouter = express.Router();

notificationUserRouter.get("/get-All-notifications", getAllNotifications);

export default notificationUserRouter;