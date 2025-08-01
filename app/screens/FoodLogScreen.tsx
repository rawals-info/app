import React, { useState, useEffect } from "react"
import {
  View,
  ViewStyle,
  TextStyle,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
  Alert,
} from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { useAppTheme } from "@/theme/context"
import { layout, shadowElevation } from "@/theme/styleHelpers"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import type { NavigationProp } from "@react-navigation/native"
import { LinearGradient } from "expo-linear-gradient"
import { mealService, MealData } from "@/services/mealService"
import { useAuth } from "@/context/AuthContext"

const { width } = Dimensions.get("window")

type MealType = 'breakfast' | 'brunch' | 'lunch' | 'dinner' | 'snack'
type InputMethod = 'photo' | 'voice' | 'quick_add' | 'same_as_last'

interface InputMethodCard {
  id: InputMethod
  title: string
  subtitle: string
  icon: keyof typeof Ionicons.glyphMap
  gradient: [string, string]
  route: string
}

const INPUT_METHODS: InputMethodCard[] = [
  {
    id: 'photo',
    title: '📸 Take Photo',
    subtitle: 'Snap your meal for AI analysis',
    icon: 'camera',
    gradient: ['#FF6B6B', '#FF8E8E'],
    route: 'PhotoMeal'
  },
  {
    id: 'voice',
    title: '🎤 Voice Log',
    subtitle: 'Describe what you ate',
    icon: 'mic',
    gradient: ['#4ECDC4', '#44A08D'],
    route: 'VoiceMeal'
  },
  {
    id: 'quick_add',
    title: '⚡ Quick Add',
    subtitle: 'Type foods manually',
    icon: 'add-circle',
    gradient: ['#45B7D1', '#96CEB4'],
    route: 'QuickAdd'
  },
  {
    id: 'same_as_last',
    title: '🔄 Same as Last',
    subtitle: 'Repeat recent meal',
    icon: 'repeat',
    gradient: ['#F7B731', '#FC4A1A'],
    route: 'SameAsLast'
  }
]

const MEAL_TYPES: { type: MealType; label: string; icon: keyof typeof Ionicons.glyphMap; time: string }[] = [
  { type: 'breakfast', label: 'Breakfast', icon: 'sunny', time: '7-10 AM' },
  { type: 'brunch', label: 'Brunch', icon: 'cafe', time: '10-12 PM' },
  { type: 'lunch', label: 'Lunch', icon: 'restaurant', time: '12-3 PM' },
  { type: 'dinner', label: 'Dinner', icon: 'moon', time: '6-9 PM' },
  { type: 'snack', label: 'Snack', icon: 'nutrition', time: 'Anytime' },
]

