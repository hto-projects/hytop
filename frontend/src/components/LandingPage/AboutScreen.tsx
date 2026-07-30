import { Paper, Title, Text, Box, Image, ScrollArea } from "@mantine/core";
import teamimage from "../../assets/teamimage.jpg";
import oldteamimage from "../../assets/oldteamimage.jpg";
import styles from "./AboutScreen.module.css";

const AboutScreen = () => {
  return (
    <Box
      style={{
        height: "150vh",
        width: "100%",
        background: "#8a417a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        preserveAspectRatio: "xMinYMin slice"
      }}
      id="about"
    >
      <Box
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {/* Left Title */}
        <Box
          style={{
            flex: "0 0 22%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minWidth: "500px"
          }}
        >
          <Title
            ta="center"
            style={{
              color: "#fff",
              fontWeight: 800,
              fontSize: "clamp(2.5rem, 5vw, 5rem)"
            }}
          >
            Meet the Interns
          </Title>
        </Box>

        {/* Right Content */}
        <Box
          className={styles.invisibleScrollbar}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            paddingRight: "1rem",
            height: "90%",
            overflow: "auto"
          }}
        >
          <Paper
            // 2026
            shadow="md"
            radius="md"
            withBorder
            p="xl"
            style={{
              background: "#23272A",
              color: "#fff"
            }}
          >
            <Box
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "2rem",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <Box
                style={{
                  flex: "1 1 300px",
                  minWidth: "280px"
                }}
              >
                <Title
                  order={1}
                  style={{
                    color: "#fff",
                    fontSize: "clamp(2rem,4vw,4.5rem)"
                  }}
                >
                  2026
                </Title>

                <Text
                  mt="md"
                  style={{
                    fontSize: "clamp(1rem,1.5vw,1.5rem)",
                    lineHeight: 1.6
                  }}
                >
                  Seen below (from left to right) is Sathvik, Vinny, Brian,
                  Sophie, and Rebecca!
                </Text>
              </Box>

              <Image
                src={teamimage}
                radius="md"
                style={{
                  flex: "1 1 500px",
                  width: "100%",
                  maxWidth: "650px"
                }}
              />
            </Box>
          </Paper>

          <Paper
            // 2025
            shadow="md"
            radius="md"
            withBorder
            p="xl"
            style={{
              background: "#23272A",
              color: "#fff"
            }}
          >
            <Box
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "2rem",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <Box
                style={{
                  flex: "1 1 300px",
                  minWidth: "280px"
                }}
              >
                <Title
                  order={1}
                  style={{
                    color: "#fff",
                    fontSize: "clamp(2rem,4vw,4.5rem)"
                  }}
                >
                  2025
                </Title>

                <Text
                  mt="md"
                  style={{
                    fontSize: "clamp(1rem,1.5vw,1.4rem)",
                    lineHeight: 1.6
                  }}
                >
                  Our work is built on the foundation created by the 2025 Summer
                  Interns, and we are extremely grateful for them. Seen below
                  (from left to right) is Layla, Fernando, and Morgan!
                </Text>
              </Box>

              <Image
                src={oldteamimage}
                radius="md"
                style={{
                  flex: "1 1 500px",
                  width: "100%",
                  maxWidth: "650px"
                }}
              />
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default AboutScreen;
