import React, { FC, useState } from 'react'
// eslint-disable-next-line no-restricted-imports
import { View, Pressable, ViewStyle, TextStyle, StyleSheet, StatusBar, Platform, Alert, Dimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { Screen } from '@/components/Screen'
import { Text } from '@/components/Text'
import { Button } from '@/components/Button'
import { useAppTheme } from '@/theme/context'
import type { ThemedStyle } from '@/theme/types'
import { api } from '@/services/api'
import { setHasOnboarded } from '@/utils/persistence'
import { getAuthToken } from '@/utils/persistence'
import { layout, shadowElevation } from '@/theme/styleHelpers'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Get screen dimensions
const { height } = Dimensions.get('window')

interface Card {
  id: 'prevent' | 'monitor' | 'diagnosed'
  title: string
  description: string
}

const CARDS: Card[] = [
  { 
    id: 'prevent', 
    title: "I'm healthy but want to prevent diabetes", 
    description: 'Learn preventive measures and healthy habits to maintain your well-being.'
  },
  { 
    id: 'monitor', 
    title: 'I sometimes have high sugar levels', 
    description: 'Track your glucose levels and get personalized insights to maintain balance.'
  },
  { 
    id: 'diagnosed', 
    title: "I've been diagnosed with pre/diabetes", 
    description: 'Access tools and guidance to effectively manage your condition day to day.'
  },
]

export const OnboardingGoalScreen: FC<{ navigation?: any }> = ({ navigation }) => {
  const { themed, theme } = useAppTheme()
  const [selectedGoal, setSelectedGoal] = useState<Card['id'] | null>(null)

  function handleBack() {
    if (!navigation) {
      Alert.alert('Navigation Error', 'Navigation prop is undefined');
      return;
    }
    
    if (navigation.canGoBack?.()) {
      navigation.goBack();
    } else {
      try {
        navigation.navigate('Onboarding');
      } catch (error) {
        navigation.replace('Onboarding');
      }
    }
  }

  async function handleContinue() {
    if (!selectedGoal) return
    
    const token = await getAuthToken()
    if (token) {
      await api.setGoal(selectedGoal)
    } else {
      await AsyncStorage.setItem('pendingGoal', selectedGoal)
    }
    await setHasOnboarded()
    navigation?.replace?.('Login')
  }

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <Screen preset="fixed" safeAreaEdges={["top", "bottom"]} contentContainerStyle={$container}>
        {/* Back button */}
        <Pressable 
          style={$backButton} 
          onPress={handleBack} 
          hitSlop={15}
        >
          <Ionicons name="arrow-back" size={24} color="#2AA199" />
        </Pressable>
        
        {/* Main content container with fixed height */}
        <View style={$mainContainer}>
          {/* Header */}
          <View style={$headerContainer}>
            <Text 
              preset="headline" 
              text="Why are you here today?" 
              style={themed($heading)} 
            />
          </View>
          
          {/* Cards - with fixed layout */}
          <View style={$cardsContainer}>
            {CARDS.map((card) => {
              const isSelected = selectedGoal === card.id
              
              return (
                <Pressable
                  key={card.id}
                  style={[
                    themed($card),
                    isSelected && $selectedCard,
                    { borderColor: isSelected ? "#2AA199" : theme.colors.border }
                  ]}
                  onPress={() => setSelectedGoal(card.id)}
                >
                  <View style={$cardContent}>
                    <View style={[
                      $checkCircle, 
                      { borderColor: isSelected ? "#2AA199" : "#CCCCCC" },
                      isSelected && { backgroundColor: "#2AA199" }
                    ]}>
                      {isSelected && <Ionicons name="checkmark" size={16} color="white" />}
                    </View>
                    
                    <View style={$cardTextContainer}>
                      <Text 
                        preset="button"
                        text={card.title} 
                        weight="medium" 
                        style={[
                          $cardTitle,
                          isSelected && { color: "#2AA199" }
                        ]} 
                      />
                      <Text 
                        preset="caption"
                        text={card.description} 
                        style={$cardDescription} 
                      />
                    </View>
                  </View>
                </Pressable>
              )
            })}
          </View>
        </View>
        
        {/* Footer with button */}
        <View style={$footer}>
          <Button
            text="Continue"
            preset="primary"
            disabled={!selectedGoal}
            style={$continueButton}
            onPress={handleContinue}
          />
        </View>
      </Screen>
    </>
  )
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: '#FFFFFF',
  paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  justifyContent: 'space-between', // Ensure space between main content and footer
}

const $mainContainer: ViewStyle = {
  flex: 1,
  paddingHorizontal: 24,
  justifyContent: 'flex-start',
}

const $headerContainer: ViewStyle = {
  paddingTop: 16,
  paddingBottom: 8,
  marginBottom: 8,
}

const $cardsContainer: ViewStyle = {
  justifyContent: 'center',
}

const $backButton: ViewStyle = {
  position: 'absolute',
  top: Platform.OS === 'android' ? StatusBar.currentHeight || 0 + 16 : 16,
  left: 24,
  zIndex: 10,
  width: 40,
  height: 40,
  borderRadius: 20,
  ...layout.center,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  ...shadowElevation(2),
}

const $heading: ThemedStyle<TextStyle> = () => ({
  marginTop: 24,
  marginBottom: 16,
  textAlign: 'center',
  fontSize: 26,
  lineHeight: 34,
  fontWeight: '600', // SemiBold works better with Poppins
  color: '#000000',
  letterSpacing: 0,
})

const $card: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  borderWidth: 2,
  borderRadius: 16,
  padding: spacing.md, // Reduced padding
  marginBottom: spacing.sm, // Reduced margin
  backgroundColor: '#FFFFFF',
  overflow: 'hidden',
  position: 'relative',
  ...shadowElevation(2),
})

const $selectedCard: ViewStyle = {
  transform: [{ scale: 1.02 }],
  ...shadowElevation(4),
}

const $cardContent: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
}

const $checkCircle: ViewStyle = {
  width: 24,
  height: 24,
  borderRadius: 12,
  borderWidth: 2,
  marginRight: 14,
  ...layout.center,
}

const $cardTextContainer: ViewStyle = {
  flex: 1,
}

const $cardTitle: TextStyle = {
  fontSize: 16,
  lineHeight: 22, // Reduced line height
  fontWeight: '500', // Medium works better for Poppins
  marginBottom: 4, // Reduced margin
  color: '#000000',
}

const $cardDescription: TextStyle = {
  color: '#333333',
  fontSize: 14, // Smaller font size
  lineHeight: 20, // Reduced line height
  letterSpacing: 0,
}

const $footer: ViewStyle = {
  paddingVertical: 12,
  paddingHorizontal: 24,
  borderTopWidth: 1,
  borderTopColor: 'rgba(0,0,0,0.05)',
  backgroundColor: '#FFFFFF',
}

const $continueButton: ViewStyle = {
  height: 48,
} 