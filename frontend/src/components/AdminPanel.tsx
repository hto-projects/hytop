import { useState } from "react";
import {
  Title,
  TextInput,
  Button,
  Group,
  PasswordInput,
  Box
} from "@mantine/core";
import { toast } from "react-toastify";
import Loader from "./Loader";
import { useResetPasswordMutation } from "../slices/usersApiSlice";

const AdminPanel = () => {
  const [resetUsername, setResetUsername] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");

  const [resetPasswordMutation, { isLoading }] = useResetPasswordMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (resetPassword !== resetConfirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const updateData: any = {
          username: resetUsername,
          password: resetPassword
        };
        const res = await resetPasswordMutation(updateData).unwrap();
        toast.success(`Password for ${res.username} updated successfully`);
      } catch (err: any) {
        toast.error(
          err?.data?.message || err.error || "Failed to update password"
        );
      }
    }
  };

  return (
    <div
      style={{
        flex: 1,
        minWidth: 340,
        borderLeft: "1px solid #eee",
        paddingLeft: 24
      }}
    >
      <Title order={2} ta="center" mb="md">
        Admin Panel: Reset Password for User
      </Title>
      <form onSubmit={submitHandler} style={{ width: "100%" }}>
        <TextInput
          label="Username"
          value={resetUsername}
          onChange={(e) => setResetUsername(e.target.value)}
          required
          mb="md"
          size="md"
          style={{ width: "100%" }}
        />
        <PasswordInput
          label="Password"
          value={resetPassword}
          onChange={(e) => setResetPassword(e.target.value)}
          mb="md"
          size="md"
          style={{ width: "100%" }}
        />
        <PasswordInput
          label="Confirm Password"
          value={resetConfirmPassword}
          onChange={(e) => setResetConfirmPassword(e.target.value)}
          mb="md"
          size="md"
          style={{ width: "100%" }}
        />
        <Group mt="md" justify="space-between">
          <Button type="submit" size="md" loading={isLoading}>
            Send Reset Request
          </Button>
        </Group>
        {isLoading && (
          <Box mt="md">
            <Loader />
          </Box>
        )}
      </form>
    </div>
  );
};

export default AdminPanel;
