import express from "express";
import {
  createProject,
  updateProject,
  copyProject,
  getProject,
  checkOwnership,
  changeProjectName,
  changeProjectDescription,
  findProjectById,
  getProjectId,
  getProjectDescription
} from "../controllers/projectController";
import { protectAllowAnon } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/create", createProject);
router.post("/update", protectAllowAnon, updateProject);
router.post("/copy", copyProject);
router.get("/find/:projectId", findProjectById);
router.get("/get-id/:projectName", getProjectId);
router.post("/change-name/:projectId", protectAllowAnon, changeProjectName);
router.post(
  "/change-description/:projectId",
  protectAllowAnon,
  changeProjectDescription
);
router.get("/get-description/:projectId", getProjectDescription);
router.get("/get/:projectName", getProject);
router.get("/check-ownership/:projectName", protectAllowAnon, checkOwnership);

export default router;
