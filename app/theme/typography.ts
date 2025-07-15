// Typography system with Poppins font

import { Platform } from "react-native"
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold
} from "@expo-google-fonts/poppins"

// Custom fonts to load
export const customFontsToLoad = {
  PoppinsRegular: Poppins_400Regular,
  PoppinsMedium: Poppins_500Medium,
  PoppinsSemiBold: Poppins_600SemiBold,
  PoppinsBold: Poppins_700Bold,
}

const fonts = {
  poppins: {
    normal: "PoppinsRegular",
    medium: "PoppinsMedium",
    semiBold: "PoppinsSemiBold",
    bold: "PoppinsBold",
  },
  system: {
    normal: Platform.select({
      ios: "System",
      android: "Roboto",
      default: "System",
    }),
    medium: Platform.select({
      ios: "System-Medium",
      android: "Roboto-Medium",
      default: "System-Medium",
    }),
    semiBold: Platform.select({
      ios: "System-Semibold",
      android: "Roboto-Medium",
      default: "System-Semibold",
    }),
    bold: Platform.select({
      ios: "System-Bold",
      android: "Roboto-Bold",
      default: "System-Bold",
    }),
  },
}

// Font sizes and line heights based on the specified typography scale
export const fontSizes = {
  headline: 24,
  sectionTitle: 18,
  body: 16,
  button: 16,
  caption: 14,
}

export const lineHeights = {
  headline: 32,
  sectionTitle: 24,
  body: 22,
  button: 24,
  caption: 18,
}

export const letterSpacing = {
  headline: 0,
  sectionTitle: 0,
  body: 0.15,
  button: 0,
  caption: 0.15,
}

export const typography = {
  /**
   * The fonts are available to use, but prefer using the semantic name.
   */
  fonts,
  /**
   * The primary font. Used in most places.
   */
  primary: fonts.poppins,
  /**
   * Font sizes and line heights
   */
  sizes: fontSizes,
  lineHeights: lineHeights,
  letterSpacing: letterSpacing,
}
