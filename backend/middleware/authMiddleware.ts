import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel";
import { IEnrollment } from "../../shared/types";
import Enrollment from "../models/enrollmentModel";

const checkUserInstructsCourse: (user: {userId: string, admin: boolean}, offeringId: string) => Promise<boolean> = async (user, offeringId) => {
  if (user.admin) {
    return true;
  }

  const enrollment: IEnrollment | null = await Enrollment.findOne({ userId: user.userId, courseOfferingId: offeringId, participantRole: "instructor"});
  return !!enrollment;
}

const protect = asyncHandler(async (req: any, res, next) => {
  const token = req.cookies.jwt;

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

const adminProtect = asyncHandler(async (req: any, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select("-password");

      if (!req.user || !req.user.admin) {
        res.status(401);
        throw new Error("Not authorized, admin only");
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error(error.message || "Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const instructorProtect = asyncHandler(async (req: any, res, next) => {
  let offeringId;
  if (req.params && req.params.offeringId) {
    offeringId = req.params.offeringId;
  } else if (req.body && req.body.offeringId) {
    offeringId = req.body.offeringId;
  } else {
    res.status(500);
    throw new Error("offeringId is required");
  }
  if (!req.user) {
    res.status(500);
    throw new Error("user is required");
  }
  const userInstructsCourse = await checkUserInstructsCourse(req.user, offeringId);
  if (!userInstructsCourse) {
    res.status(401);
    throw new Error("Not authorized, instructors only");
  }
});

const protectAllowAnon = asyncHandler(async (req: any, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = { _id: decoded.userId };

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    next();
  }
});

export { protect, protectAllowAnon, adminProtect };
