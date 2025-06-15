import express from "express"
import { deleteCustomer, deletePersonnel, getAllCustomers, getAllPersonnels, getCustomerById, getPersonnelById, updatePersonnel } from "../controllers/personnelManageUserController.js"
import { personnelAuthentication } from "../middleware/personnelAuthMiddleware.js"
import { roleBaseAccessByAdmin } from "../middleware/roleAccessMiddleware.js"


const personnelUserManageRouter= express.Router()

/*Handle personnel CRUD*/

//delete a personnel
personnelUserManageRouter.delete("/deletePersonnel/:id",personnelAuthentication,roleBaseAccessByAdmin,deletePersonnel)

//get personnel by id
personnelUserManageRouter.get("/getPersonnel/:id",personnelAuthentication,roleBaseAccessByAdmin,getPersonnelById)

//get All personnel
personnelUserManageRouter.get("/getAllPersonnels",personnelAuthentication,roleBaseAccessByAdmin,getAllPersonnels)

//update personnel details
personnelUserManageRouter.patch("/UpdatePersonnel/:id",personnelAuthentication,roleBaseAccessByAdmin,updatePersonnel)


/*handle customer details*/

//get customer by id
personnelUserManageRouter.get("/getCustomer/:id",personnelAuthentication,getCustomerById)

//get All customers
personnelUserManageRouter.get("/getAllCustomers",personnelAuthentication,getAllCustomers)

//delete customer
personnelUserManageRouter.delete("/deleteCustomer/:id",personnelAuthentication,deleteCustomer)

export default personnelUserManageRouter