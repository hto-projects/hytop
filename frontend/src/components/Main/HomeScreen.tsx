import {
  Container,
  Paper,
  Text,
  Button,
  Group,
  Box
} from "@mantine/core";
import Logo from "../Interface/Logo";

const HomeScreen = () => {
  return (
    <Box
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "#181A1B",
        color: "#fff",
        display: "flex",
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
          <div style={{ marginBottom: "1rem" }}>
            <Logo
              svgPath="/logo.svg"
              height="20em"
              style={{ marginBottom: "0.5rem" }}
            />
          </div>
          <Text
            size="lg"
            ta="center"
            mb="xl"
            style={{
              color: "#fff"
            }}
          >
            Welcome to the Hyland Tech Outreach Portal. Here, you can build and
            host your own websites.
          </Text>
          <Group align="center" mt="md">
            <Button
              size="md"
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

export default HomeScreen;
