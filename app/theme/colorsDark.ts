const palette = {
  neutral900: "#FFFFFF",
  neutral800: "#F4F2F1",
  neutral700: "#D7CEC9",
  neutral600: "#B6ACA6",
  neutral500: "#978F8A",
  neutral400: "#564E4A",
  neutral300: "#3C3836",
  neutral200: "#191015",
  neutral100: "#000000",

  // Brand Primary inverted (dark mode lighter tints)
  primary600: "#F5E6FB",
  primary500: "#E7C0F6",
  primary400: "#D299F0",
  primary300: "#BD73EA",
  primary200: "#B620E0",
  primary100: "#8B16AC",

  // Secondary (keep existing slate but inverted order)
  secondary500: "#DCDDE9",
  secondary400: "#BCC0D6",
  secondary300: "#9196B9",
  secondary200: "#626894",
  secondary100: "#41476E",

  // Accent inverted
  accent500: "#FFD4DA",
  accent400: "#FFB1BD",
  accent300: "#FF8FA1",
  accent200: "#FF7087",
  accent100: "#FF4D6D",

  // Success & Warning
  success100: "#3CB371",
  success500: "#E0F2EA",

  warning100: "#FFA500",
  warning500: "#FFF4D2",

  angry100: "#F2D6CD",
  angry500: "#C03403",

  overlay20: "rgba(25, 16, 21, 0.2)",
  overlay50: "rgba(25, 16, 21, 0.5)",
} as const

export const colors = {
  palette,
  transparent: "rgba(0, 0, 0, 0)",
  text: palette.neutral800,
  textDim: palette.neutral600,
  background: palette.neutral200,
  border: palette.neutral400,
  tint: palette.primary500,
  tintInactive: palette.neutral300,
  separator: palette.neutral300,
  error: palette.angry500,
  errorBackground: palette.angry100,
  // 👉 NEW semantic colours
  success: palette.success100,
  successBackground: palette.success500,
  warning: palette.warning100,
  warningBackground: palette.warning500,
} as const
