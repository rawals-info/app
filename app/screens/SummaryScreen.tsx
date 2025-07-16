import React, { FC } from 'react'
import { View, ViewStyle, TextStyle, StatusBar, Platform } from 'react-native'
import { Screen } from '@/components/Screen'
import { Text } from '@/components/Text'
import { Button } from '@/components/Button'
import { useAppTheme } from '@/theme/context'

interface Props {
  navigation?: any
  route?: { params?: { title: string; summary: string; goal: string } }
}

export const SummaryScreen: FC<Props> = ({ navigation, route }) => {
  const { themed } = useAppTheme()
  const { title, summary } = route?.params || {}

  const handleSignup = () => {
    if (navigation?.navigate) {
      navigation.navigate('Signup')
    } else {
      navigation?.replace?.('Signup')
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
        <Button text="Create Account" preset="primary" onPress={handleSignup} style={$button} />
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
}

const $titleText: TextStyle = {
  textAlign: 'center',
  marginBottom: 16,
}

const $bodyText: TextStyle = {
  textAlign: 'center',
  fontSize: 16,
  lineHeight: 24,
  color: '#333333',
}

const $button: ViewStyle = {
  height: 48,
} 