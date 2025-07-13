import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/dbConnect.js";
import { clerkWebhooks, stripeWebhooks } from "./controllers/webHook.js";
import { clerkMiddleware } from "@clerk/express";
import requestPickupRouter from "./routes/requestPickup.js";
import connectCloudinary from "./config/cloudinary.js";
import customerInquiryRouter from "./routes/customerInquiryRouter.js";
import notificationRouter from "./routes/notificationRouter.js";
import userRouter from "./routes/userRouter.js";
import personnelRouter from "./routes/personnelRouter.js";
import personnelUserManageRouter from "./routes/personnelUserManage.js";
import { authenticateUser } from "./middleware/authMiddleware.js";
import { personnelAuthentication } from "./middleware/personnelAuthMiddleware.js";
import serviceBookRouter from "./routes/serviceBookRouter.js";
import serviceRouter from "./routes/serviceRouter.js";
import employeeRouter from "./routes/employeeRouter.js";
import notificationUserRouter from "./routes/notificationUserRouter.js";
import Personnel from "./schema/Personnel.js";
import blogRouter from "./routes/blogRouter.js";
//server initialize
const server = express();

//connecto to database
await connectDB();
await connectCloudinary();

//middlewares
server.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);
server.use(express.json());
server.use(cors());
server.use(clerkMiddleware())


//routes
server.get("/", (req, res) => {
  res.status(200).send("API working");
});

//book services
server.use("/api/user",express.json(),authenticateUser,serviceBookRouter)

//user
server.use("/api/user",express.json(),authenticateUser,userRouter)

//place pickup requst
server.use("/api/user",express.json(),authenticateUser,requestPickupRouter)

//customer inquiries
server.use("/api/user",express.json(),authenticateUser,customerInquiryRouter)



//personnel login and register (MUST be first for public access)
server.use("/api/personnel",express.json(),personnelRouter)

// Mount serviceRouter immediately after personnelRouter for public service endpoints
server.use("/api/personnel",express.json(),serviceRouter)

//notifications-personnel
server.use("/api/personnel",express.json(),personnelAuthentication,notificationRouter)

//notifications-user
server.use("/api/user",express.json(),authenticateUser,notificationUserRouter)

// personnel manage users
server.use("/api/personnel",express.json(),personnelAuthentication,personnelUserManageRouter)

// personnel manage pickup request
server.use("/api/personnel",express.json(),personnelAuthentication,requestPickupRouter)

// personnel manage service request
server.use("/api/personnel",express.json(),personnelAuthentication,serviceBookRouter)

// personnel manage Employees
server.use("/api/personnel",express.json(),personnelAuthentication,employeeRouter)

// personnel manage inquiries
server.use("/api/personnel",express.json(),personnelAuthentication,customerInquiryRouter)

server.post("/clerk", express.json(), clerkWebhooks);

//Blog management
 server.use("/api",express.json(),blogRouter)



//PORT define
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is runnning on ${PORT}`);
});
