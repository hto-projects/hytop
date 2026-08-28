import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  allUsersAndTheirProjects,
  resetPassword,
  instructorResetPassword,
  changeAdminStatus,
  getUserView,
  getProjectsForUser as getProjectsForUserName,
  getUserProfileInfo,
  randPass,
  meInfo
} from "../controllers/userController";
import { protect, adminProtect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", registerUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router.post("/reset-password", adminProtect, resetPassword);
router.post("/instructor-reset-password", protect, instructorResetPassword);
router.post("/change-admin-status", adminProtect, changeAdminStatus);

router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.get("/:userId/profile-info", protect, getUserProfileInfo);
router.get("/all-users-projects", protect, allUsersAndTheirProjects);
router.get("/projects-by-name/:userName", protect, getProjectsForUserName);
router.get("/view/:username", getUserView);
router.get("/rand-pass", randPass);
router.get("/me-info", meInfo);

export default router;
