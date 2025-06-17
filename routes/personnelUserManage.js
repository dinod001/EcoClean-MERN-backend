import express from "express"
import { deleteCustomer, deletePersonnel, getAllCustomers, getAllPersonnels, getCustomerById, getPersonnelById, updatePersonnel } from "../controllers/personnelManageUserController.js"
import { roleBaseAccessByAdmin } from "../middleware/roleAccessMiddleware.js"


const personnelUserManageRouter= express.Router()

/*Handle personnel CRUD*/

//delete a personnel
personnelUserManageRouter.delete("/deletePersonnel/:id",roleBaseAccessByAdmin,deletePersonnel)

//get personnel by id
personnelUserManageRouter.get("/getPersonnel/:id",roleBaseAccessByAdmin,getPersonnelById)

//get All personnel
personnelUserManageRouter.get("/getAllPersonnels",roleBaseAccessByAdmin,getAllPersonnels)

//update personnel details
personnelUserManageRouter.patch("/UpdatePersonnel/:id",roleBaseAccessByAdmin,updatePersonnel)


/*handle customer details*/

//get customer by id
personnelUserManageRouter.get("/getCustomer/:id",getCustomerById)

//get All customers
personnelUserManageRouter.get("/getAllCustomers",getAllCustomers)

//delete customer
personnelUserManageRouter.delete("/deleteCustomer/:id",deleteCustomer)

export default personnelUserManageRouter