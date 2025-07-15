import React, { FC, useRef, useState, useEffect } from "react"
// eslint-disable-next-line no-restricted-imports
import {
  FlatList,
  View,
  ViewStyle,
  TextStyle,
  Dimensions,
  Pressable,
  Image,
  ImageStyle,
} from "react-native"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { setHasOnboarded } from "@/utils/persistence"

const { width } = Dimensions.get("window")

const CARDS = [
  {
    id: "1",
    title: "🌿 You’re Not Alone — And You’re Not Broken",
    body:
      "Over 77 million people in India live with diabetes — you’re in good company. It’s not your fault; modern lifestyle factors like stress & processed food play a big role. The good news? Thousands reverse Type-2 every year through simple habit changes.",
  },
  {
    id: "2",
    title: "You Can Take Control",
    body:
      "Even after years of high sugar, people improve naturally. Diabetes management is about balance, not restriction — you can still enjoy your favourite foods by learning smart swaps & timing.",
  },
  {
    id: "3",
    title: "Your Comeback Story Starts Now",
    body:
      "Millions have turned their diagnosis into their biggest comeback. With awareness, support, and consistent habits, you can live a full, active, happy life — often with less medication over time.",
  },
]

interface OnboardingScreenProps {
  navigation?: { replace: (route: string) => void }
  route?: unknown
}

export const OnboardingScreen: FC<OnboardingScreenProps> = ({ navigation }) => {
  const flatListRef = useRef<FlatList>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { themed } = useAppTheme()
  const [index, setIndex] = useState(0)

  // Auto-scroll every 4s
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIndex((prev) => {
        const next = prev === CARDS.length - 1 ? 0 : prev + 1
        flatListRef.current?.scrollToIndex({ index: next, animated: true })
        return next
      })
    }, 4000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  function stopAutoScroll() {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  async function finish() {
    await setHasOnboarded()
    navigation?.replace?.("OnboardingGoal")
  }

  function handleNext() {
    stopAutoScroll()
    if (index < CARDS.length - 1) {
      const next = index + 1
      flatListRef.current?.scrollToIndex({ index: next, animated: true })
      setIndex(next)
    } else {
      navigation?.replace?.("OnboardingGoal")
    }
  }

  return (
    <Screen preset="fixed" safeAreaEdges={["top", "bottom"]} contentContainerStyle={$container}>
      <View style={{ flex: 1 }} onTouchStart={stopAutoScroll}>
        {/* --- Onboarding Slides --- */}
        <FlatList
          ref={flatListRef}
          data={CARDS}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[{ width }, $slideContainer]}>
              <View style={themed($card)}>
                <Pressable style={themed($skipInCard)} onPress={finish} hitSlop={10}>
                  <Text text="Skip" weight="medium" />
                </Pressable>

                <Text preset="heading" text={item.title} style={themed($title)} />
                <Text size="lg" text={item.body} style={themed($body)} />

                {/* placeholder illustration */}
                <Image
                  source={require("@assets/placeholder/onboarding-people.png")}
                  style={$illustration}
                  resizeMode="contain"
                />

                {/* Dots inside card */}
                <View style={$dotsContainerInCard}>
                  {CARDS.map((_, i) => (
                    <View key={i} style={[themed($dot), i === index && themed($dotActive)]} />
                  ))}
                </View>
              </View>
            </View>
          )}
          onScrollBeginDrag={stopAutoScroll}
          onMomentumScrollEnd={(ev) => {
            const newIndex = Math.round(ev.nativeEvent.contentOffset.x / width)
            setIndex(newIndex)
          }}
        />

        {/* Floating CTA */}
        <Pressable style={themed($cta)} onPress={handleNext}>
          <Text text={index === CARDS.length - 1 ? "Get Started" : "Next"} weight="medium" />
        </Pressable>
      </View>
    </Screen>
  )
}

const $container: ViewStyle = {
  flex: 1,
}

const $slideContainer: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
}

const $card: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  borderRadius: 32,
  borderWidth: 1,
  borderColor: colors.border,
  paddingVertical: spacing.xl,
  paddingHorizontal: spacing.lg,
  width: width * 0.85,
  minHeight: "85%",
  alignSelf: "center",
  justifyContent: "flex-start",
})

const $title: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.tint,
  marginBottom: spacing.sm,
})

const $body: ThemedStyle<TextStyle> = ({ spacing }) => ({
  lineHeight: 24,
})

const $dotsContainerInCard: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: 6,
  marginTop: 24,
}

const $dot: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: colors.tintInactive,
})

const $dotActive: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.tint,
})

const $cta: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  position: "absolute",
  bottom: spacing.xl,
  right: spacing.lg,
  backgroundColor: colors.tint,
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.sm,
  borderRadius: 24,
})

const $skipInCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  position: "absolute",
  top: spacing.sm,
  right: spacing.sm,
})

const $illustration: ImageStyle = {
  flex: 1,
  width: "100%",
  marginTop: 24,
} 