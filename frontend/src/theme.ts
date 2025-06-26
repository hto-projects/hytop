import { MantineThemeOverride } from "@mantine/core";
import { useComputedColorScheme } from "@mantine/core";

export const defaultTheme: MantineThemeOverride = {
  primaryColor: "blueButCooler",
  colors: {
    blueButCooler: [
      "#eff0fb",
      "#dbdcf0",
      "#b2b6e3",
      "#888dd6",
      "#656bcc",
      "#4f55c6",
      "#434ac4",
      "#353cad",
      "#2e359b",
      "#191f5e"
    ]
  }
};

export const hylandLegacyTheme: MantineThemeOverride = {
  primaryColor: "hylandLegacy",
  colors: {
    hylandLegacy: [
      "#f0faed",
      "#e2f0df",
      "#c4dfbd",
      "#a3ce98",
      "#88bf79",
      "#76b565",
      "#6cb15a",
      "#5b9b4a",
      "#528f42",
      "#407733"
    ]
  }
};

function iLoveColor(color: string, isDark: boolean): string {
  if (!isDark) return color;
  try {
    let c = color.replace("#", "");
    if (c.length === 3)
      c = c
        .split("")
        .map((x) => x + x)
        .join("");
    const num = parseInt(c, 16);
    let r = (num >> 16) + 40;
    let g = ((num >> 8) & 0x00ff) + 40;
    let b = (num & 0x0000ff) + 40;
    r = Math.min(255, r);
    g = Math.min(255, g);
    b = Math.min(255, b);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  } catch {
    return color;
  }
}

export const getCustomTheme = (
  primaryColor: string,
  isDark = false
): MantineThemeOverride => ({
  primaryColor: "custom",
  colors: {
    custom:
      // You may not like it but this is what peak code looks like
      [
        iLoveColor(primaryColor, isDark),
        iLoveColor(primaryColor, isDark),
        iLoveColor(primaryColor, isDark),
        iLoveColor(primaryColor, isDark),
        iLoveColor(primaryColor, isDark),
        iLoveColor(primaryColor, isDark),
        iLoveColor(primaryColor, isDark),
        iLoveColor(primaryColor, isDark),
        iLoveColor(primaryColor, isDark),
        iLoveColor(primaryColor, isDark)
      ] as [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string
      ]
  },
  ...(isDark && {
    colorScheme: "dark",
    white: "#fff",
    black: "#000",
    defaultRadius: "md",
    fontFamily: "Inter, sans-serif",
    headings: { fontFamily: "Inter, sans-serif" },
    components: {
      Paper: {
        styles: {
          root: {
            backgroundColor: "#181A1B",
            color: "#fff"
          }
        }
      },
      Box: {
        styles: {
          root: {
            backgroundColor: "#181A1B",
            color: "#fff"
          }
        }
      },
      Text: {
        styles: {
          root: {
            color: "#fff"
          }
        }
      },
      Title: {
        styles: {
          root: {
            color: "#fff"
          }
        }
      },
      Group: {
        styles: {
          root: {
            color: "#fff"
          }
        }
      },
      Container: {
        styles: {
          root: {
            backgroundColor: "#181A1B",
            color: "#fff"
          }
        }
      },
      Card: {
        styles: {
          root: {
            backgroundColor: "#181A1B",
            color: "#fff"
          }
        }
      },
      Input: {
        styles: {
          input: {
            backgroundColor: "#23272A",
            color: "#fff"
          },
          label: {
            color: "#fff"
          }
        }
      },
      Button: {
        styles: {
          root: {
            color: "#fff"
          }
        }
      }
    }
  })
});

export const themes = {
  default: defaultTheme,
  hylandLegacy: hylandLegacyTheme
};
