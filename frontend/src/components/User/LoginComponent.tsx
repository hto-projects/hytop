import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Paper,
  Text,
  TextInput,
  PasswordInput,
  Center,
  Title
} from "@mantine/core";
import Button from "../Interface/Button";
import { Form, TextInputForm, PasswordInputForm } from "../Interface/Form";
import { toast } from "react-toastify";
import Logo from "../Interface/Logo";
import Loader from "../Interface/Loader";

import { useLoginMutation } from "../../slices/usersApiSlice";
import { setCredentials } from "../../slices/authSlice";

interface LoginProps {
  setDisplayedPanel: React.Dispatch<React.SetStateAction<"Login" | "Register">>;
}

export default function Login({ setDisplayedPanel }: LoginProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();

  const submitHandler = async (
    fulfilled: boolean,
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const res = await login({ username, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      // TODO: navigate somewhere else once someone signs in
      navigate("/");
    } catch (err: any) {
      toast.error(err?.data?.message || err?.error || "Login failed");
    }
  };

  const { userInfo } = useSelector((state: any) => state.auth);
  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

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
      <Center mb="lg">
        <Logo svgPath="/favicon.svg" height="5em" />
      </Center>
      <Title order={2} ta="center" mb="md">
        Sign In
      </Title>
      <Form colorScheme={"dark"} onSubmit={submitHandler}>
        <TextInputForm
          label="Username"
          value={username}
          setValue={setUsername}
          required
        />
        <PasswordInputForm
          label="Password"
          value={password}
          setValue={setPassword}
          required
        />
        <Center mt="md">
          <Button type="submit" size="md" style={{ width: "100%" }}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </Center>
        {isLoading && (
          <Center mt="md">
            <Loader />
          </Center>
        )}
      </Form>
      <Text ta="center" mt="md">
        Don't have an account?{" "}
        <Button
          onClick={() => setDisplayedPanel("Register")}
          variant="hi"
          size="sm"
          style={{ padding: 1, marginLeft: 4 }}
        >
          Register here
        </Button>
      </Text>
    </Paper>
  );
}
