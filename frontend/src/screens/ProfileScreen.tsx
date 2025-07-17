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
  useComputedColorScheme
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useUpdateUserMutation } from "../slices/usersApiSlice";
import { setCredentials, logout } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";

const ProfileScreen = () => {
  const { userInfo } = useSelector((state: any) => state.auth);

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
        const res = await updateProfile({
          _id: userInfo._id,
          name,
          email,
          password
        }).unwrap();
        dispatch(setCredentials(res));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const handleLogout = () => {
    dispatch(logout(null));
    navigate("/");
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
        justifyContent: "center"
      }}
    >
      <Container size={600} my={40}>
        <Paper
          shadow="md"
          p={48}
          radius="md"
          withBorder
          style={{
            maxWidth: 520,
            margin: "0 auto",
            background: theColorScheme === "dark" ? "#23272A" : undefined,
            color: theColorScheme === "dark" ? "#fff" : undefined
          }}
        >
          <Title order={2} ta="center" mb="md">
            Account
          </Title>
          <form
            onSubmit={submitHandler}
            style={{ maxWidth: 440, width: "100%", margin: "0 auto" }}
          >
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
        </Paper>
      </Container>
    </Box>
  );
};

export default ProfileScreen;
