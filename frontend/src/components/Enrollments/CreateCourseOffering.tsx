import { useState } from "react";
import {
  Paper,
  Title,
  Center,
} from "@mantine/core";
import {
  Form,
  TextInputForm
} from "../Interface/Form";
import Button from "../Interface/Button";
import Loader from "../Interface/Loader";

interface ICreateCourseOfferingProps {
  onSubmitForm: (programName: string, programIteration: string, courseName: string, courseSection: string) => Promise<void>;
  isLoading: boolean
}

const CreateCourseOffering = ({ onSubmitForm, isLoading }: ICreateCourseOfferingProps) => {
  const [programName, setProgramName] = useState<string>("");
  const [programIteration, setProgramIteration] = useState<string>("");
  const [courseName, setCourseName] = useState<string>("");
  const [courseSection, setCourseSection] = useState<string>("");

  async function onSubmit({ fulfilled, event }) {
    event.preventDefault();
    if (!fulfilled) {
      return;
    }

    onSubmitForm(programName, programIteration, courseName, courseSection);
  }

  return (
    <Paper
      shadow="md"
      p={48}
      radius="md"
      withBorder
      style={{
        width: "100%",
        height: "100%",
        margin: "0 auto",
        background: "#23272A",
        color: "#fff"
      }}
    >
      <Title order={2} ta="center" mb="md">
        Create Course Offering
      </Title>
      <Form
        onSubmit={onSubmit}
        colorScheme={"dark"}
      >
        <TextInputForm
          label="Program Name"
          value={programName}
          setValue={setProgramName}
          required
          hideFulfilled
        ></TextInputForm>
        <TextInputForm
          label="Program Iteration"
          value={programIteration}
          setValue={setProgramIteration}
          required
          showAfter
          hideFulfilled
        />
        <TextInputForm
          label="Course Name"
          value={courseName}
          setValue={setCourseName}
          required
          hideFulfilled
        ></TextInputForm>
        <TextInputForm
          label="Course Section"
          value={courseSection}
          setValue={setCourseSection}
          hideFulfilled
        ></TextInputForm>
        <Center mt="md">
          <Button type="submit" size="md" style={{ width: "100%" }}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </Center>
        {isLoading && (
          <Center mt="md">
            <Loader />
          </Center>
        )}
      </Form>
    </Paper>
  );
};

export default CreateCourseOffering;
