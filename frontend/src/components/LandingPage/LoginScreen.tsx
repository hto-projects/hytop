import Login from "../User/LoginComponent";
import Register from "../User/RegisterScreen";
import { Box } from "@mantine/core";
import { useState } from "react";

const LoginScreen = () => {
  const [displayedPanel, setDisplayedPanel] = useState<"Login" | "Register">(
    "Login"
  );

  console.log(displayedPanel);

  return (
    <Box
      style={{
        backgroundColor: "#5e50b4",
        width: "100vw",
        overflowY: "auto",
        display: "flex",
        alignItems: "flex-start",
        padding: "50px",
        paddingBottom: "35vh",
        boxSizing: "border-box"
      }}
    >
      <div
        style={{
          paddingTop: "12.5vh",
          marginLeft: "12.5vw",
          width: "30vw"
        }}
      >
        <h2
          style={{
            fontSize: "calc(4.5vw + 2.5vh)",
            width: "auto",
            color: "white",
            paddingBottom: "5px"
          }}
        >
          Welcome
        </h2>
        <p style={{ fontSize: "30px", color: "white" }}>
          to the Hyland Tech Outreach Portal (HyTOP), A one stop shop for all
          your web and Python development needs.
        </p>
      </div>

      <div style={{ width: "25vw", marginLeft: "15vw", height: "90vh" }}>
        {displayedPanel === "Login" ? (
          <Login setDisplayedPanel={setDisplayedPanel} />
        ) : (
          <Register setDisplayedPanel={setDisplayedPanel} />
        )}
      </div>
    </Box>
  );
};

export default LoginScreen;
