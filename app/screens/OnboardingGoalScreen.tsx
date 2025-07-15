import React, { FC } from 'react'
// eslint-disable-next-line no-restricted-imports
import { View, Pressable, ViewStyle, TextStyle } from 'react-native'

import { Screen } from '@/components/Screen'
import { Text } from '@/components/Text'
import { useAppTheme } from '@/theme/context'
import type { ThemedStyle } from '@/theme/types'
import { api } from '@/services/api'
import { setHasOnboarded } from '@/utils/persistence'
import { getAuthToken } from '@/utils/persistence'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface Card {
  id: 'prevent' | 'monitor' | 'diagnosed'
  title: string
  color: string
}

const CARDS: Card[] = [
  { id: 'prevent', title: "I'm healthy but want to prevent diabetes", color: '#2ecc71' },
  { id: 'monitor', title: 'I sometimes have high sugar levels', color: '#f1c40f' },
  { id: 'diagnosed', title: "I've been diagnosed with pre/diabetes", color: '#e74c3c' },
]

export const OnboardingGoalScreen: FC<{ navigation?: any }> = ({ navigation }) => {
  const { themed } = useAppTheme()

  async function choose(goal: Card['id']) {
    const token = await getAuthToken()
    if (token) {
      await api.setGoal(goal)
    } else {
      await AsyncStorage.setItem('pendingGoal', goal)
    }
    await setHasOnboarded()
    navigation?.replace?.('Login')
  }

  return (
    <Screen preset="fixed" safeAreaEdges={["top", "bottom"]} contentContainerStyle={$container}>
      <Text preset="heading" text="Why are you here today?" style={themed($heading)} />
      {CARDS.map((c) => (
        <Pressable
          key={c.id}
          style={themed([$card, { backgroundColor: c.color + '20' }])}
          onPress={() => choose(c.id)}
        >
          <Text text={c.title} weight="medium" style={themed($cardText)} />
        </Pressable>
      ))}
    </Screen>
  )
}

const $container: ViewStyle = {
  flex: 1,
  padding: 24,
  justifyContent: 'center',
}

const $heading: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
  textAlign: 'center',
})

const $card: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 16,
  padding: spacing.lg,
  marginBottom: spacing.md,
})

const $cardText: ThemedStyle<TextStyle> = () => ({
  textAlign: 'center',
}) 