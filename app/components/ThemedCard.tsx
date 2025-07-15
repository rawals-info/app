import React, { ReactNode } from "react"
import { View, ViewStyle, StyleSheet, Pressable, PressableProps, TextStyle, ColorValue } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useAppTheme } from "@/theme/context"
import { Text } from "./Text"
import type { ThemedStyle } from "@/theme/types"

interface ThemedCardProps {
  title?: string
  children: ReactNode
  style?: ViewStyle
  gradientColors?: string[]
  onPress?: PressableProps["onPress"]
  variant?: "default" | "elevated" | "outlined" | "gradient"
  footer?: ReactNode
}

/**
 * A modern, themed card component that can be used throughout the app
 */
export function ThemedCard({
  title,
  children,
  style,
  gradientColors,
  onPress,
  variant = "default",
  footer,
}: ThemedCardProps) {
  const { themed, theme } = useAppTheme()
  const { colors } = theme
  
  // Default gradient colors if not provided
  const defaultGradient = [colors.palette.primary100, colors.palette.primary300]
  const cardGradient = gradientColors || defaultGradient
  
  const Container = onPress ? Pressable : View
  
  const renderCardContent = () => (
    <>
      {title && <Text preset="heading" style={themed($title)}>{title}</Text>}
      <View style={$childrenContainer}>{children}</View>
      {footer && <View style={$footer}>{footer}</View>}
    </>
  )
  
  // Apply different styles based on variant
  const getCardStyle = () => {
    switch (variant) {
      case "elevated":
        return [
          themed($card), 
          themed($elevatedCard), 
          style
        ]
      case "outlined":
        return [
          themed($card), 
          themed($outlinedCard), 
          style
        ]
      case "gradient":
        return [
          themed($card), 
          style
        ]
      default:
        return [
          themed($card), 
          style
        ]
    }
  }
  
  if (variant === "gradient") {
    return (
      <Container style={getCardStyle()} onPress={onPress}>
        <LinearGradient
          // Force type as any to bypass the strict typing of LinearGradient
          colors={cardGradient as any}
          style={$gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {renderCardContent()}
        </LinearGradient>
      </Container>
    )
  }
  
  return (
    <Container style={getCardStyle()} onPress={onPress}>
      {renderCardContent()}
    </Container>
  )
}

// Styles
const $card: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  borderRadius: 16,
  padding: spacing.md,
  backgroundColor: colors.background,
  overflow: "hidden",
})

const $elevatedCard: ThemedStyle<ViewStyle> = ({ colors }) => ({
  elevation: 4,
  shadowColor: colors.palette.neutral900,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 10,
})

const $outlinedCard: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderWidth: 1,
  borderColor: colors.border,
  backgroundColor: "transparent",
})

const $title: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $childrenContainer: ViewStyle = {
  flex: 1,
}

const $footer: ViewStyle = {
  marginTop: 16,
}

const $gradientBackground: ViewStyle = {
  flex: 1,
  padding: 16,
  borderRadius: 16,
} 