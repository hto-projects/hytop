import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "../Interface/Loader";
import { useCopyProjectMutation } from "../../slices/projectsApiSlice";
import { useParams } from "react-router-dom";

const CopyProjectScreen = () => {
  const { projectName } = useParams();

  const [createdProjectName, setCreatedProjectName] = useState("");
  const [copyProject, { isLoading }] = useCopyProjectMutation();

  useEffect(() => {
    const handleCopyProject = async () => {
      const res = await copyProject({ projectName }).unwrap();
      if (res) {
        toast.success(res.message);
        window.location.href = `/e/${res.projectName}`;
      } else {
        toast.error("Failed to copy project");
      }
    };

    if (!createdProjectName) {
      handleCopyProject();
    }
  }, []);

  return <>{isLoading && <Loader />}</>;
};

export default CopyProjectScreen;
