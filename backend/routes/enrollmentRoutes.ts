import express from "express";
import {
  createCourseOffering,
  enrollMe,
  enrollSomeone,
  confirmEnrollment,
  getCourses,
  getCourseOffering,
  getCourseParticipants,
  updateEnrollment
} from "../controllers/courseEnrollmentController";
import { protect, adminProtect } from "../middleware/authMiddleware";
import { CONFIRM_ENROLLMENT, UPDATE_ENROLLMENT, COURSE, COURSE_PARTICIPANTS, COURSES, CREATE_COURSE_OFFERING, ENROLL_ME, ENROLL_SOMEONE } from "../../shared/enrollmentApiPaths";

const router = express.Router();

router.post(`/${CREATE_COURSE_OFFERING}`, adminProtect, createCourseOffering);
router.post(`/${ENROLL_ME}`, protect, enrollMe);
router.post(`/${ENROLL_SOMEONE}`, protect, enrollSomeone);
router.post(`/${CONFIRM_ENROLLMENT}`, protect, confirmEnrollment);
router.post(`/${UPDATE_ENROLLMENT}`, protect, updateEnrollment);

router.get(`/${COURSES}`, protect, getCourses);
router.get(`/${COURSE}/:offeringId`, protect, getCourseOffering);
router.get(`/${COURSE_PARTICIPANTS}/:offeringId`, protect, getCourseParticipants);

export default router;


