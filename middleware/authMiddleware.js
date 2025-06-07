import { clerkClient } from "@clerk/express";

// Middleware to authenticate logged-in users
export const authenticateUser = async (req, res, next) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access: No user ID found.",
      });
    }

    const user = await clerkClient.users.getUser(req.auth.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access: User not found.",
      });
    }

    //attach user to req for downstream use
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};
