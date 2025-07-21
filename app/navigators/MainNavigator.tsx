import React from "react"
import { Ionicons } from "@expo/vector-icons"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import { HomeScreen } from "@/screens/HomeScreen"
import { ProfileScreen } from "@/screens/ProfileScreen"
import { useAppTheme } from "@/theme/context"

export type MainTabParamList = {
  Home: undefined
  Profile: undefined
}

const Tab = createBottomTabNavigator<MainTabParamList>()

export const MainNavigator = () => {
  const {
    theme: { colors },
  } = useAppTheme()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home"
          if (route.name === "Home") iconName = focused ? "home" : "home-outline"
          if (route.name === "Profile") iconName = focused ? "person" : "person-outline"
          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.textDim,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
} 