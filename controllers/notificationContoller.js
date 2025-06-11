import express from "express";
import Notification from "../schema/Notification.js";
import User from "../schema/Users.js";

//get notification by id
export const getNotificationById = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findById(id);
        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }
        return res.status(200).json({ success: true, data: notification });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

//get all notification
export const getAllNotifications = async (req, res) => {
    try {
        const id=req.auth.userId
        const notifications = await Notification.find({userId:id}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


