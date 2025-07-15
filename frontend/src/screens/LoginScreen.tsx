import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Center,
  Box,
  useComputedColorScheme,
  Text
} from "@mantine/core";
import Button from "../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state: any) => state.auth);

  const theColorScheme = useComputedColorScheme("light");

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ username, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
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
            Sign In
          </Title>
          <form
            onSubmit={submitHandler}
            style={{ maxWidth: 440, width: "100%", margin: "0 auto" }}
          >
            <TextInput
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              mb="md"
              size="md"
              autoFocus
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
            <Center mt="md">
              <Button
                type="submit"
                size="md"
                disabled={isLoading}
                style={{ width: "100%" }}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </Center>
            {isLoading && (
              <Center mt="md">
                <Loader />
              </Center>
            )}
          </form>
          <Text ta="center" mt="md">
            Don't have an account?{" "}
            <Button
              onClick={() => navigate("/register")}
              variant="hi"
              size="sm"
              style={{ padding: 1, marginLeft: 4 }}
            >
              Register
            </Button>
          </Text>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginScreen;
