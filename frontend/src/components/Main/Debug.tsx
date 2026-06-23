import {
  Form,
  PasswordFormElement,
  TextInputForm,
  passwordValidation,
  usernameValidation,
  emailValidation
} from "../Interface/Form";
import { useState } from "react";
import { Box, Container } from "@mantine/core";

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
        <Form colorScheme="dark">
          <TextInputForm
            label="Username"
            value={username}
            setValue={setUsername}
            validation={usernameValidation}
            hideFulfilled
          />
          <TextInputForm
            label="Email"
            value={email}
            setValue={setEmail}
            validation={emailValidation}
            showAfter
            hideFulfilled
          />
          <PasswordFormElement
            label="Password"
            value={password}
            setValue={setPassword}
            validation={passwordValidation}
            hideCompleted
          />
          <PasswordFormElement
            label="Confirm Password"
            value={confirmPassword}
            setValue={setConfirmPassword}
          />
        </Form>
      </Container>
    </Box>
  );
}
