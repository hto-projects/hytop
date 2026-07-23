import { Paper, Title, Text, Box, Image, ScrollArea } from "@mantine/core";
import teamimage from "../../assets/teamimage.jpg";
import oldteamimage from "../../assets/oldteamimage.jpg";

const AboutScreen = () => {
  return (
    <Box
      style={{
        height: "100vh",
        width: "100%",
        background: "#ff0800",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        boxSizing: "border-box",
        overflow: "hidden"
      }}
    >
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "3rem",
          width: "100%",
          maxWidth: "1800px",
          height: "100%",
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
            minWidth: "220px"
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
        <ScrollArea
          style={{
            flex: 1,
            height: "90%"
          }}
        >
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
              paddingRight: "1rem"
            }}
          >
            {/* 2026 */}
            <Paper
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

            {/* 2025 */}
            <Paper
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
                    Our work is built on the foundation created by the 2025
                    Summer Interns, and we are extremely grateful for them. Seen
                    below (from left to right) is Layla, Fernando, and Morgan!
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
        </ScrollArea>
      </Box>
    </Box>
  );
};

export default AboutScreen;
