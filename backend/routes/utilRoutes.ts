import express from "express";
import {
  addImpression,
  getImpressions
} from "../controllers/utilController";
import { adminProtect } from "../middleware/authMiddleware";
import { ADD_IMPRESSION, GET_IMPRESSIONS } from "../../shared/utilApiPaths";

const router = express.Router();

router.post(`/${ADD_IMPRESSION}`, addImpression);
router.post(`/${GET_IMPRESSIONS}`, adminProtect, getImpressions);

export default router;
