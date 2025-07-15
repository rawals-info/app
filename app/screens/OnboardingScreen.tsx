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
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
  Platform,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { setHasOnboarded } from "@/utils/persistence"
import { colors } from "@/theme/colors"
import { layout, shadowElevation } from "@/theme/styleHelpers"

const { width, height } = Dimensions.get("window")

// Enhanced card data with images and accent colors
const CARDS = [
  {
    id: "1",
    title: "🌿 You're Not Alone — And You're Not Broken",
    body:
      "Over 77 million people in India live with diabetes — you're in good company. It's not your fault; modern lifestyle factors like stress & processed food play a big role. The good news? Thousands reverse Type-2 every year through simple habit changes.",
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
  const { themed, theme } = useAppTheme()
  const [index, setIndex] = useState(0)

  // Auto-scroll every 4s
  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (index < CARDS.length - 1) {
        scrollToIndex(index + 1)
      } else {
        scrollToIndex(0)
      }
    }, 4000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [index])

  function scrollToIndex(idx: number) {
    flatListRef.current?.scrollToOffset({
      offset: idx * width,
      animated: true,
    })
  }

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
      scrollToIndex(index + 1)
    } else {
      navigation?.replace?.("OnboardingGoal")
    }
  }

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width)
    if (newIndex !== index) {
      setIndex(newIndex)
    }
  }

  // Determine button text based on current index
  const buttonText = index === CARDS.length - 1 ? "Get Started" : "Next"
  const currentCard = CARDS[index]
  
  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <Screen preset="fixed" contentContainerStyle={$container} safeAreaEdges={["bottom"]}>
        <View style={{ flex: 1 }} onTouchStart={stopAutoScroll}>
          {/* --- Header --- */}
          <View style={$header}>
            <Button
              text="Skip"
              preset="ghost"
              size="small"
              style={$skipButton}
              onPress={finish}
            />
          </View>
          
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
                <View style={$cardContent}>
                  <View style={$contentContainer}>
                    <Text preset="headline" text={item.title} style={$title} />
                    <Text preset="body" text={item.body} style={$body} />
                  </View>
                </View>
              </View>
            )}
            onScrollBeginDrag={stopAutoScroll}
            onMomentumScrollEnd={handleScroll}
            onScroll={(event) => {
              // Update index during scroll for smoother dot transitions
              const offsetX = event.nativeEvent.contentOffset.x
              const newIndex = Math.round(offsetX / width)
              if (newIndex !== index && newIndex >= 0 && newIndex < CARDS.length) {
                setIndex(newIndex)
              }
            }}
            scrollEventThrottle={16} // For smooth updates
          />

          {/* Bottom controls container */}
          <View style={$controlsContainer}>
            {/* Dots indicator */}
            <View style={$dotsContainer}>
              {CARDS.map((_, i) => (
                <View 
                  key={i} 
                  style={[
                    $dot, 
                    i === index && $dotActive,
                    { backgroundColor: i === index ? '#2AA199' : 'rgba(42, 161, 153, 0.3)' }
                  ]} 
                />
              ))}
            </View>

            {/* CTA Button */}
            <Button 
              text={buttonText}
              preset="primary"
              style={$ctaButton}
              onPress={handleNext}
            />
          </View>
        </View>
      </Screen>
    </>
  )
}

// Styles
const $container: ViewStyle = {
  flex: 1,
  backgroundColor: '#FFFFFF',
  paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
}

const $header: ViewStyle = {
  ...layout.rowBetween,
  paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 + 20 : 50,
  paddingHorizontal: 24,
  paddingBottom: 20,
}

const $slideContainer: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}

const $cardContent: ViewStyle = {
  flex: 1,
  width: '100%',
  paddingHorizontal: 32,
  paddingVertical: 60, // Increased vertical padding
  justifyContent: 'center',
  alignItems: 'center', // Center content horizontally
}

const $contentContainer: ViewStyle = {
  maxWidth: 500, // Limit width on larger screens
  width: '100%',
  alignItems: 'center', // Center text
}

const $title: TextStyle = {
  fontSize: 26, // Slightly larger
  lineHeight: 34,
  color: '#000000',
  marginBottom: 24,
  fontWeight: '600', // SemiBold works better with Poppins
  letterSpacing: 0,
  textAlign: 'center', // Center text
}

const $body: TextStyle = {
  fontSize: 16,
  lineHeight: 26, // Increased line height for Poppins
  color: '#333333',
  letterSpacing: 0,
  marginBottom: 16,
  textAlign: 'center', // Center text
}

const $controlsContainer: ViewStyle = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  paddingHorizontal: 24,
  ...layout.rowBetween,
  backgroundColor: 'rgba(255,255,255,0.95)',
  paddingTop: 16,
}

const $dotsContainer: ViewStyle = {
  ...layout.row,
  gap: 8,
}

const $dot: ViewStyle = {
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: 'rgba(255,255,255,0.5)',
}

const $dotActive: ViewStyle = {
  width: 24,
  backgroundColor: '#ffffff',
}

const $ctaButton: ViewStyle = {
  ...shadowElevation(4),
  minWidth: 120,
}

const $ctaText: TextStyle = {
  color: '#333',
  fontWeight: 'bold',
  fontSize: 16,
}

const $skipButton: ViewStyle = {
  alignSelf: 'flex-end',
}

const $skipText: TextStyle = {
  color: '#ffffff',
  opacity: 0.8,
  fontSize: 16,
} 