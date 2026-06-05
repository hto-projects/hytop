import mongoose from "mongoose";

const HfHighScoreSchema = new mongoose.Schema(
  {
    initials: {
      type: String,
      required: true,
      unique: true
    },
    score: {
      type: Number,
      required: true
    },
    sessionName: {
      type: String,
      required: true
    }
  }
);

const HfHighScore = mongoose.model("HfHighScore", HfHighScoreSchema);

export default HfHighScore;
