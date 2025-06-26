import { Container, Paper, Title, Text, Button, Group } from "@mantine/core";

const Hero = () => {
  return (
    <Container size={600} my={80}>
      <Paper
        shadow="md"
        p={40}
        radius="md"
        withBorder
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "#fff"
        }}
      >
        <Title order={1} ta="center" mb="md" style={{ fontWeight: 800 }}>
          HyTOP
        </Title>
        <Text c="dimmed" size="lg" ta="center" mb="xl">
          Welcome to the Hyland Tech Outreach Portal. Here, you can build and
          host your own websites.
        </Text>
        <Group align="center" mt="md">
          <Button
            size="md"
            color="blueButCooler"
            radius="md"
            component="a"
            href="/create-project"
            style={{
              fontWeight: 600,
              fontSize: 18,
              paddingLeft: 32,
              paddingRight: 32
            }}
          >
            Create Project
          </Button>
          <Button
            size="md"
            color="blueButCooler"
            radius="md"
            component="a"
            href="/register-screen"
            style={{
              fontWeight: 600,
              fontSize: 18,
              paddingLeft: 32,
              paddingRight: 32
            }}
          >
            Sign up Here
          </Button>
        </Group>
      </Paper>
    </Container>
  );
};

export default Hero;
