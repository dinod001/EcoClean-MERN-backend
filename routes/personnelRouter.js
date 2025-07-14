import express from "express"
import { personnelAuthentication } from "../middleware/personnelAuthMiddleware.js"
import { personnelDetails, personnelLogin, personnelRegister,resetPersonnelPassword } from "../controllers/personnelController.js"
import { roleBaseAccessByAdmin } from "../middleware/roleAccessMiddleware.js"
const personnelRouter=express.Router()

//register personnel
personnelRouter.post("/register",personnelRegister)

//login personnel
personnelRouter.post("/login",personnelLogin)

//get login personnel details
personnelRouter.get("/me",personnelAuthentication,personnelDetails)


//personnel password reset
personnelRouter.patch("/reset-password/:id",personnelAuthentication,roleBaseAccessByAdmin,resetPersonnelPassword)

export default personnelRouter;