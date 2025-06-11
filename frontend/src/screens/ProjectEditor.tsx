import React, { useState, useEffect } from "react";
import FileSelector from "../components/FileSelector";
import FileEditor from "../components/FileEditor";
import ProjectPreview from "../components/ProjectPreview";
import { useParams } from "react-router-dom";
import {
  useCheckOwnershipQuery,
  useGetProjectQuery
} from "../slices/projectsApiSlice";
import { useUpdateProjectMutation } from "../slices/projectsApiSlice";
import Loader from "../components/Loader";
import { IProject } from "../../../shared/types";

interface ProjectFile {
  fileName: string;
  fileContent: string;
}

const ProjectEditor = () => {
  const { projectName } = useParams();

  const ownership: any = useCheckOwnershipQuery(projectName);

  const filesStarter: ProjectFile[] = [
    {
      fileName: "index.html",
      fileContent: ""
    },
    {
      fileName: "style.css",
      fileContent: ""
    },
    {
      fileName: "script.js",
      fileContent: ""
    }
  ];

  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>(filesStarter);
  const [currentlySelectedFilename, setCurrentlySelectedFilename] =
    useState<string>("index.html");

  const projectData: any = useGetProjectQuery(projectName);
  const [projectVersion, setProjectVersion] = useState<number>(0);
  const [userIsOwner, setUserIsOwner] = useState<boolean>(false);
  const [updateProject, { isLoading }] = useUpdateProjectMutation();

  React.useEffect(() => {
    if (ownership.data) {
      setUserIsOwner(ownership.data.isOwner);
    }
  }, [ownership]);

  React.useEffect(() => {
    if (!projectData || !projectData.data) return;

    const data: IProject = projectData.data;

    setProjectFiles(data.projectFiles);
  }, [projectData]);

  const fileSelection = (filename: string) => {
    setCurrentlySelectedFilename(filename);
  };

  const currentFile: ProjectFile = projectFiles.find(
    (f) => f.fileName === currentlySelectedFilename
  );

  const save = async () => {
    try {
      const res = await updateProject({
        projectFiles,
        projectName
      }).unwrap();

      setProjectVersion(projectVersion + 1);
    } catch (err) {
      alert(err?.data?.message || err.error);
    }
  };

  const copy = () => {
    window.location.href = `/c/${projectName}`;
  };

  const handleFileEdit = (newContent: string) => {
    const updatedFiles: ProjectFile[] = projectFiles.map(
      (file: ProjectFile) => {
        if (file.fileName === currentlySelectedFilename) {
          return {
            fileName: currentlySelectedFilename,
            fileContent: newContent
          };
        }

        return file;
      }
    );

    setProjectFiles(updatedFiles);
  };

  if (projectData.isLoading) return <p>Loading...</p>;
  if (projectData.error) return <p>Error loading project</p>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%"
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row"
        }}
      >
        <FileSelector
          filenamesList={projectFiles.map((file: ProjectFile) => file.fileName)}
          selectedFilename={currentlySelectedFilename}
          newFilenameSelected={fileSelection}
        ></FileSelector>
        <FileEditor
          fileContent={currentFile.fileContent}
          fileType={currentFile.fileName.split(".").pop()}
          onFileEdited={handleFileEdit}
          readOnly={!userIsOwner}
        ></FileEditor>
        <ProjectPreview
          projectId={projectName}
          version={projectVersion}
        ></ProjectPreview>
      </div>
      <div>
        {userIsOwner ? (
          <button onClick={save}>SAVE</button>
        ) : (
          <button onClick={copy}>COPY</button>
        )}
        {isLoading && <Loader />}
      </div>
    </div>
  );
};

export default ProjectEditor;
