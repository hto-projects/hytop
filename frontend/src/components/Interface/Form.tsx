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
  setValue: React.Dispatch<React.SetStateAction<string>>; // input field hook
  validation?: (input: string) => Array<Condition>; // a function for conditions
  required?: boolean;
  showAfter?: boolean; // displays conditions onBlur
  hideFulfilled?: boolean; // only shows errors
}

interface Condition {
  description: string;
  fulfilled: boolean;
}

export function emptyValidation(input: string): Array<Condition> {
  return [];
}

// there are definitely better ways to make this, write a hashmap if you're upset
export function passwordValidation(input: string): Array<Condition> {
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

export function usernameValidation(input: string): Array<Condition> {
  const conditions: Array<Condition> = [
    "Username must start with a letter",
    "Username must only contain letters and numbers"
  ].map((description) => {
    return {
      description: description,
      fulfilled: false
    };
  });

  if (!/^[a-z]/i.test(input)) conditions[0]["fulfilled"] = true;
  if (!/^[a-z0-9]+$/i.test(input)) conditions[1]["fulfilled"] = true;
  return conditions;
}

export function emailValidation(input: string): Array<Condition> {
  const conditions: Array<Condition> = ["Email is not valid"].map(
    (description) => {
      return {
        description: description,
        fulfilled: false
      };
    }
  );

  if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(input))
    conditions[0]["fulfilled"] = true;
  return conditions;
}

function showConditionals(
  conditions: Array<Condition>,
  hideFulfilled: boolean
): Array<React.ReactNode> {
  if (hideFulfilled) {
    conditions = conditions.filter((condition) => condition.fulfilled);
  }

  return conditions.map(({ description, fulfilled }, i) => {
    return (
      <Text key={i} c={fulfilled ? "red" : "green"}>
        {description}
      </Text>
    );
  });
}

export function PasswordFormElement({
  label,
  value,
  setValue,
  validation = emptyValidation,
  required = false,
  showAfter = false,
  hideFulfilled = false
}: MantineFormProps) {
  let [focused, setFocused] = useState(false);
  let conditions: Array<React.ReactNode> = showConditionals(
    validation(value),
    hideFulfilled
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
        required={required}
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
      {value !== "" && !(focused && showAfter) && conditions}
    </>
  );
}

// INPUT FORM

export function TextInputForm({
  label,
  value,
  setValue,
  validation = emptyValidation,
  required = false,
  showAfter = false,
  hideFulfilled = false
}: MantineFormProps) {
  let [focused, setFocused] = useState(false);
  let conditions: Array<React.ReactNode> = showConditionals(
    validation(value),
    hideFulfilled
  );

  let colorScheme = React.useContext(ColorSchemeContext);
  return (
    <>
      <TextInput
        label={label}
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => setValue(e.target.value)}
        required={required}
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
      {value !== "" && !(focused && showAfter) && conditions}
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
