import express from "express"
import { personnelAuthentication } from "../middleware/personnelAuthMiddleware.js"
import { personnelDetails, personnelLogin, personnelRegister } from "../controllers/personnelController.js"

const personnelRouter=express.Router()

//register personnel
personnelRouter.post("/register",personnelRegister)

//login personnel
personnelRouter.post("/login",personnelLogin)

//get login personnel details
personnelRouter.get("/me",personnelAuthentication,personnelDetails)

export default personnelRouter;