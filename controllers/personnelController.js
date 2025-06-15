import express from "express";
import jwt from "jsonwebtoken";
import Personnel from "../schema/Personnel.js";

const personnelAuthRouter = express.Router();

//regitser new user
export const personnelRegister= async (req, res) => {
  const { personnelInfo} = req.body;
  try {
    const {
        fullName,
        gender,
        age,
        birthDay,
        nic,
        contact,
        adress,
        email,
        userName,
        password,
        role
    } = personnelInfo;

    // Simple validation
    if (!userName || !email || !password || !fullName || !gender || !age || !birthDay || !nic || !contact || !adress) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }
    const checkexist = await Personnel.findOne({ userName });
    if (checkexist) {
      return res.status(400).json({ message: "User already exist" });
    }
    const user = await Personnel.create(personnelInfo);
    const token = generateWebToken(user._id,user.role);
    res.status(201).json({
      _id: user._id,
      username: Personnel.username,
      email: Personnel.email,
      role:Personnel.role,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "INTERNEL SERVER ERROR", err: error });
  }
};

//login user
export const personnelLogin= async (req, res) => {
  const { userName, password } = req.body;
  try {
    const personnel = await Personnel.findOne({ userName });
    if (!personnel || (await !personnel.matchPassword(password))) {
      return res.status(400).json({ message: "Inavlid credentials" });
    }
    const token = generateWebToken(personnel._id,personnel.role);
    res.json({
      _id: Personnel._id,
      username: Personnel.username,
      email: Personnel.email,
      role:Personnel.role,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "INTERNEL SERVER ERROR", err: error });
  }
};

export const personnelDetails= async (req, res) => {
  res.status(200).json(req.personnel);
};

//genrated web token
const generateWebToken = (id,role) => {
  return jwt.sign({ id,role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

