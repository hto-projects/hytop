interface IProjectFile {
  fileName: string;
  fileContent: string;
}

interface IProject {
  projectName: string;
  projectDescription: string;
  projectOwnerId: string;
  projectId: string;
  projectStatus: string;
  projectFiles: IProjectFile[];
  updatedAt?: number;
  copiedFromId?: string;
  projectType?: "python" | "html";
}

interface IProjectSimple {
  projectName: string;
  projectDescription: string;
  projectId: string;
  updatedAt?: number;
}

interface IUser {
  name: string;
  email: string;
  password: string;
  hasTemporaryPassword?: boolean;
  username: string;
  userId: string;
  admin: boolean;
}

interface IUserView {
  username: string;
  name: string;
  email: string;
  admin: boolean;
  projects: IProjectSimple[];
}

interface ICourseOffering {
  offeringId: string; // uuid
  programName: string; // e.g., "Hy-Tech Club"
  programIteration: string; // e.g., "Fall 2026"
  courseName: string; // e.g., "Web 101"
  courseSection: string; // if there are multiple classrooms / nights
  courseStatus: "open" | "closed"; // past courses will be closed
}

type CourseParticipantStatus = "unconfirmed" | "student" | "instructor";
enum UserTypeForCourse {
  Instructor = "instructor",
  Enrollee = "enrollee",
  Student = "student",
  User = "user",
  Anonymous = "anonymous"
}
interface IEnrollment {
  enrollmentId: string; // uuid
  courseOfferingId: string; // foreign key to ICourseOffering
  userId: string; // foreign key to User
  participantRole: CourseParticipantStatus;
}

interface IParticipant {
  participantName: string;
  participantUsername: string;
  participantUserId: string;
  participantStatus: CourseParticipantStatus;
}

type Classroom = {
  name: string;
  id: string;
  participants: string[];
};

export {
  IProjectFile,
  IProject,
  IProjectSimple,
  IUserView,
  IUser,
  ICourseOffering,
  CourseParticipantStatus,
  IEnrollment,
  IParticipant,
  UserTypeForCourse,
  Classroom
};
