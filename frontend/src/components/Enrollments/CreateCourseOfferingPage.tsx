import {
  Box,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useCreateCourseOfferingMutation } from "../../slices/enrollmentsApiSlice";
import { toast } from "react-toastify";
import CreateCourseOffering from "./CreateCourseOffering";

const CreateCourseOfferingPage = () => {
  const navigate = useNavigate();
  const [createCourseOffering, { isLoading }] = useCreateCourseOfferingMutation();

  const onSubmitForm = async (programName, programIteration, courseName, courseSection) => {
    try {
      const res = await createCourseOffering({
        programName,
        programIteration,
        courseName,
        courseSection
      }).unwrap();
      toast.success(res.message);
      navigate(`/vc/${res.offeringId}`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  }

  return (
    <Box
      style={{
        height: "100vh",
        width: "100vw",
        color: "#fff",
        overflow: "hidden",
        background: "black"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          margin: "auto",
          padding: "25px",
          position: "relative",
          zIndex: "1"
        }}
      >
        <CreateCourseOffering onSubmitForm={onSubmitForm} isLoading={isLoading} />
      </div>
    </Box>
  );
};

export default CreateCourseOfferingPage;
