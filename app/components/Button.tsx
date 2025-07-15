import React from "react"
import {
  Pressable,
  PressableProps,
  StyleProp,
  TextStyle,
  ViewStyle,
  ActivityIndicator,
  View,
} from "react-native"
import { Text } from "./Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { LinearGradient } from "expo-linear-gradient"

// Define consistent colors for buttons
const BUTTON_COLORS = {
  primary: "#2AA199", // Teal-Blue
  white: "#FFFFFF",
  disabled: {
    background: "#CCCCCC",
    text: "#666666"
  }
}

export interface ButtonProps extends PressableProps {
  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  /**
   * An optional style override for the button text.
   */
  textStyle?: StyleProp<TextStyle>
  /**
   * One of the different types of button presets.
   */
  preset?: "primary" | "secondary" | "ghost" | "gradient"
  /**
   * An optional component to render on the right side of the text.
   * Example: `RightAccessory={(props) => <View {...props} />}`
   */
  RightAccessory?: React.ComponentType<any>
  /**
   * An optional component to render on the left side of the text.
   * Example: `LeftAccessory={(props) => <View {...props} />}`
   */
  LeftAccessory?: React.ComponentType<any>
  /**
   * Children components.
   */
  children?: React.ReactNode
  /**
   * Size of the button
   */
  size?: "small" | "medium" | "large"
  /**
   * Is the button in a loading state?
   */
  isLoading?: boolean
  /**
   * Custom gradient colors for gradient preset
   */
  gradientColors?: string[]
}

/**
 * A modern button component with various presets and styles.
 */
export function Button(props: ButtonProps) {
  const {
    text,
    style: $styleOverride,
    textStyle: $textStyleOverride,
    children,
    RightAccessory,
    LeftAccessory,
    preset = "primary",
    size = "medium",
    isLoading,
    gradientColors,
    disabled,
    ...rest
  } = props

  const { themed, theme } = useAppTheme()

  // Default gradient colors using the primary teal color
  const defaultGradient = [BUTTON_COLORS.primary, "#1E8982"] // Slightly darker shade for gradient
  const buttonGradient = gradientColors || defaultGradient

  const $viewPresets = {
    primary: [
      themed($baseButton),
      $primaryButton,
      themed($sizePresets[size]),
    ],
    secondary: [
      themed($baseButton),
      $secondaryButton,
      themed($sizePresets[size]),
    ],
    ghost: [
      themed($baseButton),
      $ghostButton,
      themed($sizePresets[size]),
    ],
    gradient: [
      themed($baseButton),
      themed($sizePresets[size]),
    ],
  }

  const $textPresets = {
    primary: $primaryText,
    secondary: $secondaryText,
    ghost: $ghostText,
    gradient: $primaryText,
  }

  const $viewStyle = $viewPresets[preset]
  const $textStyle = $textPresets[preset]

  // Handle disabled state
  const isDisabled = disabled || isLoading
  
  if (isDisabled) {
    if (preset === "gradient") {
      return (
        <Pressable {...rest} disabled={true}>
          <View 
            style={[
              themed($baseButton),
              themed($sizePresets[size]),
              $disabledButton,
              $styleOverride,
            ]}
          >
            {renderButtonContent()}
          </View>
        </Pressable>
      )
    } else {
      return (
        <Pressable {...rest} disabled={true}>
          <View style={[$viewStyle, $disabledButton, $styleOverride]}>
            {renderButtonContent()}
          </View>
        </Pressable>
      )
    }
  }

  function renderButtonContent() {
    return (
      <>
        {isLoading && (
          <ActivityIndicator 
            size="small" 
            color={preset === "primary" || preset === "gradient" ? BUTTON_COLORS.white : BUTTON_COLORS.primary} 
            style={$spinner}
          />
        )}
        
        {!!LeftAccessory && <LeftAccessory style={$leftAccessory} />}
        
        {text && (
          <Text
            weight="medium"
            text={text}
            style={[
              $textStyle, 
              $textStyleOverride, 
              isLoading && $hiddenText,
              isDisabled && $disabledText
            ]}
          />
        )}
        
        {children}
        
        {!!RightAccessory && <RightAccessory style={$rightAccessory} />}
      </>
    )
  }

  if (preset === "gradient") {
    return (
      <Pressable {...rest} disabled={isDisabled}>
        <LinearGradient
          colors={buttonGradient as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            themed($baseButton),
            themed($sizePresets[size]),
            $styleOverride,
          ]}
        >
          {renderButtonContent()}
        </LinearGradient>
      </Pressable>
    )
  }

  return (
    <Pressable {...rest} disabled={isDisabled}>
      <View style={[$viewStyle, $styleOverride]}>
        {renderButtonContent()}
      </View>
    </Pressable>
  )
}

// Styles
const $baseButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  borderRadius: 8, // Consistent 8px corner radius
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.md,
  overflow: "hidden",
  // Standard shadow for all buttons
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
})

const $sizePresets: Record<string, ThemedStyle<ViewStyle>> = {
  small: ({ spacing }) => ({
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
  }),
  medium: ({ spacing }) => ({
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  }),
  large: ({ spacing }) => ({
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  }),
}

const $primaryButton: ViewStyle = {
  backgroundColor: BUTTON_COLORS.primary,
}

const $secondaryButton: ViewStyle = {
  backgroundColor: "transparent",
  borderWidth: 1,
  borderColor: BUTTON_COLORS.primary,
}

const $ghostButton: ViewStyle = {
  backgroundColor: "transparent",
  borderWidth: 1,
  borderColor: BUTTON_COLORS.primary,
  shadowColor: "transparent",
  shadowOpacity: 0,
  elevation: 0,
}

const $disabledButton: ViewStyle = {
  backgroundColor: BUTTON_COLORS.disabled.background,
  borderWidth: 0,
  shadowColor: "transparent",
  shadowOpacity: 0,
  elevation: 0,
}

const $primaryText: TextStyle = {
  color: BUTTON_COLORS.white,
  fontSize: 16,
}

const $secondaryText: TextStyle = {
  color: BUTTON_COLORS.primary,
  fontSize: 16,
}

const $ghostText: TextStyle = {
  color: BUTTON_COLORS.primary,
  fontSize: 16,
}

const $disabledText: TextStyle = {
  color: BUTTON_COLORS.disabled.text,
}

const $rightAccessory: ViewStyle = {
  marginLeft: 8,
}

const $leftAccessory: ViewStyle = {
  marginRight: 8,
}

const $spinner: ViewStyle = {
  position: "absolute",
}

const $hiddenText: TextStyle = {
  opacity: 0,
}
