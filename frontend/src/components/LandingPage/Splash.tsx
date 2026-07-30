import { useEffect } from "react";
import { Box } from "@mantine/core";
import Logo from "../Interface/Logo";

import "../LandingPage/background.css";
import { generateStars } from "../LandingPage/background";

export default function Splash() {
  useEffect(() => {
    generateStars();
  });

  return (
    <Box
      id="splash"
      style={{
        backgroundColor: "#000000",
        width: "100%",
        contain: "paint",
        padding: "0",
        margin: "0",
        boxSizing: "border-box"
      }}
    >
      <span id="stars-close"></span>
      <span id="stars-mid"></span>
      <span id="stars-far"></span>

      <Box
        style={{
          // @DOC:CSS{calculated css value} NOTE THAT the header is 25px tall, for this to fit the remaining portion
          // we need it to be 100vh minus 25px.
          height: "calc(80vh)",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Logo style={{ marginTop: "10vh" }} svgPath="/logo.svg" height={700} />
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
          d="M0 67L16 68.8C32 70.7 64 74.3 96 77.8C128 81.3 160 84.7 192 87.7C224 90.7 256 93.3 288 91.8C320 90.3 352 84.7 384 86.8C416 89 448 99 480 104.7C512 110.3 544 111.7 576 110C608 108.3 640 103.7 672 101.7C704 99.7 736 100.3 768 98C800 95.7 832 90.3 864 82.3C896 74.3 928 63.7 944 58.3L960 53L960 301L944 301C928 301 896 301 864 301C832 301 800 301 768 301C736 301 704 301 672 301C640 301 608 301 576 301C544 301 512 301 480 301C448 301 416 301 384 301C352 301 320 301 288 301C256 301 224 301 192 301C160 301 128 301 96 301C64 301 32 301 16 301L0 301Z"
          fill="#0c0b13"
        ></path>
        <path
          d="M0 179L16 178.3C32 177.7 64 176.3 96 173.3C128 170.3 160 165.7 192 161.8C224 158 256 155 288 159.3C320 163.7 352 175.3 384 171.8C416 168.3 448 149.7 480 149.3C512 149 544 167 576 175.5C608 184 640 183 672 180.5C704 178 736 174 768 168.2C800 162.3 832 154.7 864 155.5C896 156.3 928 165.7 944 170.3L960 175L960 301L944 301C928 301 896 301 864 301C832 301 800 301 768 301C736 301 704 301 672 301C640 301 608 301 576 301C544 301 512 301 480 301C448 301 416 301 384 301C352 301 320 301 288 301C256 301 224 301 192 301C160 301 128 301 96 301C64 301 32 301 16 301L0 301Z"
          fill="#312e5f"
        ></path>
        <path
          d="M0 225L16 229.5C32 234 64 243 96 245.2C128 247.3 160 242.7 192 241.5C224 240.3 256 242.7 288 243.2C320 243.7 352 242.3 384 235.7C416 229 448 217 480 211C512 205 544 205 576 207.7C608 210.3 640 215.7 672 216.8C704 218 736 215 768 219.2C800 223.3 832 234.7 864 234.7C896 234.7 928 223.3 944 217.7L960 212L960 301L944 301C928 301 896 301 864 301C832 301 800 301 768 301C736 301 704 301 672 301C640 301 608 301 576 301C544 301 512 301 480 301C448 301 416 301 384 301C352 301 320 301 288 301C256 301 224 301 192 301C160 301 128 301 96 301C64 301 32 301 16 301L0 301Z"
          fill="#5e50b4"
        ></path>
      </svg>
    </Box>
  );
}
