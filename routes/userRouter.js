import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { completePayment } from "../controllers/userController.js";

const userRouter=express.Router();

userRouter.post("/purchase",authenticateUser, completePayment)

export default userRouter;