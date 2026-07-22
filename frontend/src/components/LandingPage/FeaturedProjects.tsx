import { Box } from "@mantine/core";
import { Link } from "react-router-dom";

import { Carousel } from "@mantine/carousel";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
// DC for demo cover
import DC_3ddemo from "../../assets/3d_demo.png";

interface ProjectProps {
  name: string;
  description: string;
  authors: string[];
  link: string;
  demoCover: string;
}

// Define projects here!
const projects: ProjectProps[] = [
  {
    name: "3D Environment Demo",
    description: "A scene and moveable camera set in 3D environment.",
    authors: ["Joseph"],
    link: "https://hytop.onrender.com/e/aframe/",
    demoCover: DC_3ddemo
  },
  {
    name: "3D Environment Demo",
    description: "A scene and moveable camera set in 3D environment.",
    authors: ["Joseph"],
    link: "https://hytop.onrender.com/e/aframe/",
    demoCover: DC_3ddemo
  },
  {
    name: "3D Environment Demo",
    description: "A scene and moveable camera set in 3D environment.",
    authors: ["Joseph"],
    link: "https://hytop.onrender.com/e/aframe/",
    demoCover: DC_3ddemo
  },
  {
    name: "3D Environment Demo",
    description: "A scene and moveable camera set in 3D environment.",
    authors: ["Joseph"],
    link: "https://hytop.onrender.com/e/aframe/",
    demoCover: DC_3ddemo
  }
];

export default function FeaturedProjects() {
  return (
    <Box
      style={{
        backgroundColor: "#BF527B",
        width: "100vw",
        height: "115vh",
        paddingTop: "2vh",
        boxSizing: "border-box"
      }}
    >
      <div style={{ width: "50%", margin: "auto", textAlign: "center" }}>
        <h2 style={{ color: "white", fontSize: "70px", marginBottom: "20px" }}>
          Featured Projects
        </h2>
        <p style={{ color: "white", fontSize: "30px" }}>
          something something exceptional projects created by students on our
          platform
        </p>
      </div>
      <Carousel
        slideSize="33.333%"
        slideGap="xl"
        withIndicators
        height="50vh"
        emblaOptions={{
          loop: true,
          dragFree: true,
          align: "center"
        }}
        style={{ margin: "50px", paddingBottom: "40px" }}
      >
        {projects.map((project, i) => (
          <Carousel.Slide key={i}>
            <Project {...project} />
          </Carousel.Slide>
        ))}
      </Carousel>
    </Box>
  );
}

// A small helper to show each project
function Project({
  name,
  description,
  authors,
  link,
  demoCover
}: ProjectProps) {
  return (
    <Link to={link} style={{ textDecoration: "none", color: "white" }}>
      <Box
        style={{
          padding: "20px",
          height: "100%",
          background: "#23272A",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          flexShrink: "0"
        }}
      >
        <h2
          style={{
            whiteSpace: "nowrap",
            width: "100%",
            height: "60px",
            overflow: "hidden",
            fontSize: "40px",
            flex: "0 0 60px"
          }}
        >
          {name}
        </h2>
        <div
          style={{
            width: "100%",
            display: "flex",
            flex: "1 1 auto",
            minHeight: "0px"
          }}
        >
          <div
            style={{
              height: "100%",
              width: "50%",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <p
              style={{
                overflowY: "scroll",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                paddingBottom: "30px",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 85%, transparent 100%)",
                maskImage:
                  "linear-gradient(to bottom, black 85%, transparent 100%)",
                fontSize: "20px"
              }}
            >
              {description}
            </p>
            <p
              style={{
                marginTop: "auto",
                marginBottom: "0px",
                padding: "0px",
                height: "20px",
                flex: "0 0 20px"
              }}
            >
              {authors.join(", ")}
            </p>
          </div>
          <img
            style={{
              width: "50%",
              borderRadius: "10px"
            }}
            src={demoCover}
          />
        </div>
      </Box>
    </Link>
  );
}
