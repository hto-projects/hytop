import { Container, Paper, Title, Text, Button, Group } from "@mantine/core";
import { useSelector } from "react-redux";

const Hero = () => {
  const primaryColor = useSelector((state: any) => state.theme.primaryColor);
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
            color={primaryColor}
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
        </Group>
      </Paper>
    </Container>
  );
};

export default Hero;
