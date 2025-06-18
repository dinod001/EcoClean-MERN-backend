import express from 'express'
import { addServiceBook, deleteBooking, getAllBooking, getBooking, personnelGetAllBooking, updateBooking } from '../controllers/serviceBookController.js'
import { personnelAuthentication } from '../middleware/personnelAuthMiddleware.js'


const serviceBookRouter=express.Router()


serviceBookRouter.post("/book-service",addServiceBook)
serviceBookRouter.delete("/delete-booking/:id",deleteBooking)
serviceBookRouter.put("/update-booking",updateBooking)
serviceBookRouter.get("/all-bookings",getAllBooking)
serviceBookRouter.get("/get-booking/:id",getBooking)
serviceBookRouter.get("/getall-bookings",personnelAuthentication,personnelGetAllBooking)

export default serviceBookRouter;