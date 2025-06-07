import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/dbConnect.js";
import { clerkWebhooks } from "./controllers/webHook.js";

//server initialize
const server = express();

//connecto to database
await connectDB();

//middlewares
server.use(express.json());
server.use(cors());

//routes
server.get("/", (req, res) => {
  res.status(200).send("API working");
});

server.post("/clerk", express.json(), clerkWebhooks);

//PORT define
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Server is runnning");
});
