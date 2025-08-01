import React, { useState, useEffect } from "react"
import { View, ViewStyle, TextStyle, ScrollView, TouchableOpacity } from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { useAuth } from "@/context/AuthContext"
import { useAppTheme } from "@/theme/context"
import { layout, shadowElevation } from "@/theme/styleHelpers"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { AppStackScreenProps } from "@/navigators/AppNavigator"
import { bloodSugarService, BloodSugarReading } from "@/services/bloodSugarService"
import { mealService, MealData } from "@/services/mealService"

interface LatestReading {
  value: number
  unit: string
  readingDateTime: string
  readingType: string
}

interface LatestMeal {
  mealType: string
  loggedAt: string
  itemCount: number
  totalCalories: number
}

export const HomeScreen = () => {
  const { user } = useAuth()
  const { theme: { colors } } = useAppTheme()
  const navigation = useNavigation<AppStackScreenProps<"Main">["navigation"]>()
  const [latestReading, setLatestReading] = useState<LatestReading | null>(null)
  const [latestMeal, setLatestMeal] = useState<LatestMeal | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch latest blood sugar reading
  useEffect(() => {
    fetchLatestReading()
    fetchLatestMeal()
  }, [])

  const fetchLatestReading = async () => {
    try {
      setIsLoading(true)
      const response = await bloodSugarService.getReadings({ limit: 1, offset: 0 })
      if (response && (response as any)?.data?.readings && (response as any).data.readings.length > 0) {
        const reading = (response as any).data.readings[0]
        setLatestReading({
          value: reading.value,
          unit: reading.unit,
          readingDateTime: reading.readingDateTime,
          readingType: reading.readingType
        })
      }
    } catch (error) {
      console.error("Error fetching latest reading:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchLatestMeal = async () => {
    try {
      const response = await mealService.getMeals({ limit: 1, offset: 0 })
      if ((response as any)?.data?.meals && (response as any).data.meals.length > 0) {
        const meal = (response as any).data.meals[0]
        const itemCount = meal.items?.length || 0
        const totalCalories = meal.items?.reduce((sum: number, item: any) => sum + (item.caloriesEst || 0), 0) || 0
        
        setLatestMeal({
          mealType: meal.mealType,
          loggedAt: meal.loggedAt,
          itemCount,
          totalCalories
        })
      }
    } catch (error) {
      console.error("Error fetching latest meal:", error)
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return diffInMinutes <= 1 ? "Just now" : `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const getReadingTypeDisplay = (type: string) => {
    switch (type) {
      case 'fasting': return 'Fasting'
      case 'after_meal': return 'Post-meal'
      case 'before_meal': return 'Pre-meal'
      case 'random': return 'Random'
      case 'bedtime': return 'Bedtime'
      default: return type
    }
  }

  const handleLogBloodSugar = () => {
    navigation.navigate("BloodSugarLog")
    // Refresh data when returning from logging
    setTimeout(() => fetchLatestReading(), 1000)
  }

  const handleLogFood = () => {
    navigation.navigate("FoodLog")
    setTimeout(() => fetchLatestMeal(), 1000) // Refresh data
  }

  const getMealTypeDisplay = (type: string) => {
    switch (type) {
      case 'breakfast': return 'Breakfast'
      case 'brunch': return 'Brunch'
      case 'lunch': return 'Lunch'
      case 'dinner': return 'Dinner'
      case 'snack': return 'Snack'
      default: return type
    }
  }

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$container}>
      {/* Welcome Card */}
      <View style={$headerCard}>
        <Text preset="headline" text={`Hello! Welcome to the App${user?.firstName ? `, ${user.firstName}` : ''}`} style={$heading}/>
        <Text preset="body" text="Track your progress and stay healthy" style={$subheading}/>
      </View>

      <ScrollView style={$content} showsVerticalScrollIndicator={false}>
        {/* Quick Stats */}
        <View style={$statsContainer}>
          <TouchableOpacity style={$statCard} onPress={handleLogBloodSugar}>
            <View style={$iconContainer}>
              <Ionicons name="pulse" size={24} color={colors.tint} />
            </View>
            <Text preset="button" text="Blood Sugar" style={$statTitle}/>
            {isLoading ? (
              <Text preset="default" text="Loading..." style={$statValue}/>
            ) : latestReading ? (
              <>
                <Text preset="default" text={`${latestReading.value} ${latestReading.unit}`} style={[$statValue, $bloodSugarValue]}/>
                <Text preset="default" text={getReadingTypeDisplay(latestReading.readingType)} style={$readingType}/>
                <Text preset="default" text={formatDateTime(latestReading.readingDateTime)} style={$timeAgo}/>
              </>
            ) : (
              <Text preset="default" text="Not recorded" style={$statValue}/>
            )}
            {/* Card Action */}
            <View style={$cardAction}>
              <Ionicons name="chevron-forward" size={20} color="#2AA199" />
            </View>
          </TouchableOpacity>

          {/* Food Log Card */}
          <TouchableOpacity style={$statCard} onPress={handleLogFood}>
            <View style={$statIconContainer}>
              <Ionicons name="restaurant" size={28} color="#FF6B6B" />
            </View>
            <Text preset="button" text="Food Log" style={$statTitle}/>
            {latestMeal ? (
              <>
                <Text preset="default" text={getMealTypeDisplay(latestMeal.mealType)} style={[$statValue, $mealValue]}/>
                <Text preset="default" text={`${latestMeal.itemCount} items • ${latestMeal.totalCalories} cal`} style={$mealDetails}/>
                <Text preset="default" text={formatDateTime(latestMeal.loggedAt)} style={$timeAgo}/>
              </>
            ) : (
              <Text preset="default" text="Not recorded" style={$statValue}/>
            )}
            {/* Card Action */}
            <View style={$cardAction}>
              <Ionicons name="chevron-forward" size={20} color="#FF6B6B" />
            </View>
          </TouchableOpacity>

          {/* Goals Card */}
          <TouchableOpacity style={$statCard} onPress={() => {}}>
            <View style={$iconContainer}>
              <Ionicons name="trophy" size={24} color={colors.tint} />
            </View>
            <Text preset="button" text="Goals" style={$statTitle}/>
            <Text preset="default" text="Set your health goals" style={$statValue}/>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={$actionsSection}>
          <Text preset="button" text="Quick Actions" style={$sectionTitle}/>
          <Button
            text="Log Blood Sugar"
            preset="primary"
            onPress={handleLogBloodSugar}
            style={$actionButton}
            size="small"
            LeftAccessory={(props) => (
              <Ionicons 
                name="add-circle-outline" 
                size={16} 
                color="#FFFFFF" 
                style={{ marginRight: 6 }} 
              />
            )}
          />
        </View>

        {/* Tips Section */}
        <View style={$tipsSection}>
          <Text preset="button" text="Daily Tips" style={$sectionTitle}/>
          <View style={$tipCard}>
            <Ionicons name="bulb" size={24} color={colors.tint} style={$tipIcon}/>
            <Text preset="body" text="Regular blood sugar monitoring helps you make informed decisions about your health." style={$tipText}/>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={$fab} onPress={handleLogBloodSugar}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </Screen>
  )
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: '#FFFFFF',
}

const $headerCard: ViewStyle = {
  padding: 24,
  backgroundColor: '#2AA199',
  borderBottomLeftRadius: 24,
  borderBottomRightRadius: 24,
  ...shadowElevation(3),
}

const $heading: TextStyle = {
  color: '#FFFFFF',
  textAlign: 'left',
  marginBottom: 8,
}

const $subheading: TextStyle = {
  color: '#FFFFFF',
  opacity: 0.9,
}

const $content: ViewStyle = {
  flex: 1,
  padding: 16,
}

const $statsContainer: ViewStyle = {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  marginTop: 16,
  gap: 16,
}

const $statCard: ViewStyle = {
  backgroundColor: '#FFFFFF',
  borderRadius: 16,
  padding: 16,
  width: '47%',
  ...shadowElevation(2),
  borderWidth: 1,
  borderColor: 'rgba(0,0,0,0.05)',
}

const $iconContainer: ViewStyle = {
  width: 48,
  height: 48,
  borderRadius: 24,
  backgroundColor: 'rgba(42, 161, 153, 0.1)',
  ...layout.center,
  marginBottom: 12,
}

const $statIconContainer: ViewStyle = {
  width: 48,
  height: 48,
  borderRadius: 24,
  backgroundColor: 'rgba(255, 107, 107, 0.1)',
  ...layout.center,
  marginBottom: 12,
}

const $statTitle: TextStyle = {
  fontSize: 14,
  marginBottom: 4,
}

const $statValue: TextStyle = {
  fontSize: 16,
  color: '#666666',
  marginBottom: 8,
}

const $cardAction: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
}

const $actionText: TextStyle = {
  fontSize: 12,
  color: '#2AA199',
  fontWeight: '500',
}

const $actionsSection: ViewStyle = {
  marginTop: 24,
}

const $actionButton: ViewStyle = {
  borderRadius: 12,
  paddingVertical: 12,
  paddingHorizontal: 16,
}

const $tipsSection: ViewStyle = {
  marginTop: 24,
  marginBottom: 100, // Space for FAB
}

const $sectionTitle: TextStyle = {
  fontSize: 18,
  marginBottom: 16,
}

const $tipCard: ViewStyle = {
  backgroundColor: '#FFFFFF',
  borderRadius: 16,
  padding: 16,
  flexDirection: 'row',
  alignItems: 'center',
  ...shadowElevation(2),
  borderWidth: 1,
  borderColor: 'rgba(0,0,0,0.05)',
}

const $tipIcon: ViewStyle = {
  marginRight: 12,
}

const $tipText: TextStyle = {
  flex: 1,
  fontSize: 14,
  lineHeight: 20,
}

const $fab: ViewStyle = {
  position: 'absolute',
  bottom: 24,
  right: 24,
  width: 56,
  height: 56,
  borderRadius: 28,
  backgroundColor: '#2AA199',
  ...layout.center,
  ...shadowElevation(4),
}

const $bloodSugarValue: TextStyle = {
  fontSize: 18,
  fontWeight: '600',
  color: '#2AA199',
  marginBottom: 2,
}

const $readingType: TextStyle = {
  fontSize: 12,
  color: '#666666',
  marginBottom: 2,
}

const $timeAgo: TextStyle = {
  fontSize: 12,
  color: '#999999',
}

const $mealValue: TextStyle = {
  color: '#FF6B6B',
  textTransform: 'capitalize',
}

const $mealDetails: TextStyle = {
  fontSize: 12,
  color: '#666666',
  marginBottom: 4,
} 