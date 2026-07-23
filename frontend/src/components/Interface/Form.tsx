// this is a Generic Form Component which exposes `Form` and many form elements
// basic usage:
// Form expects a colorsScheme and a submitHandler (and an optional set of custom conditions)
// Form takes more react componenets as children, each of which require a lavel, value, and setValue hook
// you can define custom validation functions for each field or use the defaults provided in this file

import {
  TextInput,
  PasswordInput,
  Text,
  MantineColorScheme,
  useCombobox,
  Combobox,
  Group,
  Input,
  InputBase
} from "@mantine/core";
import React, { useState, useEffect, useCallback } from "react";
const ColorSchemeContext = React.createContext("auto");

// for error checking internally
interface FormValidationContextType {
  registerError: () => void;
  unregisterError: () => void;
}
const FormValidationContext =
  React.createContext<FormValidationContextType | null>(null);

// takes any set of inputs, must return true or false
type customConditionsType = (...inputs: any[]) => boolean;

interface FormProps {
  children: React.ReactNode;
  colorScheme: MantineColorScheme;
  customConditions?: customConditionsType;
  onSubmit: ({
    fulfilled,
    event
  }: {
    fulfilled: boolean;
    event: React.FormEvent<HTMLFormElement>;
  }) => void; // handles your logic after form submit
}

interface MantineFormProps {
  label: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>; // input field hook
  validation?: (input: string) => Array<Condition>; // a function for conditions
  required?: boolean;
  showAfter?: boolean; // displays conditions onBlur
  hideFulfilled?: boolean; // only shows errors
  hideCompleted?: boolean; // removes the conditions onBlur if everything is done
}

interface BaseFormInputProps extends MantineFormProps {
  type: typeof TextInput | typeof PasswordInput;
  showConditionsOn: "always" | "focus_or_blur_with_value";
}

// internal for displaying conditions
export interface Condition {
  description: string;
  fulfilled: boolean;
}

// default empty validation, do nothing
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

  if (input.length >= 8) conditions[0]["fulfilled"] = true;
  if (/[A-Z]/.test(input)) conditions[1]["fulfilled"] = true;
  if (/[0-9]/.test(input)) conditions[2]["fulfilled"] = true;
  return conditions;
}

export function usernameValidation(input: string): Array<Condition> {
  const conditions: Array<Condition> = [
    "Username must start with a letter",
    "Username must only contain letters and numbers",
    "Username must be between 3 and 20 characters"
  ].map((description) => {
    return {
      description: description,
      fulfilled: false
    };
  });

  if (/^[a-z]/i.test(input)) conditions[0]["fulfilled"] = true;
  if (/^[a-z0-9]+$/i.test(input)) conditions[1]["fulfilled"] = true;
  if (input.length >= 3 && input.length <= 20)
    conditions[2]["fulfilled"] = true;
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

  if (/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(input))
    conditions[0]["fulfilled"] = true;
  return conditions;
}

export function nameValidation(input: string): Array<Condition> {
  const conditions: Array<Condition> = ["Name may only contain letters"].map(
    (description) => {
      return {
        description: description,
        fulfilled: false
      };
    }
  );

  if (/^[a-z ]+$/i.test(input)) conditions[0]["fulfilled"] = true;
  return conditions;
}

function showConditionals(
  conditions: Array<Condition>,
  hideFulfilled: boolean
): Array<React.ReactNode> {
  if (hideFulfilled) {
    conditions = conditions.filter((condition) => !condition.fulfilled);
  }

  return conditions.map(({ description, fulfilled }, i) => {
    return (
      <Text key={i} c={fulfilled ? "green" : "red"}>
        {description}
      </Text>
    );
  });
}

// base component which password and text inherit from
function BaseFormInput({
  type: InputComponent,
  showConditionsOn,
  label,
  value,
  setValue,
  validation = emptyValidation,
  required = false,
  showAfter = false,
  hideFulfilled = false,
  hideCompleted = false
}: BaseFormInputProps) {
  let [focused, setFocused] = useState(false);

  let valid = validation(value);
  let conditions: Array<React.ReactNode> = showConditionals(
    valid,
    hideFulfilled
  );

  let notFulfilled =
    required && value === "" ? true : !valid.every((entry) => entry.fulfilled);

  const context = React.useContext(FormValidationContext);
  useEffect(() => {
    if (!context) return;
    if (notFulfilled) {
      context.registerError();
      return () => context.unregisterError();
    }
  }, [notFulfilled, context]);

  if (hideCompleted && !focused) {
    if (valid.every((entry) => entry.fulfilled)) {
      conditions = [];
    }
  }

  const conditionVisibilityRule =
    showConditionsOn === "always"
      ? (value !== "" && showAfter) || focused
      : value !== "" && !(focused && showAfter);

  let colorScheme = React.useContext(ColorSchemeContext);
  return (
    <>
      <InputComponent
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
      {conditionVisibilityRule && conditions}
    </>
  );
}

export function PasswordInputForm(props: MantineFormProps) {
  return (
    <BaseFormInput {...props} type={PasswordInput} showConditionsOn="always" />
  );
}

export function TextInputForm(props: MantineFormProps) {
  return (
    <BaseFormInput
      {...props}
      type={TextInput}
      showConditionsOn="focus_or_blur_with_value"
    />
  );
}

interface DropdownProps {
  options: Array<string>;
  label: string;
  placeholder?: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>; // input field hook
}

export function DropdownForm({
  options,
  label,
  placeholder = "",
  value,
  setValue
}: DropdownProps) {
  const colorScheme = React.useContext(ColorSchemeContext);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: (eventSource) => {
      if (eventSource === "keyboard") {
        combobox.selectActiveOption();
      } else {
        combobox.updateSelectedOptionIndex("active");
      }
    }
  });

  const dropdownOptions = options.map((item) => (
    <Combobox.Option value={item} key={item} active={item === value}>
      <Group gap="xs">
        <Text c={colorScheme === "dark" ? "white" : "black"}>{item}</Text>
      </Group>
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      resetSelectionOnOptionHover
      onOptionSubmit={(val) => {
        setValue(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target targetType="button">
        <InputBase
          mb="md"
          size="md"
          style={{ width: "100%" }}
          label={label}
          color={colorScheme}
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          rightSectionPointerEvents="none"
          onClick={() => combobox.toggleDropdown()}
          onChange={(event) => combobox.updateSelectedOptionIndex()}
        >
          {(placeholder && !value && (
            <Input.Placeholder>{placeholder}</Input.Placeholder>
          )) ||
            value}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{dropdownOptions}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}

// form wrapper, handles form validation
export function Form({
  children,
  colorScheme,
  customConditions,
  onSubmit
}: FormProps) {
  const [errorCount, setErrorCount] = useState(0);
  const registerError = useCallback(() => setErrorCount((c) => c + 1), []);
  const unregisterError = useCallback(
    () => setErrorCount((c) => Math.max(0, c - 1)),
    []
  );

  function submitHandler(event: React.FormEvent<HTMLFormElement>): void {
    let fulfilled = true;

    if (errorCount > 0) {
      fulfilled = false;
    }

    if (customConditions && !customConditions()) {
      fulfilled = false;
    }

    onSubmit({ fulfilled, event });
  }

  return (
    <form
      onSubmit={submitHandler}
      style={{ maxWidth: 440, width: "100%", margin: "0 auto" }}
    >
      <FormValidationContext.Provider
        value={{ registerError, unregisterError }}
      >
        <ColorSchemeContext.Provider value={colorScheme}>
          {children}
        </ColorSchemeContext.Provider>
      </FormValidationContext.Provider>
    </form>
  );
}
