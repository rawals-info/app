import React from "react"
import {
  View,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { useAppTheme } from "@/theme/context"
import { layout, shadowElevation } from "@/theme/styleHelpers"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import type { NavigationProp } from "@react-navigation/native"

export const VoiceMealScreen = () => {
  const { theme: { colors } } = useAppTheme()
  const navigation = useNavigation<NavigationProp<any>>()

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <Screen preset="fixed" safeAreaEdges={["top", "bottom"]} contentContainerStyle={$container}>
        {/* Header */}
        <View style={$header}>
          <TouchableOpacity 
            style={$backButton} 
            onPress={() => navigation.goBack()}
            hitSlop={15}
          >
            <Ionicons name="arrow-back" size={24} color="#2AA199" />
          </TouchableOpacity>
          
          <View style={$headerContent}>
            <Text preset="headline" text="Voice Meal Log" style={$headerTitle} />
          </View>
        </View>

        {/* Coming Soon Content */}
        <View style={$comingSoonContainer}>
          <View style={$iconContainer}>
            <Ionicons name="mic" size={80} color="#4ECDC4" />
          </View>
          
          <Text preset="headline" text="Coming Soon!" style={$comingSoonTitle} />
          <Text preset="default" text="Voice meal logging with AI transcription is under development. Use Quick Add for now." style={$comingSoonMessage} />
          
          <Button 
            text="Try Quick Add Instead"
            onPress={() => {
              navigation.goBack()
              setTimeout(() => {
                navigation.navigate("QuickAddMeal", { 
                  mealData: { 
                    mealType: 'lunch', 
                    loggedAt: new Date().toISOString(), 
                    inputMethod: 'quick_add' 
                  } 
                })
              }, 100)
            }}
            style={$alternativeButton}
          />
        </View>
      </Screen>
    </>
  )
}

// Styles
const $container: ViewStyle = {
  flex: 1,
  backgroundColor: '#FFFFFF',
}

const $header: ViewStyle = {
  ...layout.row,
  paddingHorizontal: 24,
  paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 + 16 : 16,
  paddingBottom: 16,
  alignItems: 'center',
}

const $backButton: ViewStyle = {
  width: 40,
  height: 40,
  borderRadius: 20,
  ...layout.center,
  backgroundColor: 'rgba(42, 161, 153, 0.1)',
  ...shadowElevation(2),
  marginRight: 16,
}

const $headerContent: ViewStyle = {
  flex: 1,
}

const $headerTitle: TextStyle = {
  fontSize: 24,
  lineHeight: 30,
  fontWeight: '600',
  color: '#2AA199',
}

const $comingSoonContainer: ViewStyle = {
  flex: 1,
  ...layout.center,
  paddingHorizontal: 32,
}

const $iconContainer: ViewStyle = {
  marginBottom: 32,
}

const $comingSoonTitle: TextStyle = {
  fontSize: 28,
  fontWeight: '600',
  color: '#4ECDC4',
  textAlign: 'center',
  marginBottom: 16,
}

const $comingSoonMessage: TextStyle = {
  fontSize: 16,
  lineHeight: 24,
  color: '#666666',
  textAlign: 'center',
  marginBottom: 32,
}

const $alternativeButton: ViewStyle = {
  backgroundColor: '#4ECDC4',
  paddingHorizontal: 32,
} 