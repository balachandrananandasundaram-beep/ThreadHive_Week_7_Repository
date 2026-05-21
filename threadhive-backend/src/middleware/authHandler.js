import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import User from "../models/User.js";
import { createAppError } from "../utils/createAppError.js";

const authHandler = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return next(createAppError("No token provided, authorization denied.", 401));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return next(createAppError("Token is not valid.", 401));
  }

  // FIXED: decoded.id (lowercase)
  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    return next(createAppError("User not found.", 401));
  }

  req.user = { userId: user._id };

  next();
};

export default authHandler;

