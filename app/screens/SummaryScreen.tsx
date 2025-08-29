import React, { FC } from 'react'
import { View, ViewStyle, TextStyle, StatusBar, Platform, ScrollView, Image, ImageStyle } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Screen } from '@/components/Screen'
import { Text } from '@/components/Text'
import { Button } from '@/components/Button'
import { useAppTheme } from '@/theme/context'
import { useAuth } from '@/context/AuthContext'
import { saveAuthToken } from '@/utils/persistence'
import { api } from '@/services/api'
import { shadowElevation, layout } from '@/theme/styleHelpers'

interface Props {
  navigation?: any
  route?: { params?: { title: string; summary: string; goal: string; userInfo?: any } }
}

export const SummaryScreen: FC<Props> = ({ navigation, route }) => {
  const { themed } = useAppTheme()
  const { isAuthenticated, setIsOnboarded, setUser, setAuthToken } = useAuth()
  const { title, summary, userInfo } = route?.params || {}

  const handlePress = async () => {
    if (isAuthenticated) {
      // Ensure onboarding marked complete just in case
      try {
        await api.completeOnboarding()
        setIsOnboarded(true)
      } catch {}

      navigation?.navigate?.('Main' as any)
    } else {
      // Create account with user info if available
      if (userInfo) {
        try {
          // Calculate date of birth from age
          const currentDate = new Date()
          const birthYear = currentDate.getFullYear() - userInfo.age
          const dateOfBirth = new Date(birthYear, 0, 1) // January 1st of birth year
          
          // For demo purposes, use a default password - in production this should be handled securely
          const defaultPassword = 'TempPassword123!'
          
          const result = await api.signup({
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.email,
            password: defaultPassword,
            phoneNumber: userInfo.phoneNumber,
            dateOfBirth,
            gender: userInfo.gender
          })
          
          if (result.kind === 'ok') {
            // Account created successfully, set authentication state
            await saveAuthToken(result.token as string)
            setAuthToken(result.token as string)
            setUser(result.user)
            
            // Mark onboarding complete on server after successful signup
            try {
              await api.completeOnboarding()
            } catch (error) {
              console.log('Warning: Could not mark onboarding complete on server:', error)
            }
            
            setIsOnboarded(true)
            navigation?.navigate?.('Main' as any)
          } else {
            // Handle error
            navigation?.navigate?.('OnboardingGoal')
          }
        } catch (error) {
          console.error('Account creation error:', error)
          navigation?.navigate?.('OnboardingGoal')
        }
      } else {
        // No user info, go to regular signup
        navigation?.navigate?.('OnboardingGoal')
      }
    }
  }

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <Screen preset="fixed" safeAreaEdges={["top", "bottom"]} contentContainerStyle={$container}>
        <ScrollView 
          style={$scrollView}
          contentContainerStyle={$scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Image Section */}
          <View style={$heroSection}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&crop=center' }}
              style={$heroImage}
              resizeMode="cover"
            />
            <View style={$heroOverlay}>
              <Text 
                text={`Welcome, ${userInfo?.firstName || 'there'}!`}
                style={$welcomeText} 
              />
              <Text 
                text={title || 'Off to a Careful Start'}
                style={$heroTitle} 
              />
              <Text 
                text={summary || 'You avoid sugary drinks - excellent! Adding just 10 minutes of daily walking can further reduce your risk. Let\'s build on this strong foundation.'}
                style={$heroSubtitle} 
              />
            </View>
          </View>

          {/* Intro Message */}
          <View style={$messageSection}>
            <Text 
              text="We're excited to help you manage your diabetes. Here's a quick overview of what's next."
              style={$messageText} 
            />
          </View>

          {/* Next Steps Section */}
          <View style={$nextStepsSection}>
            <Text text="Next Steps" style={$sectionTitle} />
            
            <View style={$stepsList}>
              <View style={$stepItem}>
                <View style={$stepIcon}>
                  <Ionicons name="pulse" size={24} color="#1F2937" />
                </View>
                <View style={$stepContent}>
                  <Text text="Track Your Blood Sugar" style={$stepTitle} />
                  <Text text="Learn how to track your blood sugar levels effectively." style={$stepDescription} />
                </View>
              </View>

              <View style={$stepItem}>
                <View style={$stepIcon}>
                  <Ionicons name="nutrition" size={24} color="#1F2937" />
                </View>
                <View style={$stepContent}>
                  <Text text="Personalized Meal Plans" style={$stepTitle} />
                  <Text text="Discover personalized meal plans to support your health." style={$stepDescription} />
                </View>
              </View>

              <View style={$stepItem}>
                <View style={$stepIcon}>
                  <Ionicons name="fitness" size={24} color="#1F2937" />
                </View>
                <View style={$stepContent}>
                  <Text text="Activity Tracking" style={$stepTitle} />
                  <Text text="Get insights into your activity levels and how they impact your health." style={$stepDescription} />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer Button */}
        <View style={$footer}>
          <Button
            text="Continue"
            preset="primary"
            onPress={handlePress}
            style={$button}
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
}

const $scrollView: ViewStyle = {
  flex: 1,
}

const $scrollContent: ViewStyle = {
  paddingBottom: 100, // Space for footer button
}

const $heroSection: ViewStyle = {
  position: 'relative',
  height: 280,
  marginBottom: 24,
}

const $heroImage: ImageStyle = {
  width: '100%',
  height: '100%',
}

const $heroOverlay: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.3)',
  padding: 24,
  justifyContent: 'center',
  alignItems: 'center',
}

const $welcomeText: TextStyle = {
  fontSize: 18,
  fontWeight: '500',
  color: '#FFFFFF',
  marginBottom: 8,
  textAlign: 'center',
}

const $heroTitle: TextStyle = {
  fontSize: 24,
  fontWeight: '700',
  color: '#FFFFFF',
  marginBottom: 12,
  textAlign: 'center',
}

const $heroSubtitle: TextStyle = {
  fontSize: 16,
  fontWeight: '400',
  color: '#FFFFFF',
  textAlign: 'center',
  lineHeight: 22,
  paddingHorizontal: 20,
}

const $messageSection: ViewStyle = {
  paddingHorizontal: 24,
  marginBottom: 32,
}

const $messageText: TextStyle = {
  fontSize: 16,
  color: '#4B5563',
  textAlign: 'center',
  lineHeight: 22,
}

const $nextStepsSection: ViewStyle = {
  paddingHorizontal: 24,
}

const $sectionTitle: TextStyle = {
  fontSize: 20,
  fontWeight: '600',
  color: '#1F2937',
  marginBottom: 16,
}

const $stepsList: ViewStyle = {
  gap: 16,
}

const $stepItem: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'flex-start',
  backgroundColor: '#F9FAFB',
  padding: 16,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#E5E7EB',
}

const $stepIcon: ViewStyle = {
  width: 48,
  height: 48,
  borderRadius: 24,
  backgroundColor: '#FFFFFF',
  ...layout.center,
  marginRight: 12,
  borderWidth: 1,
  borderColor: '#E5E7EB',
}

const $stepContent: ViewStyle = {
  flex: 1,
}

const $stepTitle: TextStyle = {
  fontSize: 16,
  fontWeight: '600',
  color: '#1F2937',
  marginBottom: 4,
}

const $stepDescription: TextStyle = {
  fontSize: 14,
  color: '#6B7280',
  lineHeight: 20,
}

const $footer: ViewStyle = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  paddingVertical: 20,
  paddingHorizontal: 24,
  backgroundColor: '#FFFFFF',
  borderTopWidth: 1,
  borderTopColor: '#E5E7EB',
}

const $button: ViewStyle = {
  height: 56,
  backgroundColor: '#000000',
  borderRadius: 12,
  ...shadowElevation(3),
} 