import SignInPane from "../User/SignInPane";
import RegisterPane from "../User/RegisterPane";
import { Box } from "@mantine/core";

export enum AuthView {
  SignIn = "signin",
  Register = "register"
}

interface AuthPanelProps {
  viewing: AuthView | "";
}

const AuthPanel = ({viewing}: AuthPanelProps) => {
  const background = "#5e50b4";
  const displayedPanel = viewing || AuthView.SignIn;

  return (
    <>
      <Box
        id="auth"
        style={{
          backgroundColor: background,
          paddingTop: "3vh",
          position: "relative",
          width: "100vw",
          height: "100vh"
        }}
      >

        <Box
          style={{
            position: "relative",
            width: "100%",
            display: "flex",
            justifyContent: "space-evenly",
            zIndex: "2"
          }}
        >
          <div
            style={{
              width: "30vw"
            }}
          >
            <h2
              style={{
                fontSize: "calc(4.5vw + 2.5vh)",
                width: "auto",
                color: "white",
                marginTop: "7vh",
                marginBottom: "5px"
              }}
            >
              Welcome
            </h2>
            <p style={{ fontSize: "30px", color: "white" }}>
              to the Hyland Tech Outreach Portal (HyTOP), a place where you can
              write and host websites and Python projects
            </p>
          </div>

          <div style={{ width: "25vw" }}>
            {displayedPanel === AuthView.SignIn ? (
              <SignInPane />
            ) : (
              <RegisterPane />
            )}
          </div>
        </Box>

        <Box
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "calc(100% - 80px)",
            zIndex: 0,
            pointerEvents: "none"
          }}
        >
          <svg
            id="visual"
            preserveAspectRatio="none"
            viewBox="0 0 960 300"
            width="960"
            height="300"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            style={{
              width: "100%",
              height: "25vw"
            }}
          >
            <path
              d="M0 28L69 28L69 64L137 64L137 37L206 37L206 70L274 70L274 16L343 16L343 58L411 58L411 61L480 61L480 31L549 31L549 55L617 55L617 31L686 31L686 61L754 61L754 37L823 37L823 58L891 58L891 19L960 19L960 67L960 0L960 0L891 0L891 0L823 0L823 0L754 0L754 0L686 0L686 0L617 0L617 0L549 0L549 0L480 0L480 0L411 0L411 0L343 0L343 0L274 0L274 0L206 0L206 0L137 0L137 0L69 0L69 0L0 0Z"
              fill={background}
            ></path>
            <path
              d="M0 85L69 85L69 103L137 103L137 127L206 127L206 172L274 172L274 154L343 154L343 175L411 175L411 172L480 172L480 136L549 136L549 169L617 169L617 58L686 58L686 136L754 136L754 121L823 121L823 139L891 139L891 148L960 148L960 139L960 65L960 17L891 17L891 56L823 56L823 35L754 35L754 59L686 59L686 29L617 29L617 53L549 53L549 29L480 29L480 59L411 59L411 56L343 56L343 14L274 14L274 68L206 68L206 35L137 35L137 62L69 62L69 26L0 26Z"
              fill="#554dae"
            ></path>
            <path
              d="M0 202L69 202L69 256L137 256L137 253L206 253L206 214L274 214L274 214L343 214L343 208L411 208L411 202L480 202L480 232L549 232L549 241L617 241L617 193L686 193L686 217L754 217L754 229L823 229L823 235L891 235L891 193L960 193L960 193L960 137L960 146L891 146L891 137L823 137L823 119L754 119L754 134L686 134L686 56L617 56L617 167L549 167L549 134L480 134L480 170L411 170L411 173L343 173L343 152L274 152L274 170L206 170L206 125L137 125L137 101L69 101L69 83L0 83Z"
              fill="#4c4aa7"
            ></path>
            <path
              d="M0 262L69 262L69 277L137 277L137 262L206 262L206 274L274 274L274 241L343 241L343 238L411 238L411 250L480 250L480 268L549 268L549 259L617 259L617 232L686 232L686 268L754 268L754 277L823 277L823 265L891 265L891 244L960 244L960 235L960 191L960 191L891 191L891 233L823 233L823 227L754 227L754 215L686 215L686 191L617 191L617 239L549 239L549 230L480 230L480 200L411 200L411 206L343 206L343 212L274 212L274 212L206 212L206 251L137 251L137 254L69 254L69 200L0 200Z"
              fill="#4347a0"
            ></path>
            <path
              d="M0 301L69 301L69 301L137 301L137 301L206 301L206 301L274 301L274 301L343 301L343 301L411 301L411 301L480 301L480 301L549 301L549 301L617 301L617 301L686 301L686 301L754 301L754 301L823 301L823 301L891 301L891 301L960 301L960 301L960 233L960 242L891 242L891 263L823 263L823 275L754 275L754 266L686 266L686 230L617 230L617 257L549 257L549 266L480 266L480 248L411 248L411 236L343 236L343 239L274 239L274 272L206 272L206 260L137 260L137 275L69 275L69 260L0 260Z"
              fill="#3a4499"
            ></path>
          </svg>
        </Box>
      </Box>

      {/* transition svg */}
    </>
  );
};

export default AuthPanel;
