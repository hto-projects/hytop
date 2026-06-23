import { Form, PasswordFormElement } from "../Interface/Form";
import { useState } from "react";
import { Box, Container } from "@mantine/core";

export default function Debug() {
  let [password, setPassword] = useState("");
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
          <PasswordFormElement
            label="Password"
            value={password}
            setValue={setPassword}
          />
        </Form>
      </Container>
    </Box>
  );
}
