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

interface IUserView {
  username: string,
  name: string,
  email: string,
  admin: boolean;
  projects: IProjectSimple[];
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
  Classroom
};