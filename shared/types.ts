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

type Classroom = {
  name: string;
  id: string;
};

export {
  IProjectFile,
  IProject,
  Classroom
};