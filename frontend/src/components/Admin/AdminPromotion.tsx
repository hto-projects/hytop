import { usePromoteAdminMutation } from "../../slices/usersApiSlice";
import {
  Form,
  TextInputForm,
  DropdownForm,
  usernameValidation,
  Condition
} from "../Interface/Form";
import Loader from "../Interface/Loader";
import { MantineColorScheme, Button, Title, Group, Box } from "@mantine/core";
import { useState } from "react";
import { toast } from "react-toastify";

export default function AdminPromotion() {
  const [username, setUsername] = useState<string>("");
  const [confirmation, setConfirmation] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const isAdmin = role.toLowerCase() === "admin" ? true : false;

  const [promoteAdminMutation, { isLoading }] = usePromoteAdminMutation();

  async function onSubmit({ fulfilled, event }) {
    event.preventDefault();
    if (!fulfilled) {
      return;
    }

    try {
      const res: { username: string; isAdmin: boolean } =
        await promoteAdminMutation({ username, isAdmin }).unwrap();

      toast.success(
        `admin field for ${res.username} has been set to ${res.isAdmin}`
      );
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
    <div style={{ width: "20vw" }}>
      <Title order={2} ta="center" mb="md">
        Change Role of User
      </Title>
      <Form colorScheme={"dark"} onSubmit={onSubmit}>
        <TextInputForm
          label="Username"
          value={username}
          setValue={setUsername}
          validation={usernameValidation}
          required
          showAfter
          hideFulfilled
        />
        <DropdownForm
          label="Role"
          placeholder="Select role"
          options={["User", "Admin"]}
          value={role}
          setValue={setRole}
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
            Change role
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
