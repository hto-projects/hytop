import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Title
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { useLoginMutation } from "../../slices/usersApiSlice";
import { setCredentials } from "../../slices/authSlice";

// TODO: the next big thing that needs to be done here is to combine the register user, sign in, and a replacement graphic for the stuff on the right
const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state: any) => state.auth);
  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await login({ username, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (err: any) {
      toast.error(err?.data?.message || err?.error || "Login failed");
    }
  };

  return (
    <Box
      style={{
        backgroundColor: "#5e50b4",
        width: "100%",
        overflowY: "auto",
        display: "flex",
        alignItems: "flex-start",
        padding: "50px",
        paddingTop: "12.5vh",
        paddingBottom: "35vh",
        boxSizing: "border-box"
      }}
    >
      <div
        style={{
          marginLeft: "12.5vw",
          width: "30vw"
        }}
      >
        <h2
          style={{
            fontSize: "calc(4.5vw + 2.5vh)",
            width: "auto",
            color: "white",
            paddingBottom: "5px"
          }}
        >
          Welcome
        </h2>
        <p style={{ fontSize: "30px", color: "white" }}>
          to the Hyland Tech Outreach Portal (HyTOP), A one stop shop for all
          your web and Python development needs.
        </p>
      </div>

      <Paper
        shadow="xl"
        p={30}
        radius="lg"
        withBorder
        style={{
          marginLeft: "18.5vw",
          width: 440,
          color: "#fff",
          border: "1px solid #373A40",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          paddingTop: 35,
          paddingBottom: 35
        }}
      >
        <Text size="1.6rem" fw={700} ta="center" c="white" mb={25}>
          Sign In
        </Text>

        <form onSubmit={submitHandler}>
          <TextInput
            label="Username"
            placeholder="Enter your username"
            size="md"
            radius="md"
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
            required
            mb={20}
            styles={{
              label: {
                color: "white",
                fontSize: "14px"
              },
              input: {
                backgroundColor: "#2c2e33",
                color: "white",
                fontSize: "14px",
                height: "45px"
              }
            }}
          />

          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            size="md"
            radius="md"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            required
            mb={25}
            styles={{
              label: {
                color: "white",
                fontSize: "14px"
              },
              input: {
                backgroundColor: "#2c2e33",
                color: "white",
                fontSize: "14px",
                height: "45px"
              }
            }}
          />

          <Button
            type="submit"
            size="md"
            radius="md"
            fullWidth
            loading={isLoading}
          >
            Sign In
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginScreen;
