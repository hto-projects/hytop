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
      <div style={{ position: "relative", width: "100vw", height: "110vh" }}>
        <div
          className="background-icons"
          style={{
            backgroundColor: "#5e50b4",
            display: "absolute",
            inset: "0",
            width: "100%",
            height: "100%",
            zIndex: "1"
          }}
        >
          <svg
            width="800px"
            height="800px"
            viewBox="0 -15.89 87.181 87.181"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Planet" transform="translate(-355.391 -272.962)">
              <g id="Group_18" data-name="Group 18">
                <circle
                  id="Ellipse_4"
                  data-name="Ellipse 4"
                  cx="4.92"
                  cy="4.92"
                  r="4.92"
                  transform="translate(355.391 287.812) rotate(-45)"
                />
              </g>
              <g id="Group_19" data-name="Group 19">
                <path
                  id="Path_18"
                  data-name="Path 18"
                  d="M442.279,287.352c-2.261-7.09-15.761-6.48-21.731-5.85a27.744,27.744,0,0,0-47.44,15.14c-5.24,2.94-16.6,10.25-14.34,17.34,1.62,5.08,8.98,6.2,15.22,6.2a59.677,59.677,0,0,0,6.51-.37,27.7,27.7,0,0,0,47.42-15.11C433.148,301.772,444.539,294.442,442.279,287.352Zm-78.271,24.96c-.529-1.64,3.5-5.62,8.93-9.14a27.892,27.892,0,0,0,3.64,11.42C370.118,314.882,364.539,313.962,364.008,312.312Zm43.26,9.5a22.166,22.166,0,0,1-19.63-3.05,136.488,136.488,0,0,0,33.82-10.77A22.169,22.169,0,0,1,407.268,321.812Zm-4.01-12.58a134.339,134.339,0,0,1-20.5,4.76,22.284,22.284,0,0,1-3.38-6.58,22.183,22.183,0,0,1,14.4-27.89,22.173,22.173,0,0,1,23.45,6.5,2.336,2.336,0,0,1,.24.29l.039.04a22.31,22.31,0,0,1,5.2,14.91A136.28,136.28,0,0,1,403.258,309.232Zm24.85-11.07a26.83,26.83,0,0,0-1.19-5.91,27.3,27.3,0,0,0-2.439-5.51c6.449-.28,12.029.63,12.56,2.28S433.548,294.642,428.108,298.162Z"
                />
              </g>
              <g id="Group_20" data-name="Group 20">
                <path
                  id="Path_19"
                  data-name="Path 19"
                  d="M400.4,283.954"
                  stroke="#e54b50"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="5.5"
                />
              </g>
              <g id="Group_21" data-name="Group 21">
                <path
                  id="Path_20"
                  data-name="Path 20"
                  d="M416.111,299.381a2.751,2.751,0,0,1-2.59-1.825,15.278,15.278,0,0,0-4.807-6.7,2.75,2.75,0,0,1,3.463-4.274A20.791,20.791,0,0,1,418.7,295.7a2.752,2.752,0,0,1-2.59,3.677Z"
                />
              </g>
              <g id="Group_22" data-name="Group 22">
                <path
                  id="Path_21"
                  data-name="Path 21"
                  d="M402.912,287.813a2.765,2.765,0,0,1-.6-.066,15.41,15.41,0,0,0-1.972-.307,2.75,2.75,0,1,1,.494-5.478,20.862,20.862,0,0,1,2.676.417,2.75,2.75,0,0,1-.6,5.434Z"
                />
              </g>
            </g>
          </svg>
        </div>

        <Box
          style={{
            backgroundColor: "transparent",
            overflowY: "hidden",
            display: "flex",
            width: "100%",
            height: "100%",
            alignItems: "flex-start",
            boxSizing: "border-box",
            position: "absolute",
            inset: "0",
            zIndex: "2"
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
              to the Hyland Tech Outreach Portal (HyTOP), A one stop shop for
              all your web and Python development needs.
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
      </div>
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
          fill="#3058b0"
          d="M0 533L129 511L257 539L386 532L514 540L643 538L771 558L900 511L900 601L771 601L643 601L514 601L386 601L257 601L129 601L0 601Z"
        />
      </svg>
    </>
  );
};

export default LoginScreen;
