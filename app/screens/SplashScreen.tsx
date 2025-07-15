import React from "react"
// eslint-disable-next-line no-restricted-imports
import { ActivityIndicator, ViewStyle } from "react-native"

import { Screen } from "@/components/Screen"
import { useAppTheme } from "@/theme/context"

export const SplashScreen = () => {
  const { theme } = useAppTheme()
  return (
    <Screen preset="fixed" contentContainerStyle={$container}>
      <ActivityIndicator size="large" color={theme.colors.tint} />
    </Screen>
  )
}

const $container: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
} 