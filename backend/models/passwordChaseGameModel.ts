import mongoose from "mongoose";

const PasswordChaseGameSchema = new mongoose.Schema(
  {
    gameCode: {
      type: String,
      required: true,
      unique: true
    },
    gamePassword: {
      type: String,
      required: true
    },
  }
);

const PasswordChaseGame = mongoose.model("PasswordChaseGame", PasswordChaseGameSchema);

export default PasswordChaseGame;
