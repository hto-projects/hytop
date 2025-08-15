import asyncHandler from "express-async-handler";
import Project from "../models/projectModel";
import { v4 as uuidv4 } from "uuid";
import generateToken from "../utils/generateToken";
import fs from "fs";
import { IProject, IProjectFile } from "../../shared/types";
import { userInfo } from "os";
import slugify from "slugify";
const findProject = async (projectName: string): Promise<IProject> => {
  let starterExists: boolean = false;
  try {
    await fs.promises.access(
      `./backend/starters/${projectName}`,
      fs.constants.R_OK
    );
    starterExists = true;
  } catch (e) {
    starterExists = false;
  }

  if (starterExists) {
    try {
      const fileNames: string[] = await fs.promises.readdir(
        `./backend/starters/${projectName}`
      );
      const projectFiles: IProjectFile[] = [];
      for (const fileName of fileNames) {
        const fileContent: string = await fs.promises.readFile(
          `./backend/starters/${projectName}/${fileName}`,
          "utf-8"
        );
        projectFiles.push({
          fileName: fileName,
          fileContent: fileContent
        });
      }

      const starterProject: IProject = {
        projectName: projectName,
        projectDescription: "Starter project",
        projectFiles: projectFiles,
        projectId: projectName,
        projectStatus: "frozen",
        projectOwnerId: "0"
      };

      return starterProject;
    } catch (e) {
      throw new Error(
        `:( project with name ${projectName} could not be found in starter projects :(`
      );
    }
  } else {
    try {
      const existingProject: IProject = await Project.findOne({
        projectName: projectName
      });

      return existingProject;
    } catch (e) {
      throw new Error(
        `:( project with name ${projectName} could not be found in the database :(`
      );
    }
  }
};

const getUserId = (req, res) => {
  if (req.user) {
    return req.user._id;
  }

  let token = req.cookies.jwt;
  let userId;
  if (token) {
    try {
      const decoded = require("jsonwebtoken").verify(
        token,
        process.env.JWT_SECRET
      );
      userId = decoded.userId;
    } catch {
      userId = require("uuid").v4();
      generateToken(res, userId, true);
    }
  } else {
    userId = require("uuid").v4();
    generateToken(res, userId, true);
  }
  return userId;
};

// @desc    Create a new project
// @route   POST /api/projects/create
// @access  Public
const createProject = asyncHandler(async (req: any, res) => {
  const userId = getUserId(req, res);

  const { projectName, projectDescription } = req.body;

  const foundProject: IProject = await findProject(projectName);
  if (foundProject) {
    res.status(400);
    throw new Error(`:( project with name ${projectName} already exists :(`);
  }

  const newProjectId: string = uuidv4();

  const starterProjectFiles: IProjectFile[] = [
    {
      fileName: "index.html",
      fileContent: ""
    }
  ];

  const projectToCreate: IProject = {
    projectName,
    projectDescription,
    projectFiles: starterProjectFiles,
    projectId: newProjectId,
    projectOwnerId: userId,
    projectStatus: "public"
  };

  try {
    await Project.create(projectToCreate);

    res.status(201).json({
      message: `Project "${projectName}" created!`,
      projectId: newProjectId,
      projectName: projectName,
      projectOwnerId: userId
    });
  } catch (error) {
    res.status(400);
    throw new Error(`Error creating project: ${error}`);
  }
});

const removeTrailingDigits = (text: string) => {
  return text.replace(/\d+$/, "");
};

const generateNewProjectName = async (
  projectName: string,
  count: number = 0
): Promise<string> => {
  let mult = 100;

  if (count > 10) {
    mult = 1000;
  }

  if (count > 20) {
    mult = 10000;
  }

  if (count > 30) {
    throw new Error("Too many attempts to generate a new project name");
  }

  const randomSuffix: number = Math.floor(Math.random() * mult);
  const newName: string = `${projectName}${randomSuffix}`;
  const existingProject: IProject = await findProject(newName);
  if (existingProject) {
    return generateNewProjectName(projectName, count + 1);
  } else {
    return newName;
  }
};

