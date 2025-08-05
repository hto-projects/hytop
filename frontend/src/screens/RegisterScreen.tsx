import { useState, useEffect } from "react";
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
import Loader from "../components/Loader";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

const RegisterScreen = ({
  setScreen
}: {
  setScreen?: (screen: string) => void;
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state: any) => state.auth);

  const theColorScheme = useComputedColorScheme("light");

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password needs to be 8 characters");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      toast.error("Password needs to have a capital letter");
      return;
    } //capital letteSr

    if (!/[0-9]/.test(password)) {
      toast.error("Password needs to conatin atleast 1 number");
      return;
    } //must contain number

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await register({
          name,
          email,
          username,
          password
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate("/");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
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
          <Center mb="lg">
            <img
              src="/favicon.svg"
              style={{
                height: "5em"
              }}
            />
          </Center>
          <Title order={2} ta="center" mb="md">
            Register
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
            <TextInput
              label="Username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
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
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                {isLoading ? "Registering..." : "Register"}
              </Button>
            </Center>
            {isLoading && (
              <Center mt="md">
                <Loader />
              </Center>
            )}
          </form>
          <Text ta="center" mt="md">
            Already have an account?{" "}
            <Button
              onClick={() =>
                setScreen ? setScreen("sign in") : navigate("/login")
              }
              variant="hi"
              size="sm"
              style={{ padding: 1, marginLeft: 4 }}
            >
              Sign In
            </Button>
          </Text>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterScreen;
