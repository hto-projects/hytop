import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel";

const protect = asyncHandler(async (req: any, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const protectAllowAnon = asyncHandler(async (req: any, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = { _id: decoded.userId };

      next();
    } catch (error) {
      console.error("Invalid token in protectAllowAnon:", error);
      res.cookie("jwt", "", {
        httpOnly: false,
        secure: true,
        sameSite: false,
        expires: new Date(0)
      });
      req.user = null;
      next();
    }
  } else {
    next();
  }
});

export { protect, protectAllowAnon };
