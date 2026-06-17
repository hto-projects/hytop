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
            <Title
              order={1}
              ta="center"
              mb="md"
              style={{
                fontWeight: 800,
                color: "#fff"
              }}
            >
              Meet the Team...
            </Title>
            <Text>
              Seen below (from left to right) is Sathvik, Vinny, Brian, Sophie, and Rebecca!
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
