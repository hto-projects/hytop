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
      <Container
        size={600}
        my={80}
        style={{
          background: "transparent",
          color: "#fff"
        }}
      >
        <Group align="center" mt="md">
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
              HyTOP About Page
            </Title>
            <Text
              size="lg"
              ta="center"
              mb="xl"
              style={{
                color: "#fff"
              }}
            >
              Welcome to the Hyland Tech Outreach Portal's About Page! Here, you
              can learn more about the team that made HyTOP and our goals. :D
            </Text>
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
              Our Goals!
            </Title>
            <Text
              size="lg"
              ta="center"
              mb="xl"
              style={{
                color: "#fff"
              }}
            >
              The main mission of the HyTOP team is making an accessible way to
              code and host websites for Hyland's Tech Outreach Team and their
              different programs, like the Hy-tech Club. We want to encourage
              learning, creativity, and (importantly!) making fun websites using
              HyTOP as the medium. We hope you enjoy and have fun using HyTOP!
            </Text>
          </Paper>
        </Group>
      </Container>
    </Box>
  );
};

export default AboutScreen;
