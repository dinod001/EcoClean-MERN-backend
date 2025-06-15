import jwt from "jsonwebtoken";
import Personnel from "../schema/Personnel.js";

export const personnelAuthentication = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.personnel = await Personnel.findById(decoded.id).select("-password");
      return next();
    } catch (error) {
      console.error("Verification failed: ", error.message);
      res.status(401).json({ message: "Not Authorized, token failed" });
    }
  }
  res.status(401).json({ message: "Not Authorized, token failed" });
};
