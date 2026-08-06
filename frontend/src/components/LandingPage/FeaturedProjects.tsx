import { Box } from "@mantine/core";
import { Link } from "react-router-dom";

import { Carousel } from "@mantine/carousel";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
// DC for demo cover
import DC_3ddemo from "../../assets/3d_demo.png";
import threejs from "../../assets/ThreeJs.png";
import p5cube from "../../assets/P5Cube.png";
import tvchars from "../../assets/TvCharacters.png"

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
    name: "Three.js Blank Game",
    description: "A very basic 3D game.",
    authors: ["Joseph"],
    link: "https://hytop.onrender.com/pf/three-js-blank-game-1/",
    demoCover: threejs
  },
  {
    name: "P5.js Cube Image",
    description: "A rotating cube with an image and background.",
    authors: ["Joseph"],
    link: "https://hytop.onrender.com/e/p5-cube-image/",
    demoCover: p5cube
  },
  {
    name: "TV Characters",
    description: "Pictures of TV Characters from an API.",
    authors: ["Joseph"],
    link: "https://hytop.onrender.com/e/tv-characters/",
    demoCover: tvchars
  },
  {
    name: "A-Frame 3D Environment",
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
        paddingTop: "45vh",
        backgroundColor: "#3a4499",
        minHeight: "calc(100vh - 25px)"
      }}
    >
      <Box
        style={{
          position: "relative",
          zIndex: 3,
          width: "100vw",
          height: "67vh"
        }}
        id="featuredprojects"
      >
        <div
          style={{
            width: "50%",
            margin: "auto",
            textAlign: "center"
          }}
        >
          <h2
            style={{
              color: "white",
              fontSize: "70px",
              marginBottom: "20px"
            }}
          >
            Featured Projects
          </h2>
          <p style={{ color: "white", fontSize: "30px" }}>
            explore the possibilities of HyTOP with these projects created by our students and instructors
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

      <svg
        id="visual"
        viewBox="0 0 960 300"
        width="960"
        height="300"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        style={{
          width: "100%",
          height: "auto"
        }}
      >
        <path
          d="M0 62L137 51L274 115L411 118L549 50L686 63L823 81L960 67L960 301L823 301L686 301L549 301L411 301L274 301L137 301L0 301Z"
          fill="#3a4499"
        ></path>
        <path
          d="M0 135L137 127L274 145L411 104L549 142L686 104L823 84L960 143L960 301L823 301L686 301L549 301L411 301L274 301L137 301L0 301Z"
          fill="#504295"
        ></path>
        <path
          d="M0 182L137 117L274 135L411 176L549 163L686 152L823 184L960 124L960 301L823 301L686 301L549 301L411 301L274 301L137 301L0 301Z"
          fill="#614190"
        ></path>
        <path
          d="M0 201L137 150L274 207L411 152L549 206L686 166L823 166L960 209L960 301L823 301L686 301L549 301L411 301L274 301L137 301L0 301Z"
          fill="#6e408b"
        ></path>
        <path
          d="M0 215L137 205L274 205L411 210L549 198L686 194L823 210L960 191L960 301L823 301L686 301L549 301L411 301L274 301L137 301L0 301Z"
          fill="#794085"
        ></path>
        <path
          d="M0 240L137 257L274 234L411 227L549 235L686 244L823 235L960 244L960 301L823 301L686 301L549 301L411 301L274 301L137 301L0 301Z"
          fill="#824080"
        ></path>
        <path
          d="M0 277L137 251L274 246L411 268L549 245L686 280L823 266L960 264L960 301L823 301L686 301L549 301L411 301L274 301L137 301L0 301Z"
          fill="#8a417a"
        ></path>
      </svg>
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
    <Link to={link} style={{ textDecoration: "none", color: "white" }} target="_blank" rel="noopener noreferrer">
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
              borderRadius: "10px",
              objectFit: "cover"
            }}
            src={demoCover}
          />
        </div>
      </Box>
    </Link>
  );
}
