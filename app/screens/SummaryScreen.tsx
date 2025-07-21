import React, { FC } from 'react'
import { View, ViewStyle, TextStyle, StatusBar, Platform } from 'react-native'
import { Screen } from '@/components/Screen'
import { Text } from '@/components/Text'
import { Button } from '@/components/Button'
import { useAppTheme } from '@/theme/context'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/services/api'
import { shadowElevation } from '@/theme/styleHelpers'

interface Props {
  navigation?: any
  route?: { params?: { title: string; summary: string; goal: string } }
}

export const SummaryScreen: FC<Props> = ({ navigation, route }) => {
  const { themed } = useAppTheme()
  const { isAuthenticated, setIsOnboarded } = useAuth()
  const { title, summary } = route?.params || {}

  const handlePress = async () => {
    if (isAuthenticated) {
      // Ensure onboarding marked complete just in case
      try {
        await api.completeOnboarding()
        setIsOnboarded(true)
      } catch {}

      if (navigation?.navigate) {
        navigation.navigate('Main' as any)
      } else {
        navigation?.replace?.('Main' as any)
      }
    } else {
      // Not signed in yet, go to signup
      if (navigation?.navigate) {
        navigation.navigate('Signup')
      } else {
        navigation?.replace?.('Signup')
      }
    }
  }

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <Screen preset="fixed" safeAreaEdges={["top", "bottom"]} contentContainerStyle={$container}>
        <View style={$content}>
          <Text preset="headline" text={title} style={themed($titleText)} />
          <Text preset="body" text={summary} style={$bodyText} />
        </View>
        <Button
          text={isAuthenticated ? 'Explore the App' : 'Create Account'}
          preset="primary"
          onPress={handlePress}
          style={$button}
        />
      </Screen>
    </>
  )
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: '#FFFFFF',
  paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  justifyContent: 'space-between',
  paddingHorizontal: 24,
  paddingBottom: 24,
}

const $content: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  backgroundColor: 'rgba(42, 161, 153, 0.03)',
  borderRadius: 24,
  padding: 24,
  ...shadowElevation(2),
}

const $titleText: TextStyle = {
  textAlign: 'center',
  marginBottom: 16,
  color: '#2AA199',
  fontSize: 26,
  lineHeight: 34,
  fontWeight: '600',
}

const $bodyText: TextStyle = {
  textAlign: 'center',
  fontSize: 16,
  lineHeight: 24,
  color: '#666666',
}

const $button: ViewStyle = {
  height: 48,
  backgroundColor: '#2AA199',
  ...shadowElevation(3),
  marginTop: 24,
} 