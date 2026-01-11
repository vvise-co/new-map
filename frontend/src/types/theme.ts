import type { CSSProperties } from "react";

export type ThemeContextType = {
  themeSchema: string;
  setThemeSchema: (themeSchema: string) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export type ThemeStyle = Record<string, CSSProperties | string | number>;

export type ThemeStyles = Record<string, ThemeStyle>;

export type Theme = {
  name: string;
  isDark: boolean;
  styles: ThemeStyles;
  colors: Colors;
};

export type Colors = Record<string, string>;
export type ThemeColors = Record<string, Colors>;
