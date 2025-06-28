import express from "express";
import { addEmployee, getEmployeeById, getAllEmployees, updateEmployee, deleteEmployee } from "../controllers/EmployeeManageController.js";


const employeeRouter=express.Router()

employeeRouter.post("/create-employee",addEmployee)
employeeRouter.delete("/delete-employee/:id",deleteEmployee)
employeeRouter.put("/update-employee/:id",updateEmployee)
employeeRouter.get("/all-employees",getAllEmployees)
employeeRouter.get("/get-employee/:id",getEmployeeById)

export default employeeRouter;