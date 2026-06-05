import express from "express";
import { getDogs, getCats, getBirds, sendHackyformerHighScore, getHackyformerHighScores } from "../controllers/fakeApiController";

const router = express.Router();
router.get("/dogs", getDogs);
router.get("/cats", getCats);
router.get("/birds", getBirds);
router.get("/hackyformer/high-scores", getHackyformerHighScores);
router.post("/hackyformer/high-scores", sendHackyformerHighScore);

export default router;
