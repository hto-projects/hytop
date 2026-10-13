import mongoose from "mongoose";

const PasswordChaseSubmissionSchema = new mongoose.Schema(
  {
    gameCode: {
      type: String,
      required: true,
    },
    gamePassword: {
      type: String,
      required: true
    },
    gameTeam: {
      type: String,
      required: true
    }
  }
);

const PasswordChaseSubmission = mongoose.model("PasswordChaseSubmission", PasswordChaseSubmissionSchema);

export default PasswordChaseSubmission;
