import mongoose from "mongoose";
import { ISubmission } from "../../shared/types";

const submissionSchema = new mongoose.Schema<ISubmission>(
  {
    submissionText: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true
    },
    submissionId: {
      type: String,
      required: true,
      unique: true
    },
  },
  {
    timestamps: true
  }
);

const Submission = mongoose.model<ISubmission>("Project", submissionSchema);

export default Submission;
