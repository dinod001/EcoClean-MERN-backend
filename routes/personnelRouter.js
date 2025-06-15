import express from "express";
import jwt from "jsonwebtoken";
import Personnel from "../schema/Personnel.js";
import { personnelAuthentication } from "../middleware/personnelAuthMiddleware.js";

const personnelAuthRouter = express.Router();

//regitser new user
personnelAuthRouter.post("/register", async (req, res) => {
  const { personnelInfo} = req.body;
  try {
        const requiredFields = [
        "userName",
        "email",
        "password",
        "fullName",
        "gender",
        "age",
        "birthDay",
        "nic",
        "contact",
        "adress",
    ];

    if (!personnelInfo) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }

    for (const field of requiredFields) {
        if (!personnelInfo[field]) {
        return res.status(400).json({ message: `Please fill the ${field} field` });
        }
    }
    const checkexist = await Personnel.findOne({ userName });
    if (checkexist) {
      return res.status(400).json({ message: "User already exist" });
    }
    const user = await Personnel.create(personnelInfo);
    const token = generateWebToken(user._id);
    res.status(201).json({
      _id: user._id,
      username: Personnel.username,
      email: Personnel.email,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "INTERNEL SERVER ERROR", err: error });
  }
});

//login user
personnelAuthRouter.post("/login", async (req, res) => {
  const { userName, password } = req.body;
  try {
    const personnel = await Personnel.findOne({ userName });
    if (!personnel || (await !personnel.matchPassword(password))) {
      return res.status(400).json({ message: "Inavlid credentials" });
    }
    const token = generateWebToken(user._id);
    res.json({
      _id: Personnel._id,
      username: Personnel.username,
      email: Personnel.email,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "INTERNEL SERVER ERROR", err: error });
  }
});

personnelAuthRouter.get("/me", personnelAuthentication, async (req, res) => {
  res.status(200).json(req.personnel);
});

//genrated web token
const generateWebToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export default authRouter;
