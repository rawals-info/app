import React, { FC, useState } from 'react'
// eslint-disable-next-line no-restricted-imports
import { View, Pressable, ViewStyle, TextStyle, StyleSheet, StatusBar, Platform, Alert, Dimensions, Image, ImageStyle, ScrollView } from 'react-native'
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
  id: 'prevent' | 'monitor' | 'diagnosed' | 'caregiver'
  title: string
  description: string
  image: string
}

const CARDS: Card[] = [
  { 
    id: 'prevent', 
    title: "I'm healthy but want to prevent diabetes", 
    description: 'Learn preventive measures and healthy habits to maintain your well-being.',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&crop=center'
  },
  { 
    id: 'monitor', 
    title: 'I sometimes have high sugar levels', 
    description: 'Track your glucose levels and get personalized insights to maintain balance.',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&crop=center'
  },
  { 
    id: 'diagnosed', 
    title: "I've been diagnosed with pre/diabetes", 
    description: 'Access tools and guidance to effectively manage your condition day to day.',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&crop=center'
  },
  { 
    id: 'caregiver', 
    title: "I'm a caregiver", 
    description: "I'm supporting a loved one with diabetes and want to learn more about their condition.",
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&crop=center'
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
        navigation.navigate('Login');
      } catch (error) {
        navigation.replace('Login');
      }
    }
  }

  async function handleContinue() {
    if (!selectedGoal) return
    
    // Block caregiver option - coming soon
    if (selectedGoal === 'caregiver') {
      Alert.alert(
        'Coming Soon!', 
        'Caregiver support is under development. Please check back later or choose another option.',
        [{ text: 'OK' }]
      )
      return
    }
    
    const token = await getAuthToken()
    if (token) {
      await api.setGoal(selectedGoal)
    } else {
      await AsyncStorage.setItem('pendingGoal', selectedGoal)
    }
    
    // Navigate to questionnaire screen for other options
    navigation?.navigate?.('Questionnaire', { goal: selectedGoal })
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
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </Pressable>
        
        {/* Main content container with scrollable content */}
        <ScrollView 
          style={$scrollView}
          contentContainerStyle={$scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={$headerContainer}>
            <Text 
              preset="headline" 
              text="Why are you here today?" 
              style={themed($heading)} 
            />
            <Text text="Step 1 of 4" style={$stepText} />
            <View style={$progressBar}>
              <View style={[$progressFill, { width: '25%' }]} />
            </View>
          </View>
          
          {/* Cards - scrollable layout */}
          <View style={$cardsContainer}>
            {CARDS.map((card) => {
              const isSelected = selectedGoal === card.id
              
              return (
                <Pressable
                  key={card.id}
                  style={[
                    $card,
                    isSelected && $selectedCard
                  ]}
                  onPress={() => setSelectedGoal(card.id)}
                >
                  <View style={$cardContent}>
                    <Image 
                      source={{ uri: card.image }}
                      style={$cardImage}
                      resizeMode="cover"
                    />
                    
                    <View style={$cardTextSection}>
                      <View style={$cardTextContainer}>
                        <Text 
                          preset="button"
                          text={card.title} 
                          weight="medium" 
                          style={[
                            $cardTitle,
                            isSelected && $cardTitleSelected
                          ]} 
                        />
                        <Text 
                          preset="caption"
                          text={card.description} 
                          style={$cardDescription} 
                        />
                      </View>
                      
                      <View style={[
                        $checkCircle, 
                        { borderColor: isSelected ? "#000000" : "#CCCCCC" },
                        isSelected && { backgroundColor: "#000000" }
                      ]}>
                        {isSelected && <Ionicons name="checkmark" size={16} color="white" />}
                      </View>
                    </View>
                  </View>
                </Pressable>
              )
            })}
          </View>
        </ScrollView>
        
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
  justifyContent: 'space-between',
}

const $scrollView: ViewStyle = {
  flex: 1,
}

const $scrollContent: ViewStyle = {
  paddingHorizontal: 24,
  paddingBottom: 24,
}

const $headerContainer: ViewStyle = {
  paddingTop: 60, // Space for back button
  paddingHorizontal: 24,
  paddingBottom: 16,
  marginBottom: 24,
  backgroundColor: '#FFFFFF',
}

const $cardsContainer: ViewStyle = {
  gap: 12,
  paddingBottom: 100, // Space for button
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
  backgroundColor: '#F8F8F8',
  borderWidth: 1,
  borderColor: '#E0E0E0',
  ...shadowElevation(1),
}

const $heading: ThemedStyle<TextStyle> = () => ({
  marginTop: 8,
  marginBottom: 8,
  textAlign: 'center',
  fontSize: 24,
  lineHeight: 32,
  fontWeight: '600',
  color: '#1F2937',
  letterSpacing: -0.5,
})

const $stepText: TextStyle = {
  fontSize: 14,
  color: '#6B7280',
  textAlign: 'center',
  marginBottom: 16,
}

const $progressBar: ViewStyle = {
  height: 4,
  backgroundColor: '#E5E7EB',
  borderRadius: 2,
  overflow: 'hidden',
  marginBottom: 16,
  width: '80%',
  alignSelf: 'center',
}

const $progressFill: ViewStyle = {
  height: '100%',
  backgroundColor: '#1F2937',
  borderRadius: 2,
}

const $card: ViewStyle = {
  borderWidth: 2,
  borderRadius: 16,
  backgroundColor: '#FFFFFF',
  overflow: 'hidden',
  borderColor: '#E5E5E5',
  ...shadowElevation(2),
}

const $selectedCard: ViewStyle = {
  transform: [{ scale: 1.01 }],
  ...shadowElevation(8),
  borderColor: '#000000',
  backgroundColor: '#FAFAFA',
}

const $cardContent: ViewStyle = {
  flexDirection: 'column',
}

const $cardImage: ImageStyle = {
  width: '100%',
  height: 100,
}

const $cardTextSection: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'flex-start',
  padding: 16,
}

const $cardTextContainer: ViewStyle = {
  flex: 1,
  paddingRight: 16,
}

const $checkCircle: ViewStyle = {
  width: 24,
  height: 24,
  borderRadius: 12,
  borderWidth: 2,
  ...layout.center,
  marginTop: 4,
}

const $cardTitle: TextStyle = {
  fontSize: 16,
  lineHeight: 22,
  fontWeight: '600',
  marginBottom: 6,
  color: '#000000',
}

const $cardTitleSelected: TextStyle = {
  color: '#000000',
}

const $cardDescription: TextStyle = {
  color: '#6B7280',
  fontSize: 14,
  lineHeight: 20,
  letterSpacing: 0,
}

const $footer: ViewStyle = {
  paddingVertical: 16,
  paddingHorizontal: 24,
  borderTopWidth: 1,
  borderTopColor: '#F0F0F0',
  backgroundColor: '#FFFFFF',
}

const $continueButton: ViewStyle = {
  height: 56,
  backgroundColor: '#000000',
  borderRadius: 12,
  ...shadowElevation(3),
} 