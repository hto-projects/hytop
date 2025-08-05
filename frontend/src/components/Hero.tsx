import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Group,
  Box
} from "@mantine/core";
import { useSelector } from "react-redux";
import { useComputedColorScheme } from "@mantine/core";

const Hero = () => {
  const primaryColor = useSelector((state: any) => state.theme.primaryColor);
  const theColorSchemeish = useComputedColorScheme("light");
  return (
    <Box
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: theColorSchemeish === "dark" ? "#181A1B" : undefined,
        color: theColorSchemeish === "dark" ? "#fff" : undefined,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
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
            HyTOP
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
            Welcome to the Hyland Tech Outreach Portal. Here, you can build and
            host your own websites.
          </Text>
          <Group align="center" mt="md">
            <Button
              size="md"
              color={primaryColor}
              radius="md"
              component="a"
              href="/create-project"
              style={{
                fontWeight: 600,
                fontSize: 18,
                paddingLeft: 16,
                paddingRight: 16
              }}
            >
              Create Project
            </Button>
            <Button
              size="md"
              color={primaryColor}
              radius="md"
              component="a"
              href="/register"
              style={{
                fontWeight: 600,
                fontSize: 18,
                paddingLeft: 32,
                paddingRight: 32
              }}
            >
              Sign up
            </Button>
            <Button
              size="md"
              color={primaryColor}
              radius="md"
              component="a"
              href="/about"
              style={{
                fontWeight: 600,
                fontSize: 18,
                paddingLeft: 32,
                paddingRight: 32
              }}
            >
              About Page
            </Button>
          </Group>
        </Paper>
      </Container>
    </Box>
  );
};

export default Hero;
