import express from "express";
import Notification from "../schema/Notification.js";
import User from "../schema/Users.js";

//get all notification (user)
export const getAllNotifications = async (req, res) => {
    try {
        const id=req.auth.userId
        const notifications = await Notification.find({userId:id}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};