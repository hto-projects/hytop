import {
  Container,
  Paper,
  Title,
  Text,
  Group,
  Box,
  Image,
  ScrollArea
} from "@mantine/core";
import teamimage from "../../assets/teamimage.jpg";
import oldteamimage from "../../assets/oldteamimage.jpg";

const AboutScreen = () => {
  return (
    <Box
      style={{
        height: "100vh",
        width: "100vw",
        background: "#ff0800",
        color: "#fff",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        overflow: "auto"
      }}
    >
      <Title
        ta="right"
        mb="md"
        style={{
          fontWeight: 800,
          color: "#fff",
          marginLeft: "3vw",
          fontSize: "75px"
        }}
      >
        Meet the Interns
      </Title>
      <ScrollArea>
        <Box
          style={{
            height: "80vh",
            width: "60vw",
            background: "#0e0707",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            overflow: "auto",
            marginLeft: "auto",
            marginRight: "2vw",
            marginBottom: "5vh"
          }}
        >
          <Paper
            shadow="md"
            p={40}
            radius="md"
            withBorder
            style={{
              display: "flex",
              width: "57vw",
              justifyContent: "flex-end",
              height: "35vh",
              marginRight: "auto",
              marginLeft: "auto",
              flexDirection: "row",
              alignItems: "center",
              background: "#23272A",
              color: "#fff"
            }}
          >
            <Title
              ta="center"
              mb="md"
              mt={0}
              pt={0}
              style={{
                fontWeight: 800,
                color: "#ffffff",
                fontSize: "70px",
                marginLeft: "Auto",
                flexDirection: "row",
                position: "relative",
                top: "-10vh",
                left: "15vw"
              }}
            >
              2026
            </Title>
            <Text
              ta="center"
              style={{
                marginBottom: 20,
                flexDirection: "row",
                marginRight: "1vw",
                position: "relative",
                left: "-2vw",
                top: "4.5vh",
                fontSize: "30px",
                flexShrink: 0,
                width: "25vw",
                fontWeight: 450
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
              width: "57vw",
              height: "35vh",
              flexDirection: "row",
              alignItems: "center",
              background: "#23272A",
              color: "#fff",
              marginTop: "4vh",
              marginBottom: "3vh"
            }}
          >
            <Title
              ta="center"
              mb="md"
              mt={0}
              pt={0}
              style={{
                fontWeight: 800,
                color: "#ffffff",
                fontSize: "70px",
                marginLeft: "Auto",
                flexDirection: "row",
                position: "relative",
                top: "-10vh",
                left: "9vw"
              }}
            >
              2025
            </Title>
            <Text
              ta = "center"
              style={{
                marginBottom: 20,
                marginRight: "-5vw",
                flexDirection: "row",
                position: "relative",
                left: "-8vw",
                top: "6vh",
                fontSize: "25px",
                flexShrink: 0,
                width: "25vw",
                fontWeight: 450
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
      </ScrollArea>
    </Box>
  );
};

export default AboutScreen;
