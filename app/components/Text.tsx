import { ReactNode, forwardRef, ForwardedRef } from "react"
// eslint-disable-next-line no-restricted-imports
import { StyleProp, Text as RNText, TextProps as RNTextProps, TextStyle, Platform } from "react-native"
import { TOptions } from "i18next"

import { isRTL, TxKeyPath } from "@/i18n"
import { translate } from "@/i18n/translate"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle, ThemedStyleArray } from "@/theme/types"
import { typography, fontSizes, lineHeights, letterSpacing } from "@/theme/typography"

type Sizes = keyof typeof $sizeStyles
type Weights = keyof typeof typography.primary
type Presets = "default" | "headline" | "sectionTitle" | "body" | "button" | "caption"

export interface TextProps extends RNTextProps {
  /**
   * Text which is looked up via i18n.
   */
  tx?: TxKeyPath
  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string
  /**
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  txOptions?: TOptions
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<TextStyle>
  /**
   * One of the different types of text presets.
   */
  preset?: Presets
  /**
   * Text weight modifier.
   */
  weight?: Weights
  /**
   * Text size modifier.
   */
  size?: Sizes
  /**
   * Children components.
   */
  children?: ReactNode
}

/**
 * For your text displaying needs.
 * This component is a HOC over the built-in React Native one.
 */
export const Text = forwardRef(function Text(props: TextProps, ref: ForwardedRef<RNText>) {
  const { weight, size, tx, txOptions, text, children, style: $styleOverride, ...rest } = props
  const { themed } = useAppTheme()

  const i18nText = tx && translate(tx, txOptions)
  const content = i18nText || text || children

  const preset: Presets = props.preset ?? "default"
  const $styles: StyleProp<TextStyle> = [
    $rtlStyle,
    themed($presets[preset]),
    weight && $fontWeightStyles[weight],
    size && $sizeStyles[size],
    $styleOverride,
  ]

  return (
    <RNText {...rest} style={$styles} ref={ref}>
      {content}
    </RNText>
  )
})

// Size styles based on the typography scale
const $sizeStyles = {
  headline: { 
    fontSize: fontSizes.headline, 
    lineHeight: lineHeights.headline,
    letterSpacing: letterSpacing.headline,
  } satisfies TextStyle,
  sectionTitle: { 
    fontSize: fontSizes.sectionTitle, 
    lineHeight: lineHeights.sectionTitle,
    letterSpacing: letterSpacing.sectionTitle,
  } satisfies TextStyle,
  body: { 
    fontSize: fontSizes.body, 
    lineHeight: lineHeights.body,
    letterSpacing: letterSpacing.body,
  } satisfies TextStyle,
  button: { 
    fontSize: fontSizes.button, 
    lineHeight: lineHeights.button,
    letterSpacing: letterSpacing.button,
  } satisfies TextStyle,
  caption: { 
    fontSize: fontSizes.caption, 
    lineHeight: lineHeights.caption,
    letterSpacing: letterSpacing.caption,
  } satisfies TextStyle,
}

const $fontWeightStyles = Object.entries(typography.primary).reduce((acc, [weight, fontFamily]) => {
  return { ...acc, [weight]: { fontFamily } }
}, {}) as Record<Weights, TextStyle>

const $baseStyle: ThemedStyle<TextStyle> = (theme) => ({
  ...$sizeStyles.body,
  ...$fontWeightStyles.normal,
  color: '#000000', // Default to black text
})

const $presets: Record<Presets, ThemedStyleArray<TextStyle>> = {
  default: [$baseStyle],
  headline: [
    $baseStyle,
    {
      ...$sizeStyles.headline,
      ...$fontWeightStyles.semiBold,
    },
  ],
  sectionTitle: [
    $baseStyle,
    {
      ...$sizeStyles.sectionTitle,
      ...$fontWeightStyles.medium,
    },
  ],
  body: [
    $baseStyle,
    {
      ...$sizeStyles.body,
      ...$fontWeightStyles.normal,
    },
  ],
  button: [
    $baseStyle,
    {
      ...$sizeStyles.button,
      ...$fontWeightStyles.medium,
    },
  ],
  caption: [
    $baseStyle,
    {
      ...$sizeStyles.caption,
      ...$fontWeightStyles.normal,
    },
  ],
}

const $rtlStyle: TextStyle = isRTL ? { writingDirection: "rtl" } : {}
