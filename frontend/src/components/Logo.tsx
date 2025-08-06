import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useComputedColorScheme } from "@mantine/core";

const hexToHsl = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

interface LogoProps {
  height?: string | number;
  className?: string;
  svgPath: string;
  style?: CSSProperties;
}

const Logo: React.FC<LogoProps> = ({
  height = "20em",
  className = "",
  svgPath,
  style = {}
}) => {
  const primaryColor = useSelector((state: any) => state.theme.primaryColor);
  const isDark = useComputedColorScheme("light") === "dark";
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewBox, setViewBox] = useState<string>("0 0 1000 1000");

  useEffect(() => {
    setLoading(true);
    fetch(svgPath)
      .then((response) => response.text())
      .then((data) => {
        setSvgContent(data);

        const viewBoxMatch = data.match(/viewBox=["']([^"']*)["']/);
        if (viewBoxMatch && viewBoxMatch[1]) {
          setViewBox(viewBoxMatch[1]);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching SVG:", error);
        setLoading(false);
      });
  }, [svgPath]);

  const generateSecondaryColor = (primary: string): string => {
    const hsl = hexToHsl(primary);
    let newHue: number;
    let newSaturation: number;
    let newLightness: number;

    const tealHue = 165;

    if (Math.abs(hsl.h - tealHue) < 30) {
      newHue = (hsl.h + 150) % 360;
    } else if (hsl.h >= 180 && hsl.h <= 270) {
      newHue = (hsl.h + 50) % 360;
    } else if (hsl.h >= 0 && hsl.h <= 30) {
      newHue = tealHue;
    } else if (hsl.h >= 40 && hsl.h <= 70) {
      newHue = 185;
    } else {
      newHue = (hsl.h + 90) % 360;
    }

    if (hsl.s < 40) {
      newSaturation = Math.min(100, hsl.s + 40);
    } else if (hsl.s > 80) {
      newSaturation = Math.max(50, hsl.s - 20);
    } else {
      newSaturation = Math.min(90, hsl.s + 10);
    }

    if (isDark) {
      if (hsl.l < 40) {
        newLightness = Math.min(85, hsl.l + 35);
      } else if (hsl.l > 70) {
        newLightness = Math.min(90, Math.max(65, hsl.l + 5));
      } else {
        newLightness = Math.min(80, hsl.l + 20);
      }
    } else {
      if (hsl.l < 30) {
        newLightness = Math.min(80, hsl.l + 25);
      } else if (hsl.l > 80) {
        newLightness = Math.max(40, hsl.l - 35);
      } else if (hsl.l > 60) {
        newLightness = Math.max(45, hsl.l - 20);
      } else {
        newLightness = Math.min(70, Math.max(45, hsl.l + 10));
      }
    }

    return `hsl(${newHue}, ${newSaturation}%, ${newLightness}%)`;
  };

  const getColorStyle = (): CSSProperties => {
    const hsl = hexToHsl(primaryColor);
    const alpha = hsl.l > 85 ? 0.9 : 1.0;
    const adjustedColor =
      isDark && hsl.l < 30 ? lightenColor(primaryColor, 10) : primaryColor;

    return {
      backgroundColor: adjustedColor,
      opacity: alpha
    };
  };

  if (loading) {
    return (
      <div
        ref={containerRef}
        className={className}
        style={{
          height,
          width: "auto",
          ...style
        }}
      />
    );
  }

  const extractPaths = () => {
    if (!svgContent) return { primaryPaths: [], secondaryPaths: [] };

    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, "image/svg+xml");

    const primaryPathElements = doc.querySelectorAll('[fill="#6e33ff"]');
    const secondaryPathElements = doc.querySelectorAll('[fill="#13eac1"]');

    const primaryPaths: string[] = [];
    const secondaryPaths: string[] = [];

    primaryPathElements.forEach((path) => {
      primaryPaths.push(path.outerHTML);
    });

    secondaryPathElements.forEach((path) => {
      secondaryPaths.push(path.outerHTML);
    });

    return { primaryPaths, secondaryPaths };
  };

  const { primaryPaths, secondaryPaths } = extractPaths();
  const hasDualColors = secondaryPaths.length > 0;

  if (primaryPaths.length > 0) {
    const containerStyle: CSSProperties = {
      height: height,
      width: "auto",
      ...style
    };

    return (
      <div ref={containerRef} className={className} style={containerStyle}>
        <svg
          viewBox={viewBox}
          xmlns="http://www.w3.org/2000/svg"
          style={{
            height: "100%",
            width: "100%",
            display: "block"
          }}
        >
          <g
            dangerouslySetInnerHTML={{
              __html: primaryPaths
                .map((path) =>
                  path.replace('fill="#6e33ff"', `fill="${primaryColor}"`)
                )
                .join("")
            }}
          />

          {hasDualColors && (
            <g
              dangerouslySetInnerHTML={{
                __html: secondaryPaths
                  .map((path) =>
                    path.replace(
                      'fill="#13eac1"',
                      `fill="${generateSecondaryColor(primaryColor)}"`
                    )
                  )
                  .join("")
              }}
            />
          )}
        </svg>
      </div>
    );
  }

  const maskStyle: CSSProperties = {
    maskImage: `url(${svgPath})`,
    WebkitMaskImage: `url(${svgPath})`,
    maskSize: "contain",
    WebkitMaskSize: "contain",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskPosition: "center",
    height: height,
    width: "auto",
    ...getColorStyle(),
    ...style
  };

  return <div ref={containerRef} className={className} style={maskStyle} />;
};

const lightenColor = (color: string, percent: number): string => {
  const hsl = hexToHsl(color);
  const lightness = Math.min(100, hsl.l + percent);
  return `hsl(${hsl.h}, ${hsl.s}%, ${lightness}%)`;
};

export default Logo;
