import express from 'express'
import { addServiceBook, deleteBooking, getAllBooking, getBooking, updateBooking } from '../controllers/serviceBookController.js'
import { authenticateUser } from '../middleware/authMiddleware.js'

const serviceRouter=express.Router()


serviceRouter.post("/book-service",authenticateUser,addServiceBook)
serviceRouter.delete("/delete-booking/:id",authenticateUser,deleteBooking)
serviceRouter.put("/update-booking",authenticateUser,updateBooking)
serviceRouter.get("/all-bookings",authenticateUser,getAllBooking)
serviceRouter.get("/get-booking/:id",authenticateUser,getBooking)


export default serviceRouter;