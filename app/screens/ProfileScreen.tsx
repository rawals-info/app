import React from "react"
import { View, ViewStyle, TextStyle, ScrollView, Pressable } from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { useAuth } from "@/context/AuthContext"
import { useAppTheme } from "@/theme/context"
import { layout, shadowElevation } from "@/theme/styleHelpers"
import { Ionicons } from "@expo/vector-icons"

export const ProfileScreen = () => {
  const { user, logout } = useAuth()
  const { theme: { colors } } = useAppTheme()

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$container}>
      {/* Header */}
      <View style={$header}>
        <Text preset="headline" text="Profile" style={$headerTitle} />
      </View>

      <ScrollView style={$content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={$profileCard}>
          <View style={$avatarContainer}>
            <Ionicons name="person" size={40} color={colors.tint} />
          </View>
          <Text preset="button" text={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`} style={$name}/>
          <Text preset="default" text={user?.email ?? ""} style={$email}/>
        </View>

        {/* Settings Section */}
        <View style={$section}>
          <Text preset="button" text="Settings" style={$sectionTitle}/>
          
          <Pressable style={$menuItem}>
            <View style={$menuIconContainer}>
              <Ionicons name="notifications-outline" size={24} color={colors.tint} />
            </View>
            <Text preset="default" text="Notifications" style={$menuText}/>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
          </Pressable>

          <Pressable style={$menuItem}>
            <View style={$menuIconContainer}>
              <Ionicons name="shield-outline" size={24} color={colors.tint} />
            </View>
            <Text preset="default" text="Privacy" style={$menuText}/>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
          </Pressable>

          <Pressable style={$menuItem}>
            <View style={$menuIconContainer}>
              <Ionicons name="help-circle-outline" size={24} color={colors.tint} />
            </View>
            <Text preset="default" text="Help & Support" style={$menuText}/>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
          </Pressable>
        </View>

        {/* Account Section */}
        <View style={$section}>
          <Text preset="button" text="Account" style={$sectionTitle}/>
          
          <Pressable style={$menuItem}>
            <View style={$menuIconContainer}>
              <Ionicons name="person-outline" size={24} color={colors.tint} />
            </View>
            <Text preset="default" text="Edit Profile" style={$menuText}/>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
          </Pressable>

          <Pressable style={$menuItem}>
            <View style={$menuIconContainer}>
              <Ionicons name="key-outline" size={24} color={colors.tint} />
            </View>
            <Text preset="default" text="Change Password" style={$menuText}/>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
          </Pressable>
        </View>

        <Button
          preset="secondary"
          text="Log Out"
          onPress={logout}
          style={$logoutBtn}
        />
      </ScrollView>
    </Screen>
  )
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: '#FFFFFF',
}

const $header: ViewStyle = {
  padding: 24,
  paddingBottom: 16,
  backgroundColor: '#FFFFFF',
  borderBottomWidth: 1,
  borderBottomColor: 'rgba(0,0,0,0.05)',
}

const $headerTitle: TextStyle = {
  textAlign: 'left',
}

const $content: ViewStyle = {
  flex: 1,
}

const $profileCard: ViewStyle = {
  alignItems: 'center',
  padding: 24,
  backgroundColor: '#FFFFFF',
}

const $avatarContainer: ViewStyle = {
  width: 80,
  height: 80,
  borderRadius: 40,
  backgroundColor: 'rgba(42, 161, 153, 0.1)',
  ...layout.center,
  marginBottom: 16,
}

const $name: TextStyle = {
  fontSize: 20,
  marginBottom: 4,
}

const $email: TextStyle = {
  color: '#666666',
}

const $section: ViewStyle = {
  marginTop: 24,
  paddingHorizontal: 24,
}

const $sectionTitle: TextStyle = {
  marginBottom: 16,
}

const $menuItem: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  paddingVertical: 12,
  marginBottom: 8,
  borderRadius: 12,
  ...shadowElevation(1),
  paddingHorizontal: 16,
}

const $menuIconContainer: ViewStyle = {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: 'rgba(42, 161, 153, 0.1)',
  ...layout.center,
  marginRight: 12,
}

const $menuText: TextStyle = {
  flex: 1,
  fontSize: 16,
}

const $logoutBtn: ViewStyle = {
  marginHorizontal: 24,
  marginTop: 32,
  marginBottom: 24,
  backgroundColor: '#FF4D6D',
} 