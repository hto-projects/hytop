import mongoose from "mongoose";
import { IImpression, ImpressionType } from "../../shared/types";

const impressionSchema = new mongoose.Schema<IImpression>(
  {
    impressionId: {
      type: String,
      required: true,
      unique: true
    },
    impressionValue: {
      type: String,
      enum: ImpressionType,
      required: true
    },
  },
  {
    timestamps: true
  }
);

const Enrollment = mongoose.model<IImpression>("Enrollment", impressionSchema);

export default Enrollment;
