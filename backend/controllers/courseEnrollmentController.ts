import asyncHandler from "express-async-handler";
import CourseOffering from "../models/courseOfferingModel";
import { v4 as uuidv4 } from "uuid";
import { CourseParticipantStatus, ICourseOffering, IEnrollment, IParticipant, UserTypeForCourse } from "../../shared/types";
import Enrollment from "../models/enrollmentModel";
import User from "../models/userModel";
import { Document } from "mongoose";

const checkUserInstructsCourse: (user: {userId: string, admin: boolean}, offeringId: string) => Promise<boolean> = async (user, offeringId) => {
  if (user.admin) {
    return true;
  }

  const enrollment: IEnrollment | null = await Enrollment.findOne({ userId: user.userId, courseOfferingId: offeringId, participantRole: "instructor"});
  return !!enrollment;
}

const createCourseOffering = asyncHandler(async (req: any, res) => {
  const { programName, programIteration, courseName, courseSection } = req.body;
  const foundCourseOffering = await CourseOffering.findOne({ programName, programIteration, courseName, courseSection});
  if (foundCourseOffering) {
    res.status(400);
    throw new Error(":( course already exists :(")
  }

  const newCourseOfferingId: string = uuidv4();
  const courseOfferingToCreate: ICourseOffering = {
    programName,
    programIteration,
    courseName,
    courseSection,
    offeringId: newCourseOfferingId,
    courseStatus: "open"
  }

  try {
    await CourseOffering.create(courseOfferingToCreate);
    res.status(201).json({
      message: `Course created!`,
      offeringId: newCourseOfferingId
    });
  } catch (error) {
    res.status(400);
    throw new Error(`Error creating course offering: ${error}`);
  }
});

const enrollMe = asyncHandler(async (req: any, res) => {
  const { offeringId } = req.body;
  const meId = req.user.userId;
  const newEnrollmentId: string = uuidv4();

  const myEnrollment: IEnrollment = {
    enrollmentId: newEnrollmentId,
    courseOfferingId: offeringId,
    userId: meId,
    participantRole: "unconfirmed"
  }

  try {
    await Enrollment.create(myEnrollment);
    res.status(201).json({
      message: `Enrollment submit!`,
      enrollmentId: newEnrollmentId
    });
  } catch (error) {
    res.status(400);
    throw new Error(`Error submitting enrollment: ${error}`);
  }
});

const enrollSomeone = asyncHandler(async (req: any, res) => {
  const { offeringId, username, forInstructor } = req.body;
  const userInstructsCourse = await checkUserInstructsCourse(req.user, offeringId);
  if (!userInstructsCourse) {
    res.status(401);
    throw new Error("Not authorized, instructors only");
  }

  const user = await User.findOne({ username });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  
  const userId = user.userId;
  const updatedRole: CourseParticipantStatus = forInstructor ? "instructor" : "student";
  const existingEnrollment: IEnrollment & Document = await Enrollment.findOne({ courseOfferingId: offeringId, userId });
  if (existingEnrollment) {
    existingEnrollment.participantRole = updatedRole;
    try {
      existingEnrollment.save();
      res.status(201).json({
        message: `${username} enrolled!`,
        enrollmentId: existingEnrollment.enrollmentId
      });
    } catch (error) {
      res.status(400);
      throw new Error(`Error submitting enrollment: ${error}`);
    }

    return;
  }

  const newEnrollmentId: string = uuidv4();
  const myEnrollment: IEnrollment = {
    enrollmentId: newEnrollmentId,
    courseOfferingId: offeringId,
    userId: userId,
    participantRole: forInstructor ? "instructor" : "student"
  }

  try {
    await Enrollment.create(myEnrollment);
    res.status(201).json({
      message: `${username} enrolled!`,
      enrollmentId: newEnrollmentId
    });
  } catch (error) {
    res.status(400);
    throw new Error(`Error submitting enrollment: ${error}`);
  }
});

const confirmEnrollment = asyncHandler(async (req: any, res) => {
  const { offeringId, userId, forInstructor } = req.body;
  const userInstructsCourse = await checkUserInstructsCourse(req.user, offeringId);
  if (!userInstructsCourse) {
    res.status(401);
    throw new Error("Not authorized, instructors only");
  }

  try {
    const updated: IEnrollment & Document = await Enrollment.findOne({courseOfferingId: offeringId, userId});
    
    updated.participantRole = forInstructor ? "instructor" : "student";
    updated.save();
    res.status(200);
    res.send({message: "Enrollment Confirmed!"});
  } catch (error) {
    throw new Error("Error updating enrollment status")
  }
});

