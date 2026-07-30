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
    <div style={{ height: "125vh" }}>
      <Box
        style={{
          backgroundColor: "#3a4499",
          width: "100vw",
          height: "80%",
          paddingTop: "20vh",
          boxSizing: "border-box"
        }}
        id="featuredprojects"
      >
        <div style={{ width: "50%", margin: "auto", textAlign: "center" }}>
          <h2
            style={{ color: "white", fontSize: "70px", marginBottom: "20px" }}
          >
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

      <div style={{ height: "20%", backgroundColor: "#3a4499" }}>
        <svg
          id="visual"
          viewBox="0 400 900 600"
          width="100vw"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 408L129 438L257 470L386 450L514 439L643 491L771 443L900 408L900 601L771 601L643 601L514 601L386 601L257 601L129 601L0 601Z"
            fill="#3a4499"
          ></path>
          <path
            d="M0 435L129 440L257 490L386 424L514 442L643 409L771 454L900 476L900 601L771 601L643 601L514 601L386 601L257 601L129 601L0 601Z"
            fill="#504295"
          ></path>
          <path
            d="M0 455L129 482L257 431L386 516L514 442L643 468L771 467L900 511L900 601L771 601L643 601L514 601L386 601L257 601L129 601L0 601Z"
            fill="#614190"
          ></path>
          <path
            d="M0 512L129 530L257 484L386 537L514 540L643 510L771 521L900 524L900 601L771 601L643 601L514 601L386 601L257 601L129 601L0 601Z"
            fill="#6e408b"
          ></path>
          <path
            d="M0 552L129 560L257 522L386 541L514 509L643 539L771 539L900 495L900 601L771 601L643 601L514 601L386 601L257 601L129 601L0 601Z"
            fill="#794085"
          ></path>
          <path
            d="M0 564L129 569L257 540L386 566L514 545L643 568L771 548L900 521L900 601L771 601L643 601L514 601L386 601L257 601L129 601L0 601Z"
            fill="#824080"
          ></path>
          <path
            d="M0 581L129 552L257 559L386 578L514 551L643 546L771 557L900 589L900 601L771 601L643 601L514 601L386 601L257 601L129 601L0 601Z"
            fill="#8a417a"
          ></path>
        </svg>
      </div>
    </div>
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
