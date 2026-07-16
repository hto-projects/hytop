import { usePromoteAdminMutation } from "../../slices/usersApiSlice";
import {
  Form,
  TextInputForm,
  usernameValidation,
  Condition
} from "../Interface/Form";
import Loader from "../Interface/Loader";
import { MantineColorScheme, Button, Title, Group, Box } from "@mantine/core";
import { useState } from "react";
import { toast } from "react-toastify";

interface AdminPromotionProps {
  colorScheme: MantineColorScheme;
}

export default function AdminPromotion({ colorScheme }: AdminPromotionProps) {
  const [username, setUsername] = useState<string>("");
  const [confirmation, setConfirmation] = useState<string>("");

  const [promoteAdminMutation, { isLoading }] = usePromoteAdminMutation();

  async function onSubmit({ fulfilled, event }) {
    event.preventDefault();
    if (!fulfilled) {
      return;
    }

    try {
      const res = await promoteAdminMutation({ username }).unwrap();
      toast.success(`admin field for ${res.username} has been set to true`);
    } catch (e) {
      toast.error(e?.data?.message || e.error || "Failed to give admin status");
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
    <div>
      <Title order={2} ta="center" mb="md">
        Promote user to Admin
      </Title>
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

        <Group mt="md" justify="space-between">
          <Button
            type="submit"
            size="md"
            style={{ width: "100%" }}
            disabled={confirmation !== "confirm"}
          >
            Set Admin
          </Button>
        </Group>
        {isLoading && (
          <Box mt="md">
            <Loader />
          </Box>
        )}
      </Form>
    </div>
  );
}