export const FoodLogScreen = () => {
  const { theme: { colors } } = useAppTheme()
  const navigation = useNavigation<NavigationProp<any>>()
  const { user } = useAuth()
  const [selectedMealType, setSelectedMealType] = useState<MealType>('lunch')
  const [recentMeals, setRecentMeals] = useState<MealData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    loadRecentMeals()
    setSmartMealType()
  }, [])

  const loadRecentMeals = async () => {
    try {
      const response = await mealService.getRecentMeals(3)
      if ((response as any)?.data?.meals) {
        setRecentMeals((response as any).data.meals)
      }
    } catch (error) {
      console.error("Error loading recent meals:", error)
    }
  }

  const setSmartMealType = () => {
    const hour = new Date().getHours()
    if (hour >= 6 && hour < 10) setSelectedMealType('breakfast')
    else if (hour >= 10 && hour < 12) setSelectedMealType('brunch')
    else if (hour >= 12 && hour < 17) setSelectedMealType('lunch')
    else if (hour >= 17 && hour < 22) setSelectedMealType('dinner')
    else setSelectedMealType('snack')
  }

  const handleInputMethodSelect = (method: InputMethod) => {
    const baseData = {
      mealType: selectedMealType,
      loggedAt: new Date().toISOString(),
      inputMethod: method,
    }

    switch (method) {
      case 'photo':
        Alert.alert(
          "Photo Capture Coming Soon",
          "Photo meal logging with AI analysis is under development. Use Quick Add for now.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Try Quick Add", onPress: () => navigation.navigate('QuickAddMeal', { mealData: baseData }) }
          ]
        )
        break
      case 'voice':
        navigation.navigate('VoiceMeal', { mealData: baseData })
        break
      case 'quick_add':
        navigation.navigate('QuickAddMeal', { mealData: baseData })
        break
      case 'same_as_last':
        if (recentMeals.length > 0) {
          Alert.alert(
            "Same as Last Coming Soon",
            "Repeating recent meals is under development. Use Quick Add for now.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Try Quick Add", onPress: () => navigation.navigate('QuickAddMeal', { mealData: baseData }) }
            ]
          )
        } else {
          // Fallback to quick add if no recent meals
          navigation.navigate('QuickAddMeal', { mealData: baseData })
        }
        break
    }
  }

  if (showSuccess) {
    return (
      <Screen preset="fixed" safeAreaEdges={["top", "bottom"]} contentContainerStyle={$successContainer}>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        
        <View style={$successContent}>
          <View style={$successIconContainer}>
            <Ionicons name="checkmark-circle" size={80} color="#2AA199" />
          </View>
          
          <Text preset="headline" text="Meal Logged Successfully!" style={$successTitle} />
          <Text preset="default" text="Your meal has been recorded and is being processed by AI for nutritional analysis." style={$successMessage} />
          
          <TouchableOpacity 
            style={$successButton}
            onPress={() => {
              navigation.goBack()
            }}
          >
            <Text preset="button" text="Continue" style={$successButtonText} />
          </TouchableOpacity>
        </View>
      </Screen>
    )
  }

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <Screen preset="scroll" safeAreaEdges={["top", "bottom"]} contentContainerStyle={$container}>
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
            <Text preset="headline" text="Log Your Meal" style={$headerTitle} />
            <Text preset="default" text="Track what you eat for better health insights" style={$headerSubtitle} />
          </View>
        </View>

        <ScrollView style={$scrollView} showsVerticalScrollIndicator={false}>
          {/* Meal Type Selection */}
          <View style={$section}>
            <Text preset="sectionTitle" text="What type of meal?" style={$sectionTitle} />
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={$mealTypesContainer}
            >
              {MEAL_TYPES.map((meal) => (
                <TouchableOpacity
                  key={meal.type}
                  style={[
                    $mealTypeCard,
                    selectedMealType === meal.type && $mealTypeCardActive
                  ]}
                  onPress={() => setSelectedMealType(meal.type)}
                >
                  <Ionicons 
                    name={meal.icon} 
                    size={24} 
                    color={selectedMealType === meal.type ? '#FFFFFF' : '#2AA199'} 
                  />
                  <Text 
                    preset="button" 
                    text={meal.label} 
                    style={[
                      $mealTypeLabel,
                      selectedMealType === meal.type && $mealTypeLabelActive
                    ]} 
                  />
                  <Text 
                    preset="default" 
                    text={meal.time} 
                    style={[
                      $mealTypeTime,
                      selectedMealType === meal.type && $mealTypeTimeActive
                    ]} 
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Input Methods */}
          <View style={$section}>
            <Text preset="sectionTitle" text="How would you like to log it?" style={$sectionTitle} />
            <View style={$inputMethodsGrid}>
              {INPUT_METHODS.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={$inputMethodCard}
                  onPress={() => handleInputMethodSelect(method.id)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={method.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={$inputMethodGradient}
                  >
                    <View style={$inputMethodIconContainer}>
                      <Ionicons name={method.icon} size={32} color="#FFFFFF" />
                    </View>
                    
                    <View style={$inputMethodContent}>
                      <Text preset="button" text={method.title} style={$inputMethodTitle} />
                      <Text preset="default" text={method.subtitle} style={$inputMethodSubtitle} />
                    </View>
                    
                    <View style={$inputMethodArrow}>
                      <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recent Meals */}
          {recentMeals.length > 0 && (
            <View style={$section}>
              <Text preset="sectionTitle" text="Recent Meals" style={$sectionTitle} />
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={$recentMealsContainer}
              >
                {recentMeals.map((meal) => (
                  <TouchableOpacity
                    key={meal.id}
                    style={$recentMealCard}
                    onPress={() => handleInputMethodSelect('same_as_last')}
                  >
                    <View style={$recentMealHeader}>
                      <Text preset="button" text={meal.mealType} style={$recentMealType} />
                      <Text preset="default" text={new Date(meal.loggedAt).toLocaleDateString()} style={$recentMealDate} />
                    </View>
                    
                    {meal.items && meal.items.length > 0 && (
                      <View style={$recentMealItems}>
                        {meal.items.slice(0, 2).map((item, index) => (
                          <Text 
                            key={index}
                            preset="default" 
                            text={item.foodItem?.name || 'Food item'} 
                            style={$recentMealItem} 
                          />
                        ))}
                        {meal.items.length > 2 && (
                          <Text preset="default" text={`+${meal.items.length - 2} more`} style={$recentMealMore} />
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
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
  fontSize: 26,
  lineHeight: 34,
  fontWeight: '600',
  color: '#2AA199',
  marginBottom: 4,
}

const $headerSubtitle: TextStyle = {
  fontSize: 16,
  lineHeight: 22,
  color: '#666666',
}

const $scrollView: ViewStyle = {
  flex: 1,
}

const $section: ViewStyle = {
  paddingHorizontal: 24,
  marginBottom: 32,
}

const $sectionTitle: TextStyle = {
  fontSize: 20,
  lineHeight: 26,
  fontWeight: '600',
  color: '#333333',
  marginBottom: 16,
}

const $mealTypesContainer: ViewStyle = {
  paddingRight: 24,
}

const $mealTypeCard: ViewStyle = {
  backgroundColor: '#FFFFFF',
  borderRadius: 16,
  padding: 16,
  marginRight: 12,
  minWidth: 100,
  alignItems: 'center',
  borderWidth: 2,
  borderColor: 'rgba(42, 161, 153, 0.2)',
  ...shadowElevation(2),
}

const $mealTypeCardActive: ViewStyle = {
  backgroundColor: '#2AA199',
  borderColor: '#2AA199',
}

const $mealTypeLabel: TextStyle = {
  fontSize: 14,
  fontWeight: '600',
  color: '#2AA199',
  marginTop: 8,
  marginBottom: 4,
}

const $mealTypeLabelActive: TextStyle = {
  color: '#FFFFFF',
}

const $mealTypeTime: TextStyle = {
  fontSize: 12,
  color: '#666666',
}

const $mealTypeTimeActive: TextStyle = {
  color: 'rgba(255, 255, 255, 0.8)',
}

const $inputMethodsGrid: ViewStyle = {
  gap: 16,
}

const $inputMethodCard: ViewStyle = {
  borderRadius: 16,
  overflow: 'hidden',
  ...shadowElevation(4),
}

const $inputMethodGradient: ViewStyle = {
  ...layout.row,
  padding: 20,
  alignItems: 'center',
}

const $inputMethodIconContainer: ViewStyle = {
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  ...layout.center,
  marginRight: 16,
}

const $inputMethodContent: ViewStyle = {
  flex: 1,
}

const $inputMethodTitle: TextStyle = {
  fontSize: 18,
  fontWeight: '600',
  color: '#FFFFFF',
  marginBottom: 4,
}

const $inputMethodSubtitle: TextStyle = {
  fontSize: 14,
  color: 'rgba(255, 255, 255, 0.8)',
}

const $inputMethodArrow: ViewStyle = {
  marginLeft: 16,
}

const $recentMealsContainer: ViewStyle = {
  paddingRight: 24,
}

const $recentMealCard: ViewStyle = {
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  padding: 16,
  marginRight: 12,
  width: 200,
  borderWidth: 1,
  borderColor: 'rgba(0, 0, 0, 0.1)',
  ...shadowElevation(2),
}

const $recentMealHeader: ViewStyle = {
  marginBottom: 8,
}

const $recentMealType: TextStyle = {
  fontSize: 16,
  fontWeight: '600',
  color: '#2AA199',
  textTransform: 'capitalize',
  marginBottom: 2,
}

const $recentMealDate: TextStyle = {
  fontSize: 12,
  color: '#666666',
}

const $recentMealItems: ViewStyle = {
  gap: 2,
}

const $recentMealItem: TextStyle = {
  fontSize: 14,
  color: '#333333',
}

const $recentMealMore: TextStyle = {
  fontSize: 12,
  color: '#666666',
  fontStyle: 'italic',
}

const $successContainer: ViewStyle = {
  flex: 1,
  backgroundColor: '#FFFFFF',
  ...layout.center,
}

const $successContent: ViewStyle = {
  alignItems: 'center',
  paddingHorizontal: 32,
}

const $successIconContainer: ViewStyle = {
  marginBottom: 24,
}

const $successTitle: TextStyle = {
  fontSize: 24,
  fontWeight: '600',
  color: '#2AA199',
  textAlign: 'center',
  marginBottom: 16,
}

const $successMessage: TextStyle = {
  fontSize: 16,
  lineHeight: 24,
  color: '#666666',
  textAlign: 'center',
  marginBottom: 32,
}

const $successButton: ViewStyle = {
  backgroundColor: '#2AA199',
  paddingHorizontal: 32,
  paddingVertical: 12,
  borderRadius: 25,
  ...shadowElevation(3),
}

const $successButtonText: TextStyle = {
  color: '#FFFFFF',
  fontSize: 16,
  fontWeight: '600',
} 