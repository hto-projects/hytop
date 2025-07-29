export interface IProjectFile {
  fileName: string;
  fileContent: string;
}

export interface IProject {
  projectName: string;
  projectDescription: string;
  projectOwnerId: string;
  projectId: string;
  projectStatus: string;
  projectFiles: IProjectFile[];
  updatedAt?: number;
}