const updateEnrollment = asyncHandler(async (req: any, res) => {
  const { offeringId, userId, newStatus } = req.body;
  const userInstructsCourse = await checkUserInstructsCourse(req.user, offeringId);
  if (!userInstructsCourse) {
    res.status(401);
    throw new Error("Not authorized, instructors only");
  }

  try {
    const existingEnrollment: IEnrollment & Document = await Enrollment.findOne({courseOfferingId: offeringId, userId});
    if (!existingEnrollment) {
      res.status(404);
      throw new Error("Enrollment not found");
    }

    if (newStatus === "delete") {
      existingEnrollment.deleteOne();
      res.status(200).send({message: "Enrollment removed!"});
      return;
    }
    
    existingEnrollment.participantRole = newStatus;
    existingEnrollment.save();
    res.status(200);
    res.send({message: "Enrollment Updated!"});
  } catch (error) {
    throw new Error("Error updating enrollment status")
  }
});

const getCourses = asyncHandler(async (req: any, res) => {
  try {
    const courses: ICourseOffering[] =  await CourseOffering.find({ courseStatus: "open" });
    const coursesWithUserTypes: Array<ICourseOffering & { userType: UserTypeForCourse }> = [];
    for (let i = 0; i < courses.length; i++) {
      const course: ICourseOffering = courses[i];
      let courseUserType: UserTypeForCourse;
      
      const enrollmentForUser: IEnrollment = await Enrollment.findOne({ userId: req.user.userId, courseOfferingId: course.offeringId });
      if (req.user.admin) {
        courseUserType = UserTypeForCourse.Instructor;
      } else if (!enrollmentForUser) {
        courseUserType = UserTypeForCourse.User
      } else if (enrollmentForUser.participantRole === "instructor") {
        courseUserType = UserTypeForCourse.Instructor;
      } else if (enrollmentForUser.participantRole === "student") {
        courseUserType = UserTypeForCourse.Student;
      } else if (enrollmentForUser.participantRole === "unconfirmed") {
        courseUserType = UserTypeForCourse.Enrollee;
      }

      coursesWithUserTypes.push({
        userType: courseUserType,
        programName: course.programName,
        programIteration: course.programIteration,
        offeringId: course.offeringId,
        courseName: course.courseName,
        courseSection: course.courseSection,
        courseStatus: course.courseStatus
      });
    }

    res.status(200);
    res.json(coursesWithUserTypes);
  } catch (error) {
    throw new Error("error getting courses");
  }
});

const getCourseOffering = asyncHandler(async (req: any, res) => {
  const offeringId = req.params.offeringId;
  const userInstructsCourse = await checkUserInstructsCourse(req.user, offeringId);
  if (!userInstructsCourse) {
    res.status(401);
    throw new Error("Not authorized, instructors only");
  }
  try {
    const course: ICourseOffering =  await CourseOffering.findOne({ offeringId });
    res.status(200);
    res.json(course);
  } catch (error) {
    throw new Error("error getting course");
  }
});

const getCourseParticipants = asyncHandler(async (req: any, res) => {
  const offeringId = req.params.offeringId;
  const userInstructsCourse = await checkUserInstructsCourse(req.user, offeringId);
  if (!userInstructsCourse) {
    res.status(401);
    throw new Error("Not authorized, instructors only");
  }
  try {
    const enrollmentsForCourse: IEnrollment[] = await Enrollment.find({ courseOfferingId: offeringId });
    const participants: IParticipant[] = [];
    for (let i = 0; i < enrollmentsForCourse.length; i++) {
      const e: IEnrollment = enrollmentsForCourse[i];
      const user: any = await User.findOne({ userId: e.userId});
      participants.push({
        participantName: user.name,
        participantStatus: e.participantRole,
        participantUserId: user.userId,
        participantUsername: user.username
      });
    }
    
    res.status(200);
    res.json(participants);
  } catch (error) {
    throw new Error("Error getting course participants");
  }
});

export {
  createCourseOffering,
  enrollMe,
  enrollSomeone,
  confirmEnrollment,
  updateEnrollment,
  getCourses,
  getCourseOffering,
  getCourseParticipants,
};