import React, { FC, useRef, useState, useEffect } from "react"
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
  ScrollView,
} from "react-native"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { useAuth } from "@/context/AuthContext"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { useAppTheme } from "@/theme/context"
import { layout, shadowElevation } from "@/theme/styleHelpers"

const { width, height } = Dimensions.get("window")

// Assurance Cards Data
const ASSURANCE_CARDS = [
  {
    id: "1",
    title: "Manage Your Diabetes",
    subtitle: "Easily monitor your blood sugar levels and track your medication.",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop", // Placeholder
  },
  {
    id: "2", 
    title: "Track Your Progress",
    subtitle: "Log your meals, activity, and medication to see how they impact your health.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop", // Placeholder
  },
  {
    id: "3",
    title: "Get Personalized Insights", 
    subtitle: "Receive tailored recommendations to help you stay on track with your diabetes management.",
    image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=300&fit=crop", // Placeholder
  },
]

// Tutorial Videos Data  
const TUTORIAL_VIDEOS = [
  {
    id: "1",
    title: "Learn How to Use the App",
    subtitle: "Watch a quick tutorial on how to get started with the app.",
    thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop", // Placeholder
  },
  {
    id: "2",
    title: "Discover Advanced Features", 
    subtitle: "Explore advanced features like data analysis and trend tracking.",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop", // Placeholder
  },
  {
    id: "3",
    title: "Share your Progress with Your Caregivers",
    subtitle: "Learn how to share your progress with your caregivers.",
    thumbnail: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop", // Placeholder
  },
]

interface LoginScreenProps {
  navigation?: any
  route?: unknown
}

export const LoginScreen: FC<LoginScreenProps> = ({ navigation }) => {
  const assuranceListRef = useRef<FlatList>(null)
  const tutorialListRef = useRef<FlatList>(null)
  const assuranceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const tutorialTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  const { themed, theme } = useAppTheme()
  const { setUser, isAuthenticated, isOnboarded } = useAuth()
  
  const [assuranceIndex, setAssuranceIndex] = useState(0)
  const [tutorialIndex, setTutorialIndex] = useState(0)

  // Auto-scroll for assurance cards
  useEffect(() => {
    assuranceTimerRef.current = setInterval(() => {
      if (assuranceIndex < ASSURANCE_CARDS.length - 1) {
        scrollAssuranceToIndex(assuranceIndex + 1)
      } else {
        scrollAssuranceToIndex(0)
      }
    }, 4000)

    return () => {
      if (assuranceTimerRef.current) clearInterval(assuranceTimerRef.current)
    }
  }, [assuranceIndex])

  // Auto-scroll for tutorial videos
  useEffect(() => {
    tutorialTimerRef.current = setInterval(() => {
      if (tutorialIndex < TUTORIAL_VIDEOS.length - 1) {
        scrollTutorialToIndex(tutorialIndex + 1)
      } else {
        scrollTutorialToIndex(0)
      }
    }, 5000) // Different timing from assurance cards

    return () => {
      if (tutorialTimerRef.current) clearInterval(tutorialTimerRef.current)
    }
  }, [tutorialIndex])

  function scrollAssuranceToIndex(idx: number) {
    assuranceListRef.current?.scrollToOffset({
      offset: idx * (width * 0.8),
      animated: true,
    })
    // Restart auto-scroll after 3 seconds when manually navigated
    setTimeout(() => {
      if (!assuranceTimerRef.current) {
        assuranceTimerRef.current = setInterval(() => {
          if (assuranceIndex < ASSURANCE_CARDS.length - 1) {
            scrollAssuranceToIndex(assuranceIndex + 1)
          } else {
            scrollAssuranceToIndex(0)
          }
        }, 4000)
      }
    }, 3000)
  }

  function scrollTutorialToIndex(idx: number) {
    tutorialListRef.current?.scrollToOffset({
      offset: idx * (width * 0.7),
      animated: true,
    })
    // Restart auto-scroll after 3 seconds when manually navigated
    setTimeout(() => {
      if (!tutorialTimerRef.current) {
        tutorialTimerRef.current = setInterval(() => {
          if (tutorialIndex < TUTORIAL_VIDEOS.length - 1) {
            scrollTutorialToIndex(tutorialIndex + 1)
          } else {
            scrollTutorialToIndex(0)
          }
        }, 5000)
      }
    }, 3000)
  }

  function stopAssuranceAutoScroll() {
    if (assuranceTimerRef.current) {
      clearInterval(assuranceTimerRef.current)
      assuranceTimerRef.current = null
    }
  }

  function stopTutorialAutoScroll() {
    if (tutorialTimerRef.current) {
      clearInterval(tutorialTimerRef.current)
      tutorialTimerRef.current = null
    }
  }

  function handleSkip() {
    // Check if user is already authenticated
    if (isAuthenticated) {
      // If authenticated, navigate based on onboarding status
      if (isOnboarded) {
        navigation?.navigate?.("Main")
      } else {
        navigation?.navigate?.("Onboarding")
      }
    } else {
      // Generate anonymous user ID and navigate to home
      const anonymousUserId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      setUser({ id: anonymousUserId, isAnonymous: true })
      navigation?.navigate?.("Main")
    }
  }

  function handleGetStarted() {
    navigation?.navigate?.("OnboardingGoal")
  }

  function handleLogin() {
    navigation?.navigate?.("LoginForm")
  }

  function handleAssuranceScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / (width * 0.8))
    if (newIndex !== assuranceIndex && newIndex >= 0 && newIndex < ASSURANCE_CARDS.length) {
      setAssuranceIndex(newIndex)
    }
  }

  function handleTutorialScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / (width * 0.7))
    if (newIndex !== tutorialIndex && newIndex >= 0 && newIndex < TUTORIAL_VIDEOS.length) {
      setTutorialIndex(newIndex)
    }
  }

  function handleAssuranceCardPress(cardId: string) {
    // Phase 2: Open animation
    console.log("Assurance card pressed:", cardId)
  }

  function handleTutorialVideoPress(videoId: string) {
    // Future: Play video
    console.log("Tutorial video pressed:", videoId)
  }

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <Screen preset="fixed" contentContainerStyle={$container} safeAreaEdges={[]}>
        <ScrollView 
          style={$scrollView}
          contentContainerStyle={$scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header with Skip Button */}
          <View style={$header}>
            <Button
              text="Skip"
              preset="ghost"
              size="small"
              style={$skipButton}
              textStyle={$skipButtonText}
              onPress={handleSkip}
            />
          </View>

          {/* Main Content */}
          <View style={$mainContent}>
            {/* Assurance Cards Section */}
            <View style={$section}>
              <Text preset="headline" style={$sectionTitle}>
                Your Health Journey
              </Text>
              <Text preset="body" style={$sectionSubtitle}>
                Empowering you every step of the way
              </Text>
              
              <FlatList
                ref={assuranceListRef}
                data={ASSURANCE_CARDS}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={width * 0.8}
                decelerationRate="fast"
                keyExtractor={(item) => item.id}
                contentContainerStyle={$cardsContainer}
                renderItem={({ item, index }) => (
                  <Pressable 
                    style={[
                      $assuranceCard,
                      index === assuranceIndex && $assuranceCardActive
                    ]}
                    onPress={() => handleAssuranceCardPress(item.id)}
                  >
                    <View style={$cardImageContainer}>
                      <Image 
                        source={{ uri: item.image }} 
                        style={$cardImage}
                        resizeMode="cover"
                      />
                    </View>
                    <View style={$cardContent}>
                      <Text preset="sectionTitle" style={$cardTitle}>
                        {item.title}
                      </Text>
                      <Text preset="body" style={$cardSubtitle}>
                        {item.subtitle}
                      </Text>
                    </View>
                  </Pressable>
                )}
                onScrollBeginDrag={stopAssuranceAutoScroll}
                onMomentumScrollEnd={handleAssuranceScroll}
                scrollEventThrottle={16}
              />

              {/* Assurance Cards Dots */}
              <View style={$dotsContainer}>
                {ASSURANCE_CARDS.map((_, i) => (
                  <Pressable
                    key={i} 
                    style={[
                      $dot, 
                      i === assuranceIndex && $dotActive
                    ]}
                    onPress={() => {
                      stopAssuranceAutoScroll()
                      scrollAssuranceToIndex(i)
                      setAssuranceIndex(i)
                    }}
                    hitSlop={10}
                  />
                ))}
              </View>
            </View>

            {/* Tutorial Videos Section */}
            <View style={$section}>
              <Text preset="headline" style={$sectionTitle}>
                Get Started
              </Text>
              <Text preset="body" style={$sectionSubtitle}>
                Quick tutorials to help you succeed
              </Text>
              
              <FlatList
                ref={tutorialListRef}
                data={TUTORIAL_VIDEOS}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={width * 0.7}
                decelerationRate="fast"
                keyExtractor={(item) => item.id}
                contentContainerStyle={$videosContainer}
                renderItem={({ item, index }) => (
                  <Pressable 
                    style={[
                      $tutorialCard,
                      index === tutorialIndex && $tutorialCardActive
                    ]}
                    onPress={() => handleTutorialVideoPress(item.id)}
                  >
                    <View style={$videoImageContainer}>
                      <Image 
                        source={{ uri: item.thumbnail }} 
                        style={$videoImage}
                        resizeMode="cover"
                      />
                      {/* Play Button Overlay */}
                      <View style={$playButtonOverlay}>
                        <View style={$playButton}>
                          <Text style={$playButtonText}>▶</Text>
                        </View>
                      </View>
                    </View>
                    <View style={$cardContent}>
                      <Text preset="sectionTitle" style={$cardTitle}>
                        {item.title}
                      </Text>
                      <Text preset="body" style={$cardSubtitle}>
                        {item.subtitle}
                      </Text>
                    </View>
                  </Pressable>
                )}
                onScrollBeginDrag={stopTutorialAutoScroll}
                onMomentumScrollEnd={handleTutorialScroll}
                scrollEventThrottle={16}
              />

              {/* Tutorial Videos Dots */}
              <View style={$dotsContainer}>
                {TUTORIAL_VIDEOS.map((_, i) => (
                  <Pressable
                    key={i} 
                    style={[
                      $dot, 
                      i === tutorialIndex && $dotActive
                    ]}
                    onPress={() => {
                      stopTutorialAutoScroll()
                      scrollTutorialToIndex(i)
                      setTutorialIndex(i)
                    }}
                    hitSlop={10}
                  />
                ))}
              </View>
            </View>
          </View>

          {/* Bottom CTA Buttons */}
          <View style={$ctaContainer}>
            <Button
              text="Get Started"
              preset="primary"
              style={$getStartedButton}
              textStyle={$getStartedButtonText}
              onPress={handleGetStarted}
            />
            
            <Button
              text="Login"
              preset="ghost"
              style={$loginButton}
              textStyle={$loginButtonText}
              onPress={handleLogin}
            />
          </View>
        </ScrollView>
      </Screen>
    </>
  )
}