// @desc    Create a copy of an existing project
// @route   POST /api/projects/copy
// @access  Public
const copyProject = asyncHandler(async (req: any, res) => {
  const userId = getUserId(req, res);

  const { projectName } = req.body;
  let existingProject: IProject;

  try {
    existingProject = await findProject(projectName);
  } catch (e) {
    res.status(400);
    throw new Error(":( project not found :(");
  }

  const newProjectId: string = uuidv4();

  let newProjectName: string;

  try {
    newProjectName = await generateNewProjectName(
      removeTrailingDigits(projectName)
    );
  } catch (error) {
    res.status(400);
    throw new Error(`Error generating new project name: ${error}`);
  }

  try {
    const newProjectToCreate: IProject = {
      projectName: newProjectName,
      projectOwnerId: userId,
      projectDescription: existingProject.projectDescription,
      projectFiles: existingProject.projectFiles,
      projectStatus: "public",
      projectId: newProjectId
    };

    const createdProject = await Project.create(newProjectToCreate);

    res.status(201).json({
      message: `Project "${createdProject.projectName}" created!`,
      projectId: createdProject.projectId,
      projectName: createdProject.projectName,
      userId: createdProject.projectOwnerId
    });
  } catch (error) {
    res.status(400);
    throw new Error(`Error creating project: ${error}`);
  }
});

// @desc    Check if the current user owns this project
// @route   POST /api/projects/check-ownership/:projectName
// @access  NOT Public
const checkOwnership = asyncHandler(async (req: any, res) => {
  const user = req.user;
  const projectName: string = req.params.projectName;

  const existingProject: IProject = await findProject(projectName);
  if (!existingProject) {
    res.status(400);
    throw new Error(":( project not found :(");
  }

  if (existingProject.projectOwnerId !== user._id) {
    res.json({ isOwner: false });
  } else {
    res.json({ isOwner: true });
  }
});

const findProjectById = async (projectId: string): Promise<IProject> => {
  let starterExists: boolean = false;
  try {
    await fs.promises.access(
      `./backend/starters/${projectId}`,
      fs.constants.R_OK
    );
    starterExists = true;
  } catch (e) {
    starterExists = false;
  }

  if (starterExists) {
    try {
      const fileNames: string[] = await fs.promises.readdir(
        `./backend/starters/${projectId}`
      );
      const projectFiles: IProjectFile[] = [];
      for (const fileName of fileNames) {
        const fileContent: string = await fs.promises.readFile(
          `./backend/starters/${projectId}/${fileName}`,
          "utf-8"
        );
        projectFiles.push({
          fileName: fileName,
          fileContent: fileContent
        });
      }
      const starterProject: IProject = {
        projectName: projectId,
        projectDescription: "Starter project",
        projectFiles: projectFiles,
        projectId: projectId,
        projectStatus: "frozen",
        projectOwnerId: "0"
      };
      console.log("Starter project created:", starterProject);

      return starterProject;
    } catch (e) {
      throw new Error(
        `:( project with id ${projectId} could not be found in starter projects :(`
      );
    }
  } else {
    try {
      const existingProject: IProject = await Project.findOne({
        projectId: projectId
      });
      if (!existingProject) {
        throw new Error(
          `:( project with id ${projectId} could not be found in the database :(`
        );
      }
      return existingProject;
    } catch (e) {
      throw new Error(
        `:( project with id ${projectId} could not be found in the database :(`
      );
    }
  }
};
const changeProjectName = asyncHandler(async (req: any, res) => {
  const { projectId, newProjectName } = req.body;
  const slugifiedProjectName = slugify(newProjectName, { replacement: '-', lower: true, strict: true });
  const foundProject: IProject = await findProject(slugifiedProjectName);
  if (foundProject) {
    res.status(400);
    throw new Error(`:( project with name ${slugifiedProjectName} already exists :(`);
  }

  if (!projectId || !newProjectName) {
    res.status(400);
    throw new Error("Missing projectId or newProjectName");
  }
  const existingProject = await findProjectById(projectId);
  if (!existingProject) {
    res.status(404);
    throw new Error(":( project not found :(");
  }
  if (req.user._id !== existingProject.projectOwnerId) {
    res.status(401);
    throw new Error("Not authorized to change project name");
  }

  try {
    await Project.findOneAndUpdate(
      { projectId },
      { projectName: slugifiedProjectName }
    );
  } catch (error) {
    console.error("Error updating project name:", error);
  }

  const project = await findProjectById(projectId);
  if (!project) {
    res.status(404);
    throw new Error(":( project not found :(");
  }

  res.json({
    message: "Project name updated",
    projectName: slugifiedProjectName,
    originalName: newProjectName
  });
});

