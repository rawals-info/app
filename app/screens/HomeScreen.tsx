import React from "react"
import { View, ViewStyle, TextStyle, ScrollView, TouchableOpacity } from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { useAuth } from "@/context/AuthContext"
import { useAppTheme } from "@/theme/context"
import { layout, shadowElevation } from "@/theme/styleHelpers"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { AppStackScreenProps } from "@/navigators/AppNavigator"

export const HomeScreen = () => {
  const { user } = useAuth()
  const { theme: { colors } } = useAppTheme()
  const navigation = useNavigation<AppStackScreenProps<"Main">["navigation"]>()

  const handleLogBloodSugar = () => {
    navigation.navigate("BloodSugarLog")
  }

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
          <TouchableOpacity style={$statCard} onPress={handleLogBloodSugar}>
            <View style={$iconContainer}>
              <Ionicons name="pulse" size={24} color={colors.tint} />
            </View>
            <Text preset="button" text="Blood Sugar" style={$statTitle}/>
            <Text preset="default" text="Not recorded" style={$statValue}/>
            <View style={$cardAction}>
              <Text preset="default" text="Tap to log" style={$actionText}/>
              <Ionicons name="add-circle" size={20} color={colors.tint} />
            </View>
          </TouchableOpacity>

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

        {/* Quick Actions */}
        <View style={$actionsSection}>
          <Text preset="button" text="Quick Actions" style={$sectionTitle}/>
          <Button
            text="Log Blood Sugar"
            preset="primary"
            onPress={handleLogBloodSugar}
            style={$actionButton}
            size="small"
            LeftAccessory={(props) => (
              <Ionicons 
                name="add-circle-outline" 
                size={16} 
                color="#FFFFFF" 
                style={{ marginRight: 6 }} 
              />
            )}
          />
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

      {/* Floating Action Button */}
      <TouchableOpacity style={$fab} onPress={handleLogBloodSugar}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
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
  marginBottom: 8,
}

const $cardAction: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
}

const $actionText: TextStyle = {
  fontSize: 12,
  color: '#2AA199',
  fontWeight: '500',
}

const $actionsSection: ViewStyle = {
  marginTop: 24,
}

const $actionButton: ViewStyle = {
  borderRadius: 12,
  paddingVertical: 12,
  paddingHorizontal: 16,
}

const $tipsSection: ViewStyle = {
  marginTop: 24,
  marginBottom: 100, // Space for FAB
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

const $fab: ViewStyle = {
  position: 'absolute',
  bottom: 24,
  right: 24,
  width: 56,
  height: 56,
  borderRadius: 28,
  backgroundColor: '#2AA199',
  ...layout.center,
  ...shadowElevation(4),
} 