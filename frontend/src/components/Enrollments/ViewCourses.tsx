// show all open courses, enroll
import { Box, Container, Paper, Title, Table, Button } from "@mantine/core";
import { ICourseOffering, UserTypeForCourse } from "../../../../shared/types";
import { Link } from "react-router-dom";

interface ViewCoursesProps {
  courses: Array<ICourseOffering & { userType: UserTypeForCourse }>;
  onEnrollMe: (offeringId: string) => void;
  onEnrollSomeone: (username: string, offeringId: string, forInstructor: boolean) => void;
}

const ViewCourses = ({ courses, onEnrollMe, onEnrollSomeone }: ViewCoursesProps) => {
  const handleEnrollSomeone = (offeringId: string) => {
    const username: string = prompt("Enter the username of someone to enroll!");
    const forInstructor: boolean = prompt('Enter "instructor" to enroll an instructor') == "instructor";
    onEnrollSomeone(username, offeringId, forInstructor);
  }

  const getActionsTd: (offeringId: string, userType: UserTypeForCourse) => JSX.Element = (offeringId, userType) => {
    switch (userType) {
      case "instructor":
        return (<>
          <Button onClick={() => handleEnrollSomeone(offeringId)}>Enroll Someone Else</Button>
        </>)
      case "enrollee":
        return (<>
          Enrollment Submitted
        </>)
      case "student":
        return (<>
          Enrolled
        </>)
      case "user":
        return (<>
          <Button onClick={() => onEnrollMe(offeringId)}>Enroll</Button>
        </>)
      default:
        return <>
          <Link to={`/#signup`}>Sign Up</Link>
        </>
    }
  }

  const getTitleTd: (c: ICourseOffering & { userType: UserTypeForCourse }) => JSX.Element = (c) => {
    const courseSection = c.courseSection ? ` (${c.courseSection})` : "";
    const courseText = `${c.programName} ${c.programIteration}: ${c.courseName}${courseSection}`;
    if (c.userType === "instructor") {
      return <Link style={{color: "white", background: "black", padding: "5px", fontWeight: "bold"}} to={`/vc/${c.offeringId}`}>{courseText}</Link>
    } else {
      return <span>{courseText}</span>;
    }
  }

  return (
    <Box
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        overflow: "auto",
        color: "black",
        background: "white",
      }}
    >
      <Container size={1800} my={40}>
        <Paper
          shadow="md"
          p={48}
          radius="md"
          withBorder
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 48,
            color: "black",
            background: "white"
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", minWidth: "1200px" }}>
            <Title>Courses</Title>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            {courses.length > 0 ?
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Course</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {courses.map(c => (
                    <Table.Tr>
                      <Table.Td>{getTitleTd(c)}</Table.Td>
                      <Table.Td>{getActionsTd(c.offeringId, c.userType)}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              :
              <p>No courses right now</p>
            }
          </div>
        </Paper>
      </Container>
    </Box >
  );
};

export default ViewCourses;
