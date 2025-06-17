import express from "express";
import { completePayment } from "../controllers/userController.js";

const userRouter=express.Router();

userRouter.post("/purchase", completePayment)

export default userRouter;