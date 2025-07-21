import React from "react"
import { View, ViewStyle, TextStyle, ScrollView } from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAuth } from "@/context/AuthContext"
import { useAppTheme } from "@/theme/context"
import { layout, shadowElevation } from "@/theme/styleHelpers"
import { Ionicons } from "@expo/vector-icons"

export const HomeScreen = () => {
  const { user } = useAuth()
  const { theme: { colors } } = useAppTheme()

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$container}>
      {/* Welcome Card */}
      <View style={$headerCard}>
        <Text preset="headline" text={`Hello! Welcome to the App${user?.firstName ? `, ${user.firstName}` : ''}`} style={$heading}/>
        <Text preset="body" text="Track your progress and stay healthy" style={$subheading}/>
      </View>

      <ScrollView style={$content} showsVerticalScrollIndicator={false}>
        {/* Quick Stats */}
        <View style={$statsContainer}>
          <View style={$statCard}>
            <View style={$iconContainer}>
              <Ionicons name="pulse" size={24} color={colors.tint} />
            </View>
            <Text preset="button" text="Blood Sugar" style={$statTitle}/>
            <Text preset="default" text="Not recorded" style={$statValue}/>
          </View>

          <View style={$statCard}>
            <View style={$iconContainer}>
              <Ionicons name="walk" size={24} color={colors.tint} />
            </View>
            <Text preset="button" text="Activity" style={$statTitle}/>
            <Text preset="default" text="No data yet" style={$statValue}/>
          </View>

          <View style={$statCard}>
            <View style={$iconContainer}>
              <Ionicons name="restaurant" size={24} color={colors.tint} />
            </View>
            <Text preset="button" text="Last Meal" style={$statTitle}/>
            <Text preset="default" text="Not logged" style={$statValue}/>
          </View>
        </View>

        {/* Tips Section */}
        <View style={$tipsSection}>
          <Text preset="button" text="Daily Tips" style={$sectionTitle}/>
          <View style={$tipCard}>
            <Ionicons name="bulb" size={24} color={colors.tint} style={$tipIcon}/>
            <Text preset="body" text="Regular blood sugar monitoring helps you make informed decisions about your health." style={$tipText}/>
          </View>
        </View>
      </ScrollView>
    </Screen>
  )
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: '#FFFFFF',
}

const $headerCard: ViewStyle = {
  padding: 24,
  backgroundColor: '#2AA199',
  borderBottomLeftRadius: 24,
  borderBottomRightRadius: 24,
  ...shadowElevation(3),
}

const $heading: TextStyle = {
  color: '#FFFFFF',
  textAlign: 'left',
  marginBottom: 8,
}

const $subheading: TextStyle = {
  color: '#FFFFFF',
  opacity: 0.9,
}

const $content: ViewStyle = {
  flex: 1,
  padding: 16,
}

const $statsContainer: ViewStyle = {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  marginTop: 16,
  gap: 16,
}

const $statCard: ViewStyle = {
  backgroundColor: '#FFFFFF',
  borderRadius: 16,
  padding: 16,
  width: '47%',
  ...shadowElevation(2),
  borderWidth: 1,
  borderColor: 'rgba(0,0,0,0.05)',
}

const $iconContainer: ViewStyle = {
  width: 48,
  height: 48,
  borderRadius: 24,
  backgroundColor: 'rgba(42, 161, 153, 0.1)',
  ...layout.center,
  marginBottom: 12,
}

const $statTitle: TextStyle = {
  fontSize: 14,
  marginBottom: 4,
}

const $statValue: TextStyle = {
  fontSize: 16,
  color: '#666666',
}

const $tipsSection: ViewStyle = {
  marginTop: 24,
}

const $sectionTitle: TextStyle = {
  fontSize: 18,
  marginBottom: 16,
}

const $tipCard: ViewStyle = {
  backgroundColor: '#FFFFFF',
  borderRadius: 16,
  padding: 16,
  flexDirection: 'row',
  alignItems: 'center',
  ...shadowElevation(2),
  borderWidth: 1,
  borderColor: 'rgba(0,0,0,0.05)',
}

const $tipIcon: ViewStyle = {
  marginRight: 12,
}

const $tipText: TextStyle = {
  flex: 1,
  fontSize: 14,
  lineHeight: 20,
} 