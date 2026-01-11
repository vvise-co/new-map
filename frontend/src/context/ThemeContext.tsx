import { Theme, ThemeContextType } from "@/types";
import { createContext, FC, PropsWithChildren, useState } from "react";

const defaultTheme: Theme = (() => {
  const primaryColor = "#3182ce";
  const secondaryColor = "#d69e2e";
  return {
    name: "default",
    isDark: false,
    styles: {
      searchActionLabelActiveBtn: {
        backgroundColor: primaryColor,
        borderColor: primaryColor,
      },
      searchActionHighlightActiveBtn: {
        backgroundColor: secondaryColor,
        borderColor: secondaryColor,
      }
    },
    colors: {
      primary: primaryColor,
      secondary: secondaryColor,
    },
  };
})();

const ThemeContext = createContext<ThemeContextType>({
  themeSchema: "light", // Default theme schema
  setThemeSchema: () => {},
  theme: defaultTheme,
  setTheme: () => {},
});

type Props = {};

const ThemeProvider: FC<PropsWithChildren<Props>> = ({ children }) => {
  const [themeSchema, setThemeSchema] = useState<string>("light");
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  return (
    <ThemeContext.Provider
      value={{ themeSchema, setThemeSchema, theme, setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };