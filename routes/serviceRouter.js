import express from 'express'
import { addServiceBook, deleteBooking, getAllBooking, getBooking, updateBooking } from '../controllers/serviceBookController.js'

const serviceRouter=express.Router()


serviceRouter.post("/book-service",addServiceBook)
serviceRouter.delete("/delete-booking/:id",deleteBooking)
serviceRouter.put("/update-booking",updateBooking)
serviceRouter.get("/all-bookings/:id",getAllBooking)
serviceRouter.get("/get-booking/:id",getBooking)


export default serviceRouter;