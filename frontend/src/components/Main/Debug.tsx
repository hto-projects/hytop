import {
  Form,
  PasswordInputForm,
  TextInputForm,
  passwordValidation,
  usernameValidation,
  emailValidation
} from "../Interface/Form";
import { useState } from "react";
import { Box, Container, Button, Paper } from "@mantine/core";

function confirmPasswordHandler(
  password: string,
  confirmPassword: string
): boolean {
  if (password === confirmPassword) return true;
  return false;
}

export default function Debug() {
  let [username, setUsername] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [confirmPassword, setConfirmPassword] = useState("");
  return (
    <Box
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "auto",
        color: "auto",
        alignItems: "center",
        justifyContent: "center",
        overflow: "auto"
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
            background: "auto",
            color: "auto"
          }}
        >
          <Form
            colorScheme="dark"
            customConditions={() =>
              confirmPasswordHandler(password, confirmPassword)
            }
            onSubmit={async (fulfilled, e) => {
              console.log(fulfilled);
            }}
          >
            <TextInputForm
              label="Username"
              value={username}
              setValue={setUsername}
              validation={usernameValidation}
              required
              hideFulfilled
            />
            <TextInputForm
              label="Email"
              value={email}
              setValue={setEmail}
              validation={emailValidation}
              required
              showAfter
              hideFulfilled
            />
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
            <Button type="submit" size="md" style={{ width: "100%" }}></Button>
          </Form>
        </Paper>
      </Container>
    </Box>
  );
}
