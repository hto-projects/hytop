import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../../shared/types";

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    hasTemporaryPassword: {
      type: Boolean,
      required: false,
      default: false
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    userId: {
      type: String,
      required: true,
      unique: true
    },
    admin: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
