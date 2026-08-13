import mongoose from "mongoose";
import { IEnrollment } from "../../shared/types";

const enrollmentSchema = new mongoose.Schema<IEnrollment>(
  {
    enrollmentId: {
      type: String,
      required: true,
      unique: true
    },
    courseOfferingId: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    participantRole: {
      type: String,
      required: true,
      enum: ["unconfirmed", "student", "instructor"],
      default: "unconfirmed"
    },
  },
  {
    timestamps: true
  }
);

const Enrollment = mongoose.model<IEnrollment>("Enrollment", enrollmentSchema);

export default Enrollment;
