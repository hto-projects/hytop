import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  allUsersAndTheirProjects,
  getProjectsForUser as getProjectsForUserName
} from "../controllers/userController";
import { getUserProjects } from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", registerUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);

router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.get("/:userId/projects", protect, getUserProjects);
router.get("/all-users-projects", protect, allUsersAndTheirProjects);
router.get("/projects-by-name/:userName", protect, getProjectsForUserName);

export default router;
