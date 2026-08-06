import Login from "../User/LoginComponent";
import Register from "../User/RegisterScreen";
import { Box } from "@mantine/core";
import { useEffect, useState } from "react";

const LoginScreen = () => {
  const svgYellow = "#d1c347";
  const background = "#5e50b4";
  const [displayedPanel, setDisplayedPanel] = useState<"Login" | "Register">(
    "Register"
  );

  return (
    <>
      <Box
        style={{
          backgroundColor: background,
          paddingTop: "3vh",
          position: "relative",
          width: "100vw",
          height: "120vh"
        }}
        id="register"
      >
        <div
          className="background-svgs"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: "1"
          }}
        >
          {/* post poning this for later its not worth it... */}
          {/* <div */}
          {/*   // planet */}
          {/*   style={{ */}
          {/*     position: "absolute", */}
          {/*     width: "35vw", */}
          {/*     height: "auto", */}
          {/*     left: "4vw", */}
          {/*     top: "33vh" */}
          {/*   }} */}
          {/* > */}
          {/*   <svg */}
          {/*     fill={"#c2941f"} */}
          {/*     width="100%" */}
          {/*     viewBox="0 -15.89 87.181 87.181" */}
          {/*     xmlns="http://www.w3.org/2000/svg" */}
          {/*   > */}
          {/*     <g id="Planet" transform="translate(-355.391 -272.962)"> */}
          {/*       <g id="Group_18" data-name="Group 18"> */}
          {/*         <circle */}
          {/*           id="Ellipse_4" */}
          {/*           data-name="Ellipse 4" */}
          {/*           cx="4.92" */}
          {/*           cy="4.92" */}
          {/*           r="4.92" */}
          {/*           transform="translate(355.391 287.812) rotate(-45)" */}
          {/*         /> */}
          {/*       </g> */}
          {/*       <g id="Group_19" data-name="Group 19"> */}
          {/*         <path */}
          {/*           id="Path_18" */}
          {/*           data-name="Path 18" */}
          {/*           d="M442.279,287.352c-2.261-7.09-15.761-6.48-21.731-5.85a27.744,27.744,0,0,0-47.44,15.14c-5.24,2.94-16.6,10.25-14.34,17.34,1.62,5.08,8.98,6.2,15.22,6.2a59.677,59.677,0,0,0,6.51-.37,27.7,27.7,0,0,0,47.42-15.11C433.148,301.772,444.539,294.442,442.279,287.352Zm-78.271,24.96c-.529-1.64,3.5-5.62,8.93-9.14a27.892,27.892,0,0,0,3.64,11.42C370.118,314.882,364.539,313.962,364.008,312.312Zm43.26,9.5a22.166,22.166,0,0,1-19.63-3.05,136.488,136.488,0,0,0,33.82-10.77A22.169,22.169,0,0,1,407.268,321.812Zm-4.01-12.58a134.339,134.339,0,0,1-20.5,4.76,22.284,22.284,0,0,1-3.38-6.58,22.183,22.183,0,0,1,14.4-27.89,22.173,22.173,0,0,1,23.45,6.5,2.336,2.336,0,0,1,.24.29l.039.04a22.31,22.31,0,0,1,5.2,14.91A136.28,136.28,0,0,1,403.258,309.232Zm24.85-11.07a26.83,26.83,0,0,0-1.19-5.91,27.3,27.3,0,0,0-2.439-5.51c6.449-.28,12.029.63,12.56,2.28S433.548,294.642,428.108,298.162Z" */}
          {/*         /> */}
          {/*       </g> */}
          {/*       <g id="Group_20" data-name="Group 20"> */}
          {/*         <path */}
          {/*           id="Path_19" */}
          {/*           data-name="Path 19" */}
          {/*           d="M400.4,283.954" */}
          {/*           stroke="#e54b50" */}
          {/*           strokeLinecap="round" */}
          {/*           strokeLinejoin="round" */}
          {/*           strokeWidth="5.5" */}
          {/*         /> */}
          {/*       </g> */}
          {/*       <g id="Group_21" data-name="Group 21"> */}
          {/*         <path */}
          {/*           id="Path_20" */}
          {/*           data-name="Path 20" */}
          {/*           d="M416.111,299.381a2.751,2.751,0,0,1-2.59-1.825,15.278,15.278,0,0,0-4.807-6.7,2.75,2.75,0,0,1,3.463-4.274A20.791,20.791,0,0,1,418.7,295.7a2.752,2.752,0,0,1-2.59,3.677Z" */}
          {/*         /> */}
          {/*       </g> */}
          {/*       <g id="Group_22" data-name="Group 22"> */}
          {/*         <path */}
          {/*           id="Path_21" */}
          {/*           data-name="Path 21" */}
          {/*           d="M402.912,287.813a2.765,2.765,0,0,1-.6-.066,15.41,15.41,0,0,0-1.972-.307,2.75,2.75,0,1,1,.494-5.478,20.862,20.862,0,0,1,2.676.417,2.75,2.75,0,0,1-.6,5.434Z" */}
          {/*         /> */}
          {/*       </g> */}
          {/*     </g> */}
          {/*   </svg> */}
          {/* </div> */}
        </div>

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
              to the Hyland Tech Outreach Portal (HyTOP), a place where you can write and host websites and Python projects
            </p>
          </div>

          <div style={{ width: "25vw" }}>
            {displayedPanel === "Login" ? (
              <Login setDisplayedPanel={setDisplayedPanel} />
            ) : (
              <Register setDisplayedPanel={setDisplayedPanel} />
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

export default LoginScreen;
