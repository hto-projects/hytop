import {
  Box,
  Container,
  Loader,
  Paper,
  Title,
} from "@mantine/core";
import {
  useGetUserViewQuery,
} from "../../slices/usersApiSlice";
import { useParams } from "react-router-dom";
import ProjectList from "./ProjectList";
import { IUserView } from "../../../../shared/types";

const UserView = () => {
  const { username } = useParams();

  const {
    data: userViewInfo,
    error: userViewError,
    isLoading: userViewLoading
  } = useGetUserViewQuery(username, { skip: !username });

  if (userViewLoading) {
    return <Loader />;
  }

  return (
    <Box
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        overflow: "auto",
        color: "white",
        background: "black",
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
          }}
        >
          <div style={{display: "flex", justifyContent: "center", minWidth: "1200px"}}>
        <Title>{userViewInfo.username}</Title></div>
        <div style={{display: "flex", flexDirection: "row"}}>
          <div style={{ width: "400px" }}>
            <p>Name: <b>{userViewInfo.name}</b></p>
            <p>Email: <b>{userViewInfo.email}</b></p>
          </div>

          <div
            style={{
              width: "100%"
            }}
          >
            <ProjectList
              projects={userViewInfo.projects}
              loading={userViewLoading}
              error={userViewError}
            />
          </div>
          </div>
        </Paper>
      </Container>
    </Box>
  );
};

export default UserView;