const changeProjectDescription = asyncHandler(async (req: any, res) => {
  const { projectId, newProjectDescription } = req.body;

  if (!projectId || !newProjectDescription) {
    res.status(400);
    throw new Error("Missing projectId or newProjectDescription");
  }

  const existingProject = await findProjectById(projectId);
  if (!existingProject) {
    res.status(404);
    throw new Error(":( project not found :(");
  }
  if (req.user._id !== existingProject.projectOwnerId) {
    res.status(401);
    throw new Error("Not authorized to change project Description");
  }

  try {
    await Project.findOneAndUpdate(
      { projectId },
      { projectDescription: newProjectDescription }
    );
  } catch (error) {
    console.error("Error updating project description:", error);
  }
  const project = await findProjectById(projectId);
  if (!project) {
    res.status(404);
    throw new Error(":( project not found :(");
  }
  res.json({
    message: "Project description updated",
    projectDescription: project.projectDescription
  });
});

// @desc    Update an existing project
// @route   POST /api/projects/update
// @access  NOT Public
const updateProject = asyncHandler(async (req: any, res) => {
  console.log("here");
  const user = req.user;
  const projectName: string = req.body.projectName;
  const projectFiles: IProjectFile[] = req.body.projectFiles;

  const existingProject = await findProject(projectName);
  if (!existingProject) {
    res.status(400);
    throw new Error(":( project not found :(");
  }

  if (existingProject.projectOwnerId !== user._id) {
    res.status(401);
    throw new Error("Not authorized to update this project");
  }

  const updates: any = { projectFiles: projectFiles };
  const findProj: any = { projectName: projectName };

  try {
    await Project.findOneAndUpdate(findProj, updates);
    res.status(201).json({
      message: `Project ${projectName} updated!`
    });
  } catch (error) {
    res.status(400);
    throw new Error(`Error updating project: ${error}`);
  }
});

const getProjectDescription = asyncHandler(async (req: any, res) => {
  const projectId: string = req.params.projectId;
  let project: IProject;

  if (!projectId) {
    res.status(400);
    throw new Error("Missing projectId");
  }

  project = await findProjectById(projectId);
  if (!project) {
    res.status(404);
    throw new Error(":( project not found :(");
  }
  console.log("Project ID:", projectId);
  console.log("Project name:", project.projectName);
  console.log("Project description:", project.projectDescription);

  res.json({
    projectDescription: project.projectDescription
  });
});

// @desc    Get a project
// @route   GET /get/:projectId
// @access  Public
const getProject = asyncHandler(async (req: any, res) => {
  const projectName: string = req.params.projectName;
  let project: IProject;

  try {
    project = await findProject(projectName);
  } catch (e) {
    res.status(400);
    throw new Error(":( project not found :(");
  }

  res.send(project);
});

const getProjectId = asyncHandler(async (req: any, res) => {
  const projectName: string = req.params.projectName;
  let project: IProject;

  try {
    project = await findProject(projectName);
  } catch (e) {
    res.status(400);
    throw new Error(":( project not found :(");
  }

  res.json({ projectId: project.projectId });
});

// @desc    Render a project file
// @route   GET /pf/:projectName/:filename
// @access  Public
const renderFile = asyncHandler(async (req: any, res) => {
  const projectName: string = req.params.projectName;
  let fileName: string = req.params.filename;

  let project: IProject;

  try {
    project = await findProject(projectName);
  } catch (e) {
    res.status(400);
    throw new Error(":( project not found :(");
  }

  if (!fileName) {
    if (req.originalUrl.endsWith("/")) {
      fileName = "index.html";
    } else {
      res.redirect(req.originalUrl + "/");
      return;
    }
  }

  const projectFile: IProjectFile | undefined = project.projectFiles.find(
    (file: IProjectFile) => file.fileName === fileName
  );

  if (!projectFile) {
    res.status(404);
    throw new Error(":( file not found :(");
  }

  if (fileName.endsWith(".html")) {
    res.setHeader("Content-Type", "text/html");
  }

  if (fileName.endsWith(".js")) {
    res.setHeader("Content-Type", "text/javascript");
  }

  if (fileName.endsWith(".css")) {
    res.setHeader("Content-Type", "text/css");
  }

  res.send(projectFile.fileContent);
});

export {
  createProject,
  updateProject,
  checkOwnership,
  getProject,
  copyProject,
  renderFile,
  findProjectById,
  changeProjectName,
  changeProjectDescription,
  getProjectId,
  getProjectDescription
};
