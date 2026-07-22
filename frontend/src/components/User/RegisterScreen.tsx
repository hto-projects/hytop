import { useState, useEffect } from "react";
import {
  Paper,
  Title,
  Center,
  useComputedColorScheme,
  Text
} from "@mantine/core";
import {
  Form,
  PasswordInputForm,
  TextInputForm,
  passwordValidation,
  usernameValidation,
  emailValidation,
  nameValidation
} from "../Interface/Form";
import Button from "../Interface/Button";
import Loader from "../Interface/Loader";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../../slices/usersApiSlice";
import { setCredentials } from "../../slices/authSlice";
import { toast } from "react-toastify";
import Logo from "../Interface/Logo";

interface LoginProps {
  setDisplayedPanel: React.Dispatch<React.SetStateAction<"Login" | "Register">>;
}

const RegisterScreen = ({ setDisplayedPanel }: LoginProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
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

  function confirmPasswordHandler(
    password: string,
    confirmPassword: string
  ): boolean {
    if (password === confirmPassword) return true;
    toast.error("Passwords do not match");
    return false;
  }

  async function onSubmit(
    fulfilled: boolean,
    e: React.FormEvent<HTMLFormElement>
  ) {
    if (!fulfilled) {
      return;
    }

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
        Register
      </Title>
      <Form
        colorScheme={theColorScheme}
        customConditions={() => {
          return confirmPasswordHandler(password, confirmPassword);
        }}
        onSubmit={onSubmit}
      >
        <TextInputForm
          label="Name"
          value={name}
          setValue={setName}
          validation={nameValidation}
          required
          hideFulfilled
        ></TextInputForm>
        <TextInputForm
          label="Email"
          value={email}
          setValue={setEmail}
          validation={emailValidation}
          required
          showAfter
          hideFulfilled
        />
        <TextInputForm
          label="Username"
          value={username}
          setValue={setUsername}
          validation={usernameValidation}
          required
          hideFulfilled
        ></TextInputForm>
        <PasswordInputForm
          label="Password"
          value={password}
          setValue={setPassword}
          validation={passwordValidation}
          required
          showAfter
          hideCompleted
        />
        <PasswordInputForm
          label="Confirm Password"
          value={confirmPassword}
          setValue={setConfirmPassword}
          required
        />
        <Center mt="md">
          <Button type="submit" size="md" style={{ width: "100%" }}>
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </Center>
        {isLoading && (
          <Center mt="md">
            <Loader />
          </Center>
        )}
      </Form>
      <Text ta="center" mt="md">
        Already have an account?{" "}
        <Button
          onClick={() => setDisplayedPanel("Login")}
          variant="hi"
          size="sm"
          style={{ padding: 1, marginLeft: 4 }}
        >
          Sign In
        </Button>
      </Text>
    </Paper>
  );
};

export default RegisterScreen;
