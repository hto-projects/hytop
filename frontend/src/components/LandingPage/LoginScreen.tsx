import Login from "../User/LoginComponent";
import Register from "../User/RegisterScreen";
import { Box, Button } from "@mantine/core";
import { useState } from "react";

const LoginScreen = () => {
  const [displayedPanel, setDisplayedPanel] = useState<"Login" | "Register">(
    "Login"
  );

  return (
    <>
      <Box
        style={{
          backgroundColor: "#5e50b4",
          width: "100vw",
          overflowY: "auto",
          display: "flex",
          alignItems: "flex-start",
          padding: "50px",
          paddingBottom: "15vh",
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
        {displayedPanel === "Login" ? (
          <Button
            component="a"
            href="/create-project"
            variant="transparent"
            style={{
              position: "relative",
              right: "16vw",
              top: "46.5vh"
            }}
          >
            Continue as guest
          </Button>
        ) : (
          <Button
            component="a"
            href="/create-project"
            variant="transparent"
            style={{
              position: "relative",
              right: "16vw",
              top: "72.5vh"
            }}
          >
            Continue as guest
          </Button>
        )}
      </Box>
      <svg
        id="visual"
        viewBox="0 500 900 100"
        width="100vw"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        version="1.1"
        style={{ backgroundColor: "#5e50b4" }}
      >
        <path
          fill="#BF527B"
          d="M0 533L129 511L257 539L386 532L514 540L643 538L771 558L900 511L900 601L771 601L643 601L514 601L386 601L257 601L129 601L0 601Z"
        />
      </svg>
    </>
  );
};

export default LoginScreen;
