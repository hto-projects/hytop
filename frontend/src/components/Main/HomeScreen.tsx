import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Text,
  TextInput,
  PasswordInput,
  Button,
  ScrollArea,
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { useLoginMutation } from "../../slices/usersApiSlice";
import { setCredentials } from "../../slices/authSlice";

const HomeScreen = () => {
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
    <ScrollArea h={1000} w="100vw">
    <Box
      style={{
        height: "200vh",
        width: "100%",
        overflowY: "auto",
        backgroundImage: 'url("https://wallpaperaccess.com/full/3112075.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        padding: "50px",
        boxSizing: "border-box"
      }}
    >
      <Paper
        shadow="xl"
        p={30}
        radius="lg"
        withBorder
        style={{
          width: 440,
          backgroundImage:
            'url("https://static.vecteezy.com/system/resources/previews/011/049/040/original/v1-black-gradient-background-diamond-shape-pattern-vector.jpg")',
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
    </ScrollArea>
  );
};

export default HomeScreen;
