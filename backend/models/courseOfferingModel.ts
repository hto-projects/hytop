import mongoose from "mongoose";
import { ICourseOffering } from "../../shared/types";

const courseOfferingSchema = new mongoose.Schema<ICourseOffering>(
  {
    offeringId: {
      type: String,
      required: true,
      unique: true
    },
    programName: {
      type: String,
      required: true
    },
    programIteration: {
      type: String,
      required: true
    },
    courseName: {
      type: String,
      required: true
    },
    courseSection: {
      type: String,
      required: false
    },
    courseStatus: {
      type: String,
      required: true,
      enum: ["open", "closed"],
      default: "open"
    },
  },
  {
    timestamps: true
  }
);

const CourseOffering = mongoose.model<ICourseOffering>("CourseOffering", courseOfferingSchema);

export default CourseOffering;
