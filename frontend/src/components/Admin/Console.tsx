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

  return (
    <Box
      style={{
        height: "100vh",
        width: "100vw",
        background: "#181A1B",
        color: "#fff",
        overflow: "hidden"
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: "50px",
          marginBottom: "2vh",
          marginTop: "10vh"
        }}
      >
        Admin Panel
      </h2>
      <div
        className="admin-panels"
        style={{
          width: "55%",
          display: "flex",
          gap: "25px",
          margin: "auto",
          padding: "25px"
        }}
      >
        <Paper
          shadow="md"
          p={50}
          radius="md"
          withBorder
          style={{
            flex: "1",
            background: "#23272A",
            minWidth: "0",
            color: "#fff"
          }}
        >
          <AdminPanel />
        </Paper>
        <Paper
          shadow="md"
          p={50}
          radius="md"
          withBorder
          style={{
            flex: "1",
            minWidth: "0",
            background: "#23272A",
            color: "#fff"
          }}
        >
          <AdminPromotion />
        </Paper>
      </div>
    </Box>
  );
}
