import mongoose from "mongoose";
import { IProject } from "../../shared/types";

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
      unique: true
    },
    projectDescription: {
      type: String,
      required: false
    },
    projectOwnerId: {
      type: String,
      required: true
    },
    projectId: {
      type: String,
      required: true
    },
    projectStatus: {
      type: String,
      required: true,
      enum: ["public", "private", "deleted", "frozen"],
      default: "public"
    },
    projectFiles: [
      {
        fileName: {
          type: String,
          required: true
        },
        fileContent: {
          type: String,
          required: false
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

const Project = mongoose.model<IProject>("Project", projectSchema);

export default Project;
