import express from 'express'
import { addServiceBook, deleteBooking, getAllBooking, getBooking, personnelGetAllBooking, updateBooking } from '../controllers/serviceBookController.js'
import { personnelAuthentication } from '../middleware/personnelAuthMiddleware.js'


const serviceRouter=express.Router()


serviceRouter.post("/book-service",addServiceBook)
serviceRouter.delete("/delete-booking/:id",deleteBooking)
serviceRouter.put("/update-booking",updateBooking)
serviceRouter.get("/all-bookings",getAllBooking)
serviceRouter.get("/get-booking/:id",getBooking)
serviceRouter.get("/getall-bookings",personnelAuthentication,personnelGetAllBooking)

export default serviceRouter;