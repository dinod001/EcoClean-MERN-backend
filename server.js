import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/dbConnect.js";
import { clerkWebhooks, stripeWebhooks } from "./controllers/webHook.js";
import { clerkMiddleware } from "@clerk/express";
import serviceRouter from "./routes/serviceRouter.js";
import requestPickupRouter from "./routes/requestPickup.js";
import connectCloudinary from "./config/cloudinary.js";
import customerInquiryRouter from "./routes/customerInquiryRouter.js";
import notificationRouter from "./routes/notificationRouter.js";
import userRouter from "./routes/userRouter.js";
import personnelRouter from "./routes/personnelRouter.js";
import personnelUserManageRouter from "./routes/personnelUserManage.js";

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
server.use("/api/user",express.json(),serviceRouter)

//user
server.use("/api/user",express.json(),userRouter)

//plce pickup requst
server.use("/api/user",express.json(),requestPickupRouter)

//customer inquiries
server.use("/api/user",express.json(),customerInquiryRouter)

//notifications
server.use("/api/user",express.json(),notificationRouter)

//personnel login and regsiter
server.use("/api/personnel",express.json(),personnelRouter)

//personnel manage users
server.use("/api/personnel",express.json(),personnelUserManageRouter)

server.post("/clerk", express.json(), clerkWebhooks);





//PORT define
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is runnning on ${PORT}`);
});
