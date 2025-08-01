import React, { useState, useEffect } from "react"
import {
  View,
  ViewStyle,
  TextStyle,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
  FlatList,
} from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { Button } from "@/components/Button"
import { useAppTheme } from "@/theme/context"
import { layout, shadowElevation } from "@/theme/styleHelpers"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import type { NavigationProp } from "@react-navigation/native"
import { mealService, MealData, MealItemData } from "@/services/mealService"
import { useAuth } from "@/context/AuthContext"

interface RouteParams {
  mealData: Partial<MealData>
}

interface FoodItem {
  id: string
  name: string
  variant?: string
  baseGi?: number
  macroProfile?: {
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
  }
}

interface SelectedFoodItem extends FoodItem {
  quantity: number
  unit: 'g' | 'ml' | 'piece' | 'cup' | 'tbsp'
  caloriesEst?: number
  giEst?: number
}

const PORTION_UNITS = [
  { value: 'g', label: 'grams (g)' },
  { value: 'ml', label: 'milliliters (ml)' },
  { value: 'piece', label: 'pieces' },
  { value: 'cup', label: 'cups' },
  { value: 'tbsp', label: 'tablespoons' },
]

const COMMON_PORTIONS = [
  { label: 'Small', multiplier: 0.5 },
  { label: 'Medium', multiplier: 1.0 },
  { label: 'Large', multiplier: 1.5 },
  { label: 'Extra Large', multiplier: 2.0 },
]

