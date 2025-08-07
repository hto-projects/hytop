import { useState } from "react";
import {
  Container,
  Paper,
  Title,
  TextInput,
  Button,
  Group,
  PasswordInput,
  Box,
  Text,
  useComputedColorScheme
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import {
  useUpdateUserMutation,
  useGetUserProjectsQuery
} from "../slices/usersApiSlice";
import { setCredentials, logout } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";
import ProjectList from "../components/ProjectList";

const ProfileScreen = () => {
  const { userInfo } = useSelector((state: any) => state.auth);
  const userId = userInfo?._id || userInfo?.userId;
  const {
    data: userProjects = [],
    isLoading: projectsLoading,
    error: projectsError
  } = useGetUserProjectsQuery(userId, { skip: !userId });

  const [email, setEmail] = useState(userInfo ? userInfo.email : "");
  const [name, setName] = useState(userInfo ? userInfo.name : "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updateProfile, { isLoading }] = useUpdateUserMutation();
  const theColorScheme = useComputedColorScheme("light");

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const updateData: any = { id: userId, name, email };
        if (password) updateData.password = password;
        const res = await updateProfile(updateData).unwrap();
        dispatch(setCredentials(res));
        toast.success("Profile updated successfully");
      } catch (err: any) {
        toast.error(
          err?.data?.message || err.error || "Failed to update profile"
        );
      }
    }
  };

  const handleLogout = () => {
    dispatch(logout(null));
    navigate("/login");
  };

  return (
    <Box
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: theColorScheme === "dark" ? "#181A1B" : undefined,
        color: theColorScheme === "dark" ? "#fff" : undefined,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "auto"
      }}
    >
      <Container size={1200} my={40}>
        <Paper
          shadow="md"
          p={48}
          radius="md"
          withBorder
          style={{
            width: "100%",
            display: "flex",
            gap: 48,
            background: theColorScheme === "dark" ? "#23272A" : undefined,
            color: theColorScheme === "dark" ? "#fff" : undefined
          }}
        >
          <div style={{ flex: 1, minWidth: 340 }}>
            <Title order={2} ta="center" mb="md">
              Account
            </Title>
            <form onSubmit={submitHandler} style={{ width: "100%" }}>
              <TextInput
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                mb="md"
                size="md"
                style={{ width: "100%" }}
                styles={{
                  input: {
                    color: theColorScheme === "dark" ? "#fff" : undefined,
                    width: "100%"
                  },
                  label: {
                    color: theColorScheme === "dark" ? "#fff" : undefined
                  }
                }}
              />
              <TextInput
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                mb="md"
                size="md"
                style={{ width: "100%" }}
                styles={{
                  input: {
                    color: theColorScheme === "dark" ? "#fff" : undefined,
                    width: "100%"
                  },
                  label: {
                    color: theColorScheme === "dark" ? "#fff" : undefined
                  }
                }}
              />
              <PasswordInput
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                mb="md"
                size="md"
                style={{ width: "100%" }}
                styles={{
                  input: {
                    color: theColorScheme === "dark" ? "#fff" : undefined,
                    width: "100%"
                  },
                  label: {
                    color: theColorScheme === "dark" ? "#fff" : undefined
                  }
                }}
              />
              <PasswordInput
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                mb="md"
                size="md"
                style={{ width: "100%" }}
                styles={{
                  input: {
                    color: theColorScheme === "dark" ? "#fff" : undefined,
                    width: "100%"
                  },
                  label: {
                    color: theColorScheme === "dark" ? "#fff" : undefined
                  }
                }}
              />
              <Group mt="md" justify="space-between">
                <Button type="submit" size="md" loading={isLoading}>
                  Update
                </Button>
                <Button
                  variant="outline"
                  color="red"
                  size="md"
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
              </Group>
              {isLoading && (
                <Box mt="md">
                  <Loader />
                </Box>
              )}
            </form>
          </div>

          <div
            style={{
              flex: 2,
              minWidth: 320,
              borderLeft:
                theColorScheme === "dark" ? "1px solid #333" : "1px solid #eee",
              paddingLeft: 48
            }}
          >
            <Title order={2} mb={16} ta="left">
              Your Projects
            </Title>
            <ProjectList
              projects={userProjects}
              loading={projectsLoading}
              error={projectsError}
            />
          </div>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProfileScreen;
