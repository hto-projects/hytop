import { Box, Container, Paper, useComputedColorScheme } from "@mantine/core";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AdminPanel from "./AdminPanel";
import AdminPromotion from "./AdminPromotion";

export default function AdminPage() {
  const { userInfo } = useSelector((state: any) => state.auth);
  const userIsAdmin = userInfo?.admin || false;
  const navigate = useNavigate();

  useEffect(() => {
    if (!userIsAdmin) {
      alert!("You are not an admin! Go away!");
      navigate("/");
    }
  }, []);

  const theColorScheme = useComputedColorScheme("dark");

  return (
    <Box
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: theColorScheme === "dark" ? "#181A1B" : undefined,
        color: theColorScheme === "dark" ? "#fff" : undefined,
        display: "flex",
        justifyContent: "center",
        overflow: "auto"
      }}
    >
      <Container size={800} my={40}>
        <Paper
          shadow="md"
          p={48}
          radius="md"
          withBorder
          style={{
            width: "100%",
            display: "flex",
            gap: 48,
            background: theColorScheme === "dark" ? "#23272A" : undefined,
            color: theColorScheme === "dark" ? "#fff" : undefined
          }}
        >
          <AdminPanel colorScheme={theColorScheme} />
        </Paper>
      </Container>
      <Container size={800} my={40}>
        <Paper
          shadow="md"
          p={48}
          radius="md"
          withBorder
          style={{
            width: "100%",
            display: "flex",
            gap: 48,
            background: theColorScheme === "dark" ? "#23272A" : undefined,
            color: theColorScheme === "dark" ? "#fff" : undefined
          }}
        >
          <AdminPromotion colorScheme={theColorScheme} />
        </Paper>
      </Container>
    </Box>
  );
}
