import {
  emptyValidation,
  passwordValidation,
  Form,
  PasswordInputForm,
  TextInputForm
} from "../Interface/Form";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Title, Button, Group, Box, MantineColorScheme } from "@mantine/core";
import { toast } from "react-toastify";
import Loader from "../Interface/Loader";
import { useResetPasswordMutation } from "../../slices/usersApiSlice";

interface AdminPanelProps {
  colorScheme: MantineColorScheme;
}

const AdminPanel = ({ colorScheme }: AdminPanelProps) => {
  const { userInfo } = useSelector((state: any) => state.auth);
  const userIsAdmin = userInfo?.admin || false;
  const navigate = useNavigate();

  useEffect(() => {
    if (!userIsAdmin) {
      alert!("You are not an admin! Go away!");
      navigate("/");
    }
  }, [userIsAdmin, navigate]);

  const [resetUsername, setResetUsername] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const passwordsMatch =
    resetPassword === resetConfirmPassword &&
    resetPassword !== "" &&
    resetConfirmPassword !== "";

  const [resetPasswordMutation, { isLoading }] = useResetPasswordMutation();

  async function onSubmit({ fulfilled, event }) {
    event.preventDefault();
    if (!fulfilled) {
      toast.error("missing field");
      return;
    }

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

  return (
    <div
      style={{
        flex: 1,
        minWidth: 340,
        paddingLeft: 24
      }}
    >
      <Title order={2} ta="center" mb="md">
        Reset Password for User
      </Title>
      <Form
        colorScheme={colorScheme}
        customConditions={() => {
          if (resetPassword === resetConfirmPassword) return true;
          return false;
        }}
        onSubmit={onSubmit}
      >
        {/* intentionally holds no validation in case of accounts created prior to standardized form validation */}
        <TextInputForm
          label="Username"
          value={resetUsername}
          setValue={setResetUsername}
          validation={emptyValidation}
          required
        />
        <PasswordInputForm
          label="Password"
          value={resetPassword}
          setValue={setResetPassword}
          validation={passwordValidation}
          required
          showAfter
          hideCompleted
        />
        <PasswordInputForm
          label="Confirm Password"
          value={resetConfirmPassword}
          setValue={setResetConfirmPassword}
          required
        />
        <Group mt="md" justify="space-between">
          <Button
            type="submit"
            size="md"
            loading={isLoading}
            disabled={!passwordsMatch}
          >
            Send Reset Request
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
};

export default AdminPanel;