// Styles
const $container: ViewStyle = {
  flex: 1,
  backgroundColor: '#FFFFFF',
}

const $scrollView: ViewStyle = {
  flex: 1,
}

const $scrollContent: ViewStyle = {
  flexGrow: 1,
  paddingBottom: 40,
}

const $header: ViewStyle = {
  ...layout.rowBetween,
  paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 20 : 60,
  paddingHorizontal: 24,
  paddingBottom: 20,
}

const $skipButton: ViewStyle = {
  alignSelf: 'flex-end',
  backgroundColor: 'transparent',
  borderWidth: 1,
  borderColor: '#000000',
  paddingHorizontal: 20,
  paddingVertical: 8,
  borderRadius: 20,
}

const $skipButtonText: TextStyle = {
  color: '#000000',
  fontSize: 16,
  fontWeight: '500',
}

const $mainContent: ViewStyle = {
  flex: 1,
  paddingHorizontal: 0,
}

const $section: ViewStyle = {
  marginBottom: 48,
}

const $sectionTitle: TextStyle = {
  fontSize: 28,
  fontWeight: '700',
  color: '#000000',
  textAlign: 'center',
  marginBottom: 8,
  paddingHorizontal: 24,
}

const $sectionSubtitle: TextStyle = {
  fontSize: 16,
  color: '#666666',
  textAlign: 'center',
  marginBottom: 32,
  paddingHorizontal: 24,
}

const $cardsContainer: ViewStyle = {
  paddingLeft: 24,
  paddingRight: 24,
}

const $videosContainer: ViewStyle = {
  paddingLeft: 24,
  paddingRight: 24,
}

const $assuranceCard: ViewStyle = {
  width: width * 0.8 - 32,
  backgroundColor: '#FFFFFF',
  borderRadius: 16,
  marginRight: 16,
  ...shadowElevation(2),
  borderWidth: 1,
  borderColor: '#F0F0F0',
  overflow: 'hidden',
}

const $assuranceCardActive: ViewStyle = {
  ...shadowElevation(4),
  borderColor: '#000000',
  borderWidth: 2,
}

const $tutorialCard: ViewStyle = {
  width: width * 0.7 - 32,
  backgroundColor: '#FFFFFF',
  borderRadius: 16,
  marginRight: 16,
  ...shadowElevation(2),
  borderWidth: 1,
  borderColor: '#F0F0F0',
  overflow: 'hidden',
}

const $tutorialCardActive: ViewStyle = {
  ...shadowElevation(4),
  borderColor: '#000000',
  borderWidth: 2,
}

const $cardImageContainer: ViewStyle = {
  height: 180,
  position: 'relative',
}

const $cardImage: ImageStyle = {
  width: '100%',
  height: '100%',
}

const $videoImageContainer: ViewStyle = {
  height: 160,
  position: 'relative',
}

const $videoImage: ImageStyle = {
  width: '100%',
  height: '100%',
}

const $playButtonOverlay: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  ...layout.center,
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
}

const $playButton: ViewStyle = {
  width: 48,
  height: 48,
  borderRadius: 24,
  backgroundColor: '#FFFFFF',
  ...layout.center,
  ...shadowElevation(2),
}

const $playButtonText: TextStyle = {
  color: '#000000',
  fontSize: 16,
  marginLeft: 2, // Adjust play icon position
}

const $cardContent: ViewStyle = {
  padding: 20,
}

const $cardTitle: TextStyle = {
  fontSize: 18,
  fontWeight: '600',
  color: '#000000',
  marginBottom: 8,
}

const $cardSubtitle: TextStyle = {
  fontSize: 14,
  color: '#666666',
  lineHeight: 20,
}

const $dotsContainer: ViewStyle = {
  ...layout.row,
  justifyContent: 'center',
  marginTop: 24,
  gap: 8,
}

const $dot: ViewStyle = {
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: '#E0E0E0',
}

const $dotActive: ViewStyle = {
  width: 24,
  backgroundColor: '#000000',
}

const $ctaContainer: ViewStyle = {
  paddingHorizontal: 24,
  paddingTop: 32,
  gap: 16,
}

const $getStartedButton: ViewStyle = {
  height: 56,
  backgroundColor: '#000000',
  borderRadius: 28,
  ...shadowElevation(3),
}

const $getStartedButtonText: TextStyle = {
  color: '#FFFFFF',
  fontSize: 18,
  fontWeight: '600',
}

const $loginButton: ViewStyle = {
  height: 56,
  backgroundColor: 'transparent',
  borderWidth: 2,
  borderColor: '#000000',
  borderRadius: 28,
}

const $loginButtonText: TextStyle = {
  color: '#000000',
  fontSize: 18,
  fontWeight: '600',
}