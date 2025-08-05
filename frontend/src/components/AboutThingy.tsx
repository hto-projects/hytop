import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Group,
  Box,
  Image
} from "@mantine/core";
import { useSelector } from "react-redux";
import { useComputedColorScheme } from "@mantine/core";
import teamimage from "../assets/teamimage.jpg";

const AboutThingy = () => {
  const primaryColor = useSelector((state: any) => state.theme.primaryColor);
  const theColorSchemeish = useComputedColorScheme("light");

  return (
    <Box
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: theColorSchemeish === "dark" ? "#181A1B" : undefined,
        color: theColorSchemeish === "dark" ? "#fff" : undefined,
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
          color: theColorSchemeish === "dark" ? "#fff" : undefined
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
              background: theColorSchemeish === "dark" ? "#23272A" : "#fff",
              color: theColorSchemeish === "dark" ? "#fff" : undefined
            }}
          >
            <Title
              order={1}
              ta="center"
              mb="md"
              style={{
                fontWeight: 800,
                color: theColorSchemeish === "dark" ? "#fff" : undefined
              }}
            >
              HyTOP About Page
            </Title>
            <Text
              c={theColorSchemeish === "dark" ? undefined : "dimmed"}
              size="lg"
              ta="center"
              mb="xl"
              style={{
                color: theColorSchemeish === "dark" ? "#fff" : undefined
              }}
            >
              Welcome to the Hyland Tech Outreach Portal's About Page! Here, you
              can learn more about the team that made HyTOP and our goals. :D
            </Text>
            <Title
              order={1}
              ta="center"
              mb="md"
              style={{
                fontWeight: 800,
                color: theColorSchemeish === "dark" ? "#fff" : undefined
              }}
            >
              Meet the Team...
            </Title>
            <Text>
              Seen below (from left to right) is Layla, Fernando, and Morgan!
            </Text>
          </Paper>
          <Image src={teamimage} width={600} height={400} radius="md"></Image>
          <Paper
            shadow="md"
            p={40}
            radius="md"
            withBorder
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: theColorSchemeish === "dark" ? "#23272A" : "#fff",
              color: theColorSchemeish === "dark" ? "#fff" : undefined
            }}
          >
            <Title
              order={1}
              ta="center"
              mb="md"
              style={{
                fontWeight: 800,
                color: theColorSchemeish === "dark" ? "#fff" : undefined
              }}
            >
              Our Goals!
            </Title>
            <Text
              c={theColorSchemeish === "dark" ? undefined : "dimmed"}
              size="lg"
              ta="center"
              mb="xl"
              style={{
                color: theColorSchemeish === "dark" ? "#fff" : undefined
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

export default AboutThingy;
