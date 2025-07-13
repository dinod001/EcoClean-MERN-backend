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

//get all noitifcations
export const getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

//update notification
export const updateNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedNotification = await Notification.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedNotification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        res.status(200).json({ success: true, message: "Notification updated", data: updatedNotification });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//delete notification
export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Notification.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        res.status(200).json({ success: true, message: "Notification deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/// Create notification
export const createNotification = async (req, res) => {
    try {
        const { userIds, title, message, type } = req.body;

        // Input validation
        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({ success: false, message: "userIds must be a non-empty array" });
        }
        if (!title || !message) {
            return res.status(400).json({ success: false, message: "title and message are required" });
        }

        const notifications = [];

        for (const userId of userIds) {
            const newNotification = await Notification.create({
                userId,
                title,
                message,
                type: type || "General",
                status: "Unread"
            });

            notifications.push(newNotification);
        }

        if (notifications.length === 0) {
            return res.status(404).json({ success: false, message: "No notifications created." });
        }

        res.status(201).json({
            success: true,
            message: `Notification sent to ${notifications.length} user(s)`,
            data: notifications
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


