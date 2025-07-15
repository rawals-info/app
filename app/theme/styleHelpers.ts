import { ViewStyle, TextStyle, ImageStyle, StyleSheet } from "react-native"
import { ThemedStyle } from "./types"

/**
 * Style helpers for consistent UI patterns across the app
 */

/**
 * Common shadow styles for elevated components
 */
export const shadowElevation = (elevation: number = 2): ViewStyle => ({
  elevation,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: elevation },
  shadowOpacity: 0.1 + elevation * 0.03, // Increase opacity with elevation
  shadowRadius: elevation * 2,
})

/**
 * Card styles with different elevation levels
 */
export const cardStyle: Record<string, ThemedStyle<ViewStyle>> = {
  flat: ({ colors, spacing }) => ({
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  }),
  
  elevated: ({ colors, spacing }) => ({
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: spacing.md,
    ...shadowElevation(3),
  }),
  
  gradient: ({ spacing }) => ({
    borderRadius: 16,
    padding: spacing.md,
    overflow: "hidden",
  }),
}

/**
 * Common layout patterns
 */
export const layout = {
  row: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
  },
  
  rowBetween: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
  },
  
  rowAround: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-around" as const,
  },
  
  center: {
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  
  fillSpace: {
    flex: 1,
  },
}

/**
 * Common spacing patterns
 */
export const spacing: Record<string, ThemedStyle<ViewStyle>> = {
  section: ({ spacing }) => ({
    marginVertical: spacing.lg,
  }),
  
  screenPadding: ({ spacing }) => ({
    paddingHorizontal: spacing.md,
  }),
  
  stack: ({ spacing }) => ({
    marginBottom: spacing.md,
  }),
}

/**
 * Text styles for consistent typography
 */
export const textStyles: Record<string, ThemedStyle<TextStyle>> = {
  title: ({ colors, typography }) => ({
    fontSize: 24,
    fontFamily: typography.primary.bold,
    color: colors.text,
    marginBottom: 8,
  }),
  
  subtitle: ({ colors, typography }) => ({
    fontSize: 18,
    fontFamily: typography.primary.medium,
    color: colors.textDim,
    marginBottom: 4,
  }),
  
  body: ({ colors, typography }) => ({
    fontSize: 16,
    fontFamily: typography.primary.normal,
    color: colors.text,
    lineHeight: 22,
  }),
  
  caption: ({ colors, typography }) => ({
    fontSize: 14,
    fontFamily: typography.primary.normal,
    color: colors.textDim,
  }),
}

/**
 * Common image styles
 */
export const imageStyles: Record<string, ImageStyle> = {
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  
  roundedThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  
  coverImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
}

/**
 * Create a merged style that combines themed and static styles
 */
export function createThemedStyles<T extends StyleSheet.NamedStyles<T>>(
  themedStyles: Record<keyof T, ThemedStyle<any>>,
  staticStyles?: Partial<T>
) {
  return (props: any) => {
    const themed = Object.entries(themedStyles).reduce((acc, [key, styleFunction]) => {
      acc[key as keyof T] = (styleFunction as ThemedStyle<any>)(props)
      return acc
    }, {} as T)
    
    return StyleSheet.create({
      ...themed,
      ...staticStyles,
    })
  }
} 