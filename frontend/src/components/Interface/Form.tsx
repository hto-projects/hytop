import {
  Container,
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Center,
  Box,
  useComputedColorScheme,
  Text,
  MantineColorScheme
} from "@mantine/core";
import React, { ReactElement, useState, useContext } from "react";
let ColorSchemeContext = React.createContext("auto");

interface FormProps {
  children: React.ReactNode;
  colorScheme: MantineColorScheme;
}

interface MantineFormProps {
  label: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  validation?: (input: string) => Array<Condition>;
}

interface Condition {
  description: string;
  fulfilled: boolean;
}

function emptyValidation(input: string): Array<Condition> {
  return [];
}

// there are definitely better ways to make this, write a hashmap if you're upset
function passwordValidation(input: string): Array<Condition> {
  const conditions: Array<Condition> = [
    "Password must contain 8 characters",
    "Password must have a capital letter",
    "Password must contain at least 1 number"
  ].map((description) => {
    return {
      description: description,
      fulfilled: false
    };
  });

  if (input.length < 8) conditions[0]["fulfilled"] = true;
  if (!/[A-Z]/.test(input)) conditions[1]["fulfilled"] = true;
  if (!/[0-9]/.test(input)) conditions[2]["fulfilled"] = true;
  return conditions;
}

function usernameValidation(input: string): Array<Condition> {
  const conditions: Array<Condition> = [
    "Username may not start with a number",
    "Username must only contain letters and numbers"
  ].map((description) => {
    return {
      description: description,
      fulfilled: false
    };
  });

  if (input.length < 8) conditions[0]["fulfilled"] = true;
  if (!/[A-Z]/.test(input)) conditions[1]["fulfilled"] = true;
  if (!/[0-9]/.test(input)) conditions[2]["fulfilled"] = true;
  return conditions;
}

export function PasswordFormElement({
  label,
  value,
  setValue,
  validation = emptyValidation
}: MantineFormProps) {
  let [focused, setFocused] = useState(false);
  let conditions: Array<React.ReactNode> = validation(value).map(
    ({ description, fulfilled }) => {
      return <Text c={fulfilled ? "red" : "green"}>{description}</Text>;
    }
  );

  let colorScheme = React.useContext(ColorSchemeContext);
  return (
    <>
      <PasswordInput
        label={label}
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => setValue(e.target.value)}
        mb="md"
        size="md"
        style={{ width: "100%" }}
        styles={{
          input: {
            color: colorScheme === "dark" ? "#fff" : undefined,
            width: "100%"
          },
          label: {
            color: colorScheme === "dark" ? "#fff" : undefined
          }
        }}
      />
      {focused && conditions}
    </>
  );
}

// INPUT FORM

export function InputFormElement({
  label,
  value,
  setValue,
  validation = emptyValidation
}: MantineFormProps) {
  let [focused, setFocused] = useState(false);
  let conditions: Array<React.ReactNode> = validation(value).map(
    ({ description, fulfilled }) => {
      return <Text c={fulfilled ? "red" : "green"}>{description}</Text>;
    }
  );

  let colorScheme = React.useContext(ColorSchemeContext);
  return (
    <>
      <PasswordInput
        label={label}
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => setValue(e.target.value)}
        mb="md"
        size="md"
        style={{ width: "100%" }}
        styles={{
          input: {
            color: colorScheme === "dark" ? "#fff" : undefined,
            width: "100%"
          },
          label: {
            color: colorScheme === "dark" ? "#fff" : undefined
          }
        }}
      />
      {focused && conditions}
    </>
  );
}

export function Form({ children, colorScheme }: FormProps) {
  return (
    <Paper
      shadow="md"
      p={48}
      radius="md"
      withBorder
      style={{
        maxWidth: 520,
        margin: "0 auto",
        background: colorScheme === "dark" ? "#23272A" : undefined,
        color: colorScheme === "dark" ? "#fff" : undefined
      }}
    >
      <ColorSchemeContext.Provider value={colorScheme}>
        {children}
      </ColorSchemeContext.Provider>
    </Paper>
  );
}
