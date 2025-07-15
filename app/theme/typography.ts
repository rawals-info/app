// TODO: write documentation about fonts and typography along with guides on how to add custom fonts in own
// markdown file and add links from here

import { Platform } from "react-native"
import {
  NunitoSans_300Light as nunitoLight,
  NunitoSans_400Regular as nunitoRegular,
  NunitoSans_600SemiBold as nunitoSemiBold,
  NunitoSans_700Bold as nunitoBold,
} from "@expo-google-fonts/nunito-sans"

export const customFontsToLoad = {
  nunitoLight,
  nunitoRegular,
  nunitoSemiBold,
  nunitoBold,
}

const fonts = {
  nunitoSans: {
    light: "nunitoLight",
    normal: "nunitoRegular",
    medium: "nunitoRegular",
    semiBold: "nunitoSemiBold",
    bold: "nunitoBold",
  },
  helveticaNeue: {
    // iOS only font.
    thin: "HelveticaNeue-Thin",
    light: "HelveticaNeue-Light",
    normal: "Helvetica Neue",
    medium: "HelveticaNeue-Medium",
  },
  courier: {
    // iOS only font.
    normal: "Courier",
  },
  sansSerif: {
    // Android only font.
    thin: "sans-serif-thin",
    light: "sans-serif-light",
    normal: "sans-serif",
    medium: "sans-serif-medium",
  },
  monospace: {
    // Android only font.
    normal: "monospace",
  },
}

export const typography = {
  /**
   * The fonts are available to use, but prefer using the semantic name.
   */
  fonts,
  /**
   * The primary font. Used in most places.
   */
  primary: fonts.nunitoSans,
  /**
   * An alternate font used for perhaps titles and stuff.
   */
  secondary: Platform.select({ ios: fonts.helveticaNeue, android: fonts.sansSerif }),
  /**
   * Lets get fancy with a monospace font!
   */
  code: Platform.select({ ios: fonts.courier, android: fonts.monospace }),
}
