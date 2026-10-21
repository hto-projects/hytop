import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";
import Impression from "../models/impressionModel";

const addImpression = asyncHandler(async (req, res) => {
  const { impressionValue } = req.body;

  const impressionId: string = uuidv4();

  try {
    const impression = await Impression.create({
      impressionId,
      impressionValue
    });

    if (impression) {
      res.json({message: "Impression Added!" });
    } else {
      throw new Error("Error adding impression");
    }
  } catch {
    res.status(401);
    throw new Error("Error adding impression");
  }
});

const getImpressions = asyncHandler(async (req, res) => {
  const impressions = await Impression.find();
  res.json(impressions);
});

export { addImpression, getImpressions };
