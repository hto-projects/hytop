import {
  Form,
  TextInputForm,
  usernameValidation,
  Condition
} from "../Interface/Form";
import { MantineColorScheme, Button } from "@mantine/core";
import { useState } from "react";

interface AdminPromotionProps {
  colorScheme: MantineColorScheme;
}

export default function AdminPromotion({ colorScheme }: AdminPromotionProps) {
  const [username, setUsername] = useState<string>("");
  const [confirmation, setConfirmation] = useState<string>("");

  function onSubmit({ fulfilled, event }) {
    event.preventDefault();
    if (!fulfilled) {
      return;
    }
  }

  function isConfirm(input: string): Array<Condition> {
    let conditions = [
      {
        description: "Text does not match",
        fulfilled: false
      }
    ];

    if (input === "confirm") conditions[0].fulfilled = true;
    return conditions;
  }

  return (
    <Form colorScheme={colorScheme} onSubmit={onSubmit}>
      <TextInputForm
        label="Username"
        value={username}
        setValue={setUsername}
        validation={usernameValidation}
        required
        showAfter
        hideFulfilled
      />
      <TextInputForm
        label='Type "confirm"'
        value={confirmation}
        setValue={setConfirmation}
        validation={isConfirm}
        required
        showAfter
        hideFulfilled
      />
      <Button type="submit" size="md" style={{ width: "100%" }}>
        Set Admin
      </Button>
    </Form>
  );
}
