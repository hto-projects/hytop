import asyncHandler from "express-async-handler";
import User from "../models/userModel";
import generateToken from "../utils/generateToken";
import { v4 as uuidv4 } from "uuid";
import friendlyWords from "friendly-words";
import Project from "../models/projectModel";
import {
  ICourseOffering,
  IEnrollment,
  IProjectSimple,
  IUser,
  IUserView,
  UserTypeForCourse
} from "../../shared/types";
import { Document } from "mongoose";
import Enrollment from "../models/enrollmentModel";
import CourseOffering from "../models/courseOfferingModel";

const checkInstructorInstructsStudent = async (instructorUserId, studentUserId) => {
  const instructorCourses: IEnrollment[] = await Enrollment.find({ userId: instructorUserId, participantRole: "instructor" });
  const instructorCourseOfferingIds = instructorCourses.map((e: IEnrollment) => e.courseOfferingId);
  const studentCourseWithInstructor: IEnrollment = await Enrollment.findOne({ userId: studentUserId, courseOfferingId: { $in: instructorCourseOfferingIds}});
  return !!studentCourseWithInstructor;
}

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user: any = await User.findOne({ username });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      admin: user.admin
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, username, password } = req.body;

  const userEmailExists = await User.findOne({ email });

  const userNameExists = await User.findOne({ username });

  if (userEmailExists) {
    res.status(400);
    throw new Error("User with Email already exists");
  }

  if (userNameExists) {
    res.status(400);
    throw new Error("UserName already exists");
  }

  const userId: string = uuidv4();

  const user = await User.create({
    name,
    email,
    admin: false,
    username,
    userId,
    password
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      admin: user.admin
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0)
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req: any, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      admin: user.admin,
      userId: user.userId,
      hasTemporaryPassword: user.hasTemporaryPassword
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req: any, res) => {
  const user: IUser & Document = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
      user.hasTemporaryPassword = false;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const getUserProfileInfo = asyncHandler(async (req: any, res) => {
  try {
    const user: IUser & Document = req.user;
    const projects = await Project.find({ projectOwnerId: user._id });
    const enrollmentsAsStudent: IEnrollment[] = await Enrollment.find({
      userId: user.userId,
      participantRole: UserTypeForCourse.Student
    });
    const enrollmentsAsInstructor: IEnrollment[] = await Enrollment.find({
      userId: user.userId,
      participantRole: UserTypeForCourse.Instructor
    });
    const coursesAsStudent: ICourseOffering[] = await CourseOffering.find({
      offeringId: { $in: enrollmentsAsStudent.map((e) => e.courseOfferingId) }
    });
    const coursesAsInstructor: ICourseOffering[] = await CourseOffering.find({
      offeringId: { $in: enrollmentsAsInstructor.map((e) => e.courseOfferingId) }
    });
    const courses: Array<ICourseOffering & { userType: UserTypeForCourse }> =
    [...coursesAsStudent.map((c: ICourseOffering) => ({
      userType: UserTypeForCourse.Student,
      offeringId: c.offeringId,
      courseName: c.courseName,
      courseSection: c.courseSection,
      courseStatus: c.courseStatus,
      programName: c.programName,
      programIteration: c.programIteration
      })),
      ...coursesAsInstructor.map((c: ICourseOffering) => ({
        userType: UserTypeForCourse.Instructor,
        offeringId: c.offeringId,
        courseName: c.courseName,
        courseSection: c.courseSection,
        courseStatus: c.courseStatus,
        programName: c.programName,
        programIteration: c.programIteration
    }))];
    res.json({
      hasTemporaryPassword: user.hasTemporaryPassword,
      projects,
      courses
    });
  } catch (err) {
    throw new Error("Error finding user profile info");
  }
});

const allUsersAndTheirProjects = asyncHandler(async (req, res) => {
  const users = await User.find({});
  const usersWithProjects = [];
  for (const user of users) {
    const projects = await Project.find({ projectOwnerId: user._id });
    usersWithProjects.push({
      user,
      projects
    });
  }

  res.json(usersWithProjects);
});

const getProjectsForUser = asyncHandler(async (req, res) => {
  const userName = req.params.userName;
  const user = await User.findOne({ username: userName });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  const projects = await Project.find({ projectOwnerId: user._id });
  res.json(
    projects.map((p) => `https://hytop.onrender.com/e/${p.projectName}`)
  );
});

const randomFromArr: (arr: string[]) => string = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const generateRandomPassword: () => string = () => {
  const p1: string[] = [
    ...randomFromArr(friendlyWords.predicates.filter((w) => w.length <= 5))
  ];
  p1[0] = p1[0].toUpperCase();
  const p2: string[] = [
    ...randomFromArr(friendlyWords.objects.filter((w) => w.length <= 5))
  ];
  p2[0] = p2[0].toUpperCase();
  return p1.join("") + p2.join("") + randomFromArr("1234567890".split(""));
};

const randPass = asyncHandler(async (req, res) => {
  res.json(generateRandomPassword());
});

const instructorResetPassword = asyncHandler(async (req: any, res) => {
  console.log("hey");
  const { userId } = req.body;
  const instructorInstructsStudent = await checkInstructorInstructsStudent(req.user.userId, userId);
  if (!instructorInstructsStudent) {
    res.status(401);
    throw new Error("Not authorized to reset this student's password");
  }
  const studentUser: IUser & Document = await User.findOne({ userId });
  if (!studentUser) {
    res.status(404);
    throw new Error("User not found");
  }

  const newGenPass = generateRandomPassword();
  studentUser.password = newGenPass;
  studentUser.hasTemporaryPassword = true;

  try {
    await studentUser.save();

    // return new password
    res.json({
      newPassword: newGenPass,
      message: "Password reset successfully"
    });
  } catch (err) {
    throw new Error(`error resetting password: ${err}`);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username: username });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const newGenPass = password ? password : generateRandomPassword();
  user.password = newGenPass;
  user.hasTemporaryPassword = true;

  try {
    await user.save();

    // return new password
    res.json({
      username,
      newPassword: newGenPass,
      message: "Password reset successfully"
    });
  } catch (err) {
    throw new Error(`error resetting password: ${err}`);
  }
});

const changeAdminStatus = asyncHandler(async (req, res) => {
  const { username, isAdmin }: { username: string; isAdmin: boolean } =
    req.body;
  const user = await User.findOne({ username });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.admin = isAdmin;
  await user.save();

  res.json({
    username,
    isAdmin
  });
});

const getUserView = asyncHandler(async (req, res) => {
  const username = req.params.username;
  if (!username) {
    res.status(400);
    throw new Error("Username is required");
  }

  const user = await User.findOne({ username });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const userProjects: IProjectSimple[] = await Project.find(
    { projectOwnerId: user._id },
    ["projectName", "projectDescription", "projectId", "updatedAt"]
  );
  const userView: IUserView = {
    username: user.username,
    name: user.name,
    email: user.email,
    admin: user.admin,
    projects: userProjects
  };

  res.json(userView);
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUserProfileInfo,
  allUsersAndTheirProjects,
  getProjectsForUser,
  resetPassword,
  instructorResetPassword,
  changeAdminStatus,
  getUserView,
  randPass
};
