import { Box, Container, Paper, Title, Table, Button } from "@mantine/core";
import { CourseParticipantStatus, ICourseOffering, IParticipant } from "../../../../shared/types";
import { Link } from "react-router-dom";

interface ViewCourseOfferingProps {
  courseInfo: ICourseOffering;
  participants: IParticipant[];
  onConfirm: (username: string, forInstructor: boolean) => void;
  onResetPass: (username: string) => void;
  onEnrollSomeone: (username: string, offeringId: string, forInstructor: boolean) => void;
  onUpdateEnrollment: (userId: string, newStatus: CourseParticipantStatus | "delete") => void;
}

const ViewCourseOffering = ({ courseInfo, participants, onConfirm, onResetPass, onEnrollSomeone, onUpdateEnrollment }: ViewCourseOfferingProps) => {
  const instructors: IParticipant[] = [];
  const students : IParticipant[] = [];
  const unconfirmedParticipants: IParticipant[] = [];
  for (let i = 0; i < participants.length; i++) {
    const p: IParticipant = participants[i];
    switch (p.participantStatus) {
      case "instructor":
        instructors.push(p);
        break;
      case "student":
        students.push(p);
        break;
      default:
        unconfirmedParticipants.push(p);
        break
    }
  }

  const handleUpdateEnrollment = (userId) => {
    const newStatusStr: string = prompt('Enter a new status ("i" for instructor, "s" for student, "u" for unconfirmed, "d" for delete)');
    let newStatus: CourseParticipantStatus | "delete";
    console.log(newStatusStr);
    console.log(newStatus);
    switch (newStatusStr) {
      case "i":
        newStatus = "instructor";
        break;
      case "s":
        newStatus = "student";
        break;
      case "u":
        newStatus = "unconfirmed";
        break;
      case "d":
        newStatus = "delete";
    }
    
    console.log(newStatus);

    if (!newStatus) {
      alert("invalid :(");
      return;
    }

    if (newStatus !== "delete" || confirm("are you sure you want to delete this enrollment?")) {
      onUpdateEnrollment(userId, newStatus);
    }
  }

  const tableRowFromParticipant = (p: IParticipant) => (
  <Table.Tr key={p.participantUsername}>
    <Table.Td>{p.participantName}</Table.Td>
    <Table.Td><Link to={`/vp/${p.participantUsername}`}>{p.participantUsername}</Link></Table.Td>
    {p.participantStatus === "unconfirmed" && <Table.Td>
      <Button onClick={() => onConfirm(p.participantUserId, false)}>Make Student</Button>
      <Button onClick={() => onConfirm(p.participantUserId, true)}>Make Instructor</Button>
      <Button style={{background: "red"}} onClick={() => onUpdateEnrollment(p.participantUserId, "delete")}>X</Button>
    </Table.Td>}
    {p.participantStatus === "student" && <Table.Td>
      <Button onClick={() => confirm("Are you sure?") && onResetPass(p.participantUserId)}>Reset Password</Button>
      <Button style={{background: "tan"}} onClick={() => handleUpdateEnrollment(p.participantUserId)}>✏️</Button>
    </Table.Td>}
    {p.participantStatus === "instructor" && <Table.Td>
      <Button style={{background: "tan"}} onClick={() => handleUpdateEnrollment(p.participantUserId)}>✏️</Button>
    </Table.Td>}
  </Table.Tr>
);

  const handleEnrollSomeone = (offeringId: string) => {
    const username: string = prompt("Enter the username of someone to enroll!");
    const forInstructor: boolean = prompt('Enter "instructor" to enroll an instructor') == "instructor";
    onEnrollSomeone(username, offeringId, forInstructor);
  }

  const instructorsRows: JSX.Element[] = instructors.map(tableRowFromParticipant);
  const studentRows: JSX.Element[] = students.map(tableRowFromParticipant);
  const unconfirmedRows: JSX.Element[] = unconfirmedParticipants.map(tableRowFromParticipant);

  return (
    <Box
      style={{
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        overflow: "auto",
        color: "white",
        background: "black"
      }}
    >
      <Container my={40} style={{marginBottom: "20px"}}>
        <Paper
          shadow="md"
          p={48}
          radius="md"
          withBorder
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            background: "#444",
            color: "white",
            marginBottom: "20px",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", minWidth: "700px", flexDirection: "column", alignItems: "center", maxHeight: "100%" }}>
            <Title>{courseInfo.courseName}</Title>
            <p>Program: <b>{courseInfo.programName} {courseInfo.programIteration}</b></p>
            {courseInfo.courseSection && <p>Section: <b>{courseInfo.courseSection}</b></p>}
            <Link to="/vcs" style={{marginBottom: "20px", marginTop: "-10px"}}>View All Courses</Link>
            <Button onClick={() => handleEnrollSomeone(courseInfo.offeringId)}>Enroll Someone</Button>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div
              style={{
                width: "100%",
                marginBottom: "20px"
              }}
            >
              <div style={{marginBottom: "20px"}}>
                <Title style={{textAlign: "center"}}>Instructors</Title>
                {instructorsRows.length > 0 ?
                  <Table style={{background: "white", color: "black"}}>
                    <Table.Thead>
                      <Table.Th>Instructor Name</Table.Th>
                      <Table.Th>Instructor Username</Table.Th>
                    </Table.Thead>
                    <Table.Tbody>
                      {instructorsRows}
                    </Table.Tbody>
                  </Table>
                  :
                  <p>No instructors currently enrolled</p>
                }
              </div>
              <div style={{marginBottom: "20px"}}>
                <Title style={{textAlign: "center"}}>Students</Title>
                {studentRows.length > 0 ?
                  <Table style={{background: "white", color: "black"}}>
                    <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Student Name</Table.Th>
                      <Table.Th>Student Username</Table.Th>
                      <Table.Th>Actions</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {studentRows}
                    </Table.Tbody>
                  </Table>
                  :
                  <p>No students currently enrolled</p>
                }
              </div>
              <div>
                
                {unconfirmedRows.length > 0 &&
                <>
                <Title style={{textAlign: "center"}}>Unconfirmed</Title>
                  <Table style={{background: "white", color: "black"}}>
                    <Table.Thead>
                      <Table.Tr>
                      <Table.Th>Name</Table.Th>
                      <Table.Th>Username</Table.Th>
                      <Table.Th>Actions</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {unconfirmedRows}
                    </Table.Tbody>
                  </Table></>}
              </div>
            </div>
          </div>
        </Paper>
        <div style={{height: "20px"}}></div>
      </Container>
    </Box>
  );
};

export default ViewCourseOffering;
