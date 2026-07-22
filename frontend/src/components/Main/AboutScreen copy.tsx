import {
  Container,
  Paper,
  Title,
  Text,
  Group,
  Box,
  Image
} from "@mantine/core";
import teamimage from "../../assets/teamimage.jpg";
import oldteamimage from "../../assets/oldteamimage.jpg";

const AboutScreen = () => {
  return (
    <Box
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "#181A1B",
        color: "#fff",
        alignItems: "center",
        justifyContent: "center",
        overflow: "auto"
      }}
    >
          <Paper
            shadow="md"
            p={40}
            radius="md"
            withBorder
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: "#23272A",
              color: "#fff"
            }}
          >
            <Title
              order={1}
              ta="center"
              mb="md"
              style={{
                fontWeight: 800,
                color: "#fff"
              }}
            >
              Meet the 2026 Summer Interns...
            </Title>
            <Text
              style={{
                marginBottom: 20
              }}
            >
              Seen below (from left to right) is Sathvik, Vinny, Brian, Sophie,
              and Rebecca!
            </Text>
            <Image src={teamimage} width={600} height={300} radius="md"></Image>
          </Paper>

          <Paper
            shadow="md"
            p={40}
            radius="md"
            withBorder
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: "#23272A",
              color: "#fff"
            }}
          >
            <Title
              order={1}
              ta="center"
              mb="md"
              style={{
                fontWeight: 800,
                color: "#fff"
              }}
            >
              2025 Summer Interns
            </Title>
            <Text
              style={{
                marginBottom: 20
              }}
            >
              Our work is built on the foundation created by the 2025 Summer
              Interns, and we are extremely grateful for them. Seen below (from
              left to right) is Layla, Fernando, and Morgan!
            </Text>
            <Image
              src={oldteamimage}
              width={600}
              height={300}
              radius="md"
            ></Image>
          </Paper>
    </Box>
  );
};

export default AboutScreen;
