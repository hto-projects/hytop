import express from "express";
import { getDogs, getCats, getBirds } from "../controllers/fakeApiController";

const router = express.Router();

router.get("/dogs", getDogs);
router.get("/cats", getCats);
router.get("/birds", getBirds);

export default router;