export const QuickAddMealScreen = () => {
  const { theme: { colors } } = useAppTheme()
  const navigation = useNavigation<NavigationProp<any>>()
  const route = useRoute()
  const { mealData } = (route.params as RouteParams) || {}
  const { user } = useAuth()

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<FoodItem[]>([])
  const [selectedFoods, setSelectedFoods] = useState<SelectedFoodItem[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [editingFood, setEditingFood] = useState<SelectedFoodItem | null>(null)
  const [notes, setNotes] = useState("")

  useEffect(() => {
    if (searchQuery.length > 2) {
      searchFoods()
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  const searchFoods = async () => {
    setIsSearching(true)
    try {
      const response = await mealService.searchFoods(searchQuery)
      if ((response as any)?.data?.foods) {
        setSearchResults((response as any).data.foods)
      }
    } catch (error) {
      console.error("Error searching foods:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const addFoodItem = (food: FoodItem) => {
    const selectedFood: SelectedFoodItem = {
      ...food,
      quantity: 100,
      unit: 'g',
      caloriesEst: food.macroProfile?.calories || 0,
      giEst: food.baseGi || 50,
    }
    setSelectedFoods(prev => [...prev, selectedFood])
    setSearchQuery("")
    setSearchResults([])
  }

  const updateFoodQuantity = (index: number, quantity: number, unit: 'g' | 'ml' | 'piece' | 'cup' | 'tbsp') => {
    setSelectedFoods(prev => prev.map((food, i) => {
      if (i === index) {
        const baseCalories = food.macroProfile?.calories || 0
        const multiplier = unit === 'piece' ? quantity : quantity / 100
        return {
          ...food,
          quantity,
          unit,
          caloriesEst: Math.round(baseCalories * multiplier),
        }
      }
      return food
    }))
  }

  const removeFoodItem = (index: number) => {
    setSelectedFoods(prev => prev.filter((_, i) => i !== index))
  }

  const createCustomFood = () => {
    Alert.prompt(
      "Add Custom Food",
      "Enter the name of the food item:",
      (text) => {
        if (text && text.trim()) {
          const customFood: FoodItem = {
            id: `custom_${Date.now()}`,
            name: text.trim(),
            macroProfile: {
              calories: 100,
              protein: 5,
              carbs: 15,
              fat: 3,
              fiber: 2,
            }
          }
          addFoodItem(customFood)
        }
      }
    )
  }

  const handleSubmit = async () => {
    if (selectedFoods.length === 0) {
      Alert.alert("No Foods Added", "Please add at least one food item to your meal.")
      return
    }

    setIsSubmitting(true)
    try {
      // Create meal items data
      const mealItems: Omit<MealItemData, 'id'>[] = selectedFoods.map(food => ({
        foodItemId: food.id,
        quantity: food.quantity,
        unit: food.unit,
        caloriesEst: food.caloriesEst,
        giEst: food.giEst,
        source: 'user_estimate',
      }))

      // Create meal record
      const mealPayload: Omit<MealData, 'id'> = {
        ...mealData,
        aiStatus: 'processed', // Since user manually entered, no AI processing needed
        notes: notes || `${selectedFoods.length} food item(s) manually added`,
        items: mealItems,
      } as Omit<MealData, 'id'>

      const response = await mealService.createMeal(mealPayload)
      
      if (response && (response as any)?.success !== false) {
        setShowSuccess(true)
        setTimeout(() => {
          navigation.navigate("FoodLog")
        }, 2000)
      } else {
        throw new Error("Server returned error response")
      }
    } catch (error) {
      console.error("Error submitting meal:", error)
      Alert.alert("Error", "Failed to log meal. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getTotalCalories = () => {
    return selectedFoods.reduce((total, food) => total + (food.caloriesEst || 0), 0)
  }

  if (showSuccess) {
    return (
      <Screen preset="fixed" safeAreaEdges={["top", "bottom"]} contentContainerStyle={$successContainer}>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        
        <View style={$successContent}>
          <View style={$successIconContainer}>
            <Ionicons name="checkmark-circle" size={80} color="#2AA199" />
          </View>
          
          <Text preset="headline" text="Meal Added Successfully!" style={$successTitle} />
          <Text preset="default" text={`Your ${mealData?.mealType || 'meal'} with ${selectedFoods.length} food items has been logged.`} style={$successMessage} />
          
          <TouchableOpacity 
            style={$successButton}
            onPress={() => navigation.navigate("FoodLog")}
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
      <Screen preset="fixed" safeAreaEdges={["top", "bottom"]} contentContainerStyle={$container}>
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
            <Text preset="headline" text="Quick Add Meal" style={$headerTitle} />
            <Text preset="default" text={`Adding to ${mealData?.mealType || 'meal'}`} style={$headerSubtitle} />
          </View>
          
          {selectedFoods.length > 0 && (
            <View style={$caloriesBadge}>
              <Text preset="caption" text={`${getTotalCalories()} cal`} style={$caloriesText} />
            </View>
          )}
        </View>

        <ScrollView style={$scrollView} showsVerticalScrollIndicator={false}>
          {/* Search Section */}
          <View style={$section}>
            <TextField
              label="Search for foods"
              placeholder="e.g., rice, chicken, apple..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              containerStyle={$searchField}
              RightAccessory={() => (
                <TouchableOpacity onPress={createCustomFood}>
                  <Ionicons name="add-circle" size={24} color="#2AA199" />
                </TouchableOpacity>
              )}
            />

            {/* Search Results */}
            {searchResults.length > 0 && (
              <View style={$searchResults}>
                <FlatList
                  data={searchResults}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={$searchResultItem}
                      onPress={() => addFoodItem(item)}
                    >
                      <View style={$searchResultContent}>
                        <Text preset="button" text={item.name} style={$searchResultName} />
                        {item.variant && (
                          <Text preset="caption" text={item.variant} style={$searchResultVariant} />
                        )}
                        {item.macroProfile && (
                          <Text preset="caption" text={`${item.macroProfile.calories} cal/100g`} style={$searchResultCalories} />
                        )}
                      </View>
                      <Ionicons name="add" size={20} color="#2AA199" />
                    </TouchableOpacity>
                  )}
                  style={$searchResultsList}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}

            {isSearching && (
              <View style={$searchLoading}>
                <Text preset="caption" text="Searching foods..." style={$searchLoadingText} />
              </View>
            )}
          </View>

          {/* Selected Foods */}
          {selectedFoods.length > 0 && (
            <View style={$section}>
              <Text preset="sectionTitle" text="Added Foods" style={$sectionTitle} />
              
              {selectedFoods.map((food, index) => (
                <View key={`${food.id}_${index}`} style={$selectedFoodItem}>
                  <View style={$selectedFoodHeader}>
                    <View style={$selectedFoodInfo}>
                      <Text preset="button" text={food.name} style={$selectedFoodName} />
                      {food.variant && (
                        <Text preset="caption" text={food.variant} style={$selectedFoodVariant} />
                      )}
                    </View>
                    
                    <TouchableOpacity 
                      style={$removeFoodButton}
                      onPress={() => removeFoodItem(index)}
                    >
                      <Ionicons name="close-circle" size={20} color="#FF4444" />
                    </TouchableOpacity>
                  </View>

                  {/* Portion Controls */}
                  <View style={$portionControls}>
                    <View style={$quantityInput}>
                      <TextField
                        value={food.quantity.toString()}
                        onChangeText={(text) => {
                          const quantity = parseFloat(text) || 0
                          updateFoodQuantity(index, quantity, food.unit)
                        }}
                        keyboardType="numeric"
                        containerStyle={$quantityField}
                      />
                    </View>
                    
                    <ScrollView 
                      horizontal 
                      showsHorizontalScrollIndicator={false}
                      style={$unitSelector}
                    >
                      {PORTION_UNITS.map((unit) => (
                        <TouchableOpacity
                          key={unit.value}
                          style={[
                            $unitOption,
                            food.unit === unit.value && $unitOptionActive
                          ]}
                          onPress={() => updateFoodQuantity(index, food.quantity, unit.value as any)}
                        >
                          <Text 
                            preset="caption" 
                            text={unit.label} 
                            style={[
                              $unitOptionText,
                              food.unit === unit.value && $unitOptionTextActive
                            ]} 
                          />
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  {/* Quick Portion Buttons */}
                  <View style={$portionButtons}>
                    {COMMON_PORTIONS.map((portion) => (
                      <TouchableOpacity
                        key={portion.label}
                        style={$portionButton}
                        onPress={() => {
                          const baseQuantity = food.unit === 'piece' ? 1 : 100
                          updateFoodQuantity(index, baseQuantity * portion.multiplier, food.unit)
                        }}
                      >
                        <Text preset="caption" text={portion.label} style={$portionButtonText} />
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Nutrition Info */}
                  <View style={$nutritionInfo}>
                    <View style={$nutritionItem}>
                      <Text preset="caption" text="Calories" style={$nutritionLabel} />
                      <Text preset="button" text={`${food.caloriesEst || 0}`} style={$nutritionValue} />
                    </View>
                    {food.giEst && (
                      <View style={$nutritionItem}>
                        <Text preset="caption" text="GI" style={$nutritionLabel} />
                        <Text preset="button" text={`${food.giEst}`} style={$nutritionValue} />
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Notes Section */}
          <View style={$section}>
            <TextField
              label="Notes (optional)"
              placeholder="Any additional details about your meal..."
              value={notes}
              onChangeText={setNotes}
              multiline
              containerStyle={$notesField}
            />
          </View>
        </ScrollView>

        {/* Bottom Actions */}
        {selectedFoods.length > 0 && (
          <View style={$bottomActions}>
            <View style={$summaryInfo}>
              <Text preset="button" text={`${selectedFoods.length} items`} style={$summaryText} />
              <Text preset="button" text={`${getTotalCalories()} calories`} style={$summaryCalories} />
            </View>
            
            <Button 
              text={isSubmitting ? "Saving..." : "Log Meal"}
              onPress={handleSubmit}
              disabled={isSubmitting}
              style={$submitButton}
            />
          </View>
        )}
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
  borderBottomWidth: 1,
  borderBottomColor: 'rgba(0, 0, 0, 0.1)',
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
  fontSize: 24,
  lineHeight: 30,
  fontWeight: '600',
  color: '#2AA199',
  marginBottom: 2,
}

const $headerSubtitle: TextStyle = {
  fontSize: 14,
  lineHeight: 18,
  color: '#666666',
  textTransform: 'capitalize',
}

const $caloriesBadge: ViewStyle = {
  backgroundColor: '#2AA199',
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 12,
}

const $caloriesText: TextStyle = {
  color: '#FFFFFF',
  fontSize: 12,
  fontWeight: '600',
}

const $scrollView: ViewStyle = {
  flex: 1,
}

const $section: ViewStyle = {
  paddingHorizontal: 24,
  marginBottom: 24,
}

const $sectionTitle: TextStyle = {
  fontSize: 18,
  lineHeight: 24,
  fontWeight: '600',
  color: '#333333',
  marginBottom: 16,
}

const $searchField: ViewStyle = {
  marginBottom: 16,
}

const $searchResults: ViewStyle = {
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  ...shadowElevation(2),
  maxHeight: 200,
}

const $searchResultsList: ViewStyle = {
  maxHeight: 200,
}

const $searchResultItem: ViewStyle = {
  ...layout.row,
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderBottomColor: 'rgba(0, 0, 0, 0.05)',
}

const $searchResultContent: ViewStyle = {
  flex: 1,
}

const $searchResultName: TextStyle = {
  fontSize: 16,
  fontWeight: '500',
  color: '#333333',
  marginBottom: 2,
}

const $searchResultVariant: TextStyle = {
  fontSize: 12,
  color: '#666666',
  marginBottom: 2,
}

const $searchResultCalories: TextStyle = {
  fontSize: 12,
  color: '#2AA199',
}

const $searchLoading: ViewStyle = {
  padding: 16,
  alignItems: 'center',
}

const $searchLoadingText: TextStyle = {
  color: '#666666',
}

const $selectedFoodItem: ViewStyle = {
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  padding: 16,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: 'rgba(0, 0, 0, 0.1)',
  ...shadowElevation(2),
}

const $selectedFoodHeader: ViewStyle = {
  ...layout.row,
  alignItems: 'flex-start',
  marginBottom: 12,
}

const $selectedFoodInfo: ViewStyle = {
  flex: 1,
}

const $selectedFoodName: TextStyle = {
  fontSize: 16,
  fontWeight: '600',
  color: '#333333',
  marginBottom: 2,
}

const $selectedFoodVariant: TextStyle = {
  fontSize: 12,
  color: '#666666',
}

const $removeFoodButton: ViewStyle = {
  padding: 4,
}

const $portionControls: ViewStyle = {
  ...layout.row,
  alignItems: 'center',
  marginBottom: 12,
  gap: 12,
}

const $quantityInput: ViewStyle = {
  width: 80,
}

const $quantityField: ViewStyle = {
  marginBottom: 0,
}

const $unitSelector: ViewStyle = {
  flex: 1,
}

const $unitOption: ViewStyle = {
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 16,
  backgroundColor: '#F8F8F8',
  marginRight: 8,
}

const $unitOptionActive: ViewStyle = {
  backgroundColor: '#2AA199',
}

const $unitOptionText: TextStyle = {
  fontSize: 12,
  color: '#666666',
}

const $unitOptionTextActive: TextStyle = {
  color: '#FFFFFF',
}

const $portionButtons: ViewStyle = {
  ...layout.row,
  gap: 8,
  marginBottom: 12,
}

const $portionButton: ViewStyle = {
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 12,
  backgroundColor: 'rgba(42, 161, 153, 0.1)',
}

const $portionButtonText: TextStyle = {
  fontSize: 12,
  color: '#2AA199',
  fontWeight: '500',
}

const $nutritionInfo: ViewStyle = {
  ...layout.row,
  gap: 16,
}

const $nutritionItem: ViewStyle = {
  alignItems: 'center',
}

const $nutritionLabel: TextStyle = {
  fontSize: 10,
  color: '#666666',
  marginBottom: 2,
}

const $nutritionValue: TextStyle = {
  fontSize: 14,
  fontWeight: '600',
  color: '#2AA199',
}

const $notesField: ViewStyle = {
  marginBottom: 0,
}

const $bottomActions: ViewStyle = {
  ...layout.row,
  alignItems: 'center',
  paddingHorizontal: 24,
  paddingVertical: 16,
  backgroundColor: '#FFFFFF',
  borderTopWidth: 1,
  borderTopColor: 'rgba(0, 0, 0, 0.1)',
  ...shadowElevation(4),
}

const $summaryInfo: ViewStyle = {
  flex: 1,
}

const $summaryText: TextStyle = {
  fontSize: 14,
  color: '#666666',
  marginBottom: 2,
}

const $summaryCalories: TextStyle = {
  fontSize: 16,
  fontWeight: '600',
  color: '#2AA199',
}

const $submitButton: ViewStyle = {
  backgroundColor: '#2AA199',
  minWidth: 120,
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