import React, { useState } from "react"
import {
  View,
  ViewStyle,
  TextStyle,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { Button } from "@/components/Button"
import { useAppTheme } from "@/theme/context"
import { layout, shadowElevation } from "@/theme/styleHelpers"
import { Ionicons } from "@expo/vector-icons"
import { bloodSugarService } from "@/services/bloodSugarService"
import { useAuth } from "@/context/AuthContext"
import { useNavigation } from "@react-navigation/native"

const { width } = Dimensions.get("window")

type ReadingType = "fasting" | "after_meal" | "hba1c" | "random"
type InputMethod = "manual" | "voice" | "device" | "upload"

interface BloodSugarReading {
  value: string
  readingType: ReadingType
  inputMethod: InputMethod
  timeSinceMeal?: string
  notes?: string
}

export const BloodSugarLogScreen = () => {
  const { theme: { colors } } = useAppTheme()
  const { authToken } = useAuth()
  const navigation = useNavigation()
  const [reading, setReading] = useState<BloodSugarReading>({
    value: "",
    readingType: "random",
    inputMethod: "manual",
    timeSinceMeal: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getReadingTypeInfo = (type: ReadingType) => {
    switch (type) {
      case "fasting":
        return { range: "80-400", unit: "mg/dL", icon: "moon" as const }
      case "after_meal":
        return { range: "80-400", unit: "mg/dL", icon: "restaurant" as const }
      case "hba1c":
        return { range: "5-12", unit: "%", icon: "analytics" as const }
      case "random":
        return { range: "80-400", unit: "mg/dL", icon: "time" as const }
    }
  }

  const getValueValidation = (value: string, type: ReadingType) => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return { isValid: false, message: "Please enter a valid number" }
    
    if (type === "hba1c") {
      if (numValue < 3 || numValue > 15) {
        return { 
          isValid: false, 
          message: numValue < 5 || numValue > 12 ? "⚠️ Value outside typical range (5-12%)" : "" 
        }
      }
    } else {
      if (numValue < 50 || numValue > 500) {
        return { 
          isValid: false, 
          message: numValue < 80 || numValue > 400 ? "⚠️ Value outside typical range (80-400 mg/dL)" : "" 
        }
      }
    }
    return { isValid: true, message: "" }
  }

  const handleInputMethodSelect = (method: InputMethod) => {
    setReading(prev => ({ ...prev, inputMethod: method }))
    
    switch (method) {
      case "voice":
        Alert.alert("Voice Entry", "Voice recording feature coming soon!")
        break
      case "device":
        Alert.alert("Connect Device", "Device connection feature coming soon!")
        break
      case "upload":
        Alert.alert("Upload Report", "Report upload feature coming soon!")
        break
    }
  }

  const handleSubmit = async () => {
    const validation = getValueValidation(reading.value, reading.readingType)
    if (!validation.isValid) {
      Alert.alert("Invalid Value", validation.message)
      return
    }

    if (reading.readingType === "after_meal" && !reading.timeSinceMeal) {
      Alert.alert("Missing Information", "Please specify when you had your last meal")
      return
    }

    if (!authToken) {
      Alert.alert("Authentication Error", "Please log in to continue")
      return
    }

    setIsSubmitting(true)
    
    try {
      const numValue = parseFloat(reading.value)
      
      if (reading.readingType === "hba1c") {
        // Create HbA1c reading
        await bloodSugarService.createHbA1cReading({
          value: numValue,
          unit: "percent",
          takenAt: new Date().toISOString(),
          source: reading.inputMethod === "upload" ? "lab_report" : "manual"
        })
      } else {
        // Create regular blood sugar reading
        await bloodSugarService.createReading({
          value: numValue,
          unit: "mg/dL",
          readingDateTime: new Date().toISOString(),
          readingType: reading.readingType === "after_meal" ? "after_meal" : reading.readingType,
          entryMethod: reading.inputMethod === "manual" ? "manual" : "device",
          notes: reading.notes || undefined,
          // Optional custom field for future use
          ...(reading.readingType === "after_meal" && reading.timeSinceMeal ? { deviceInfo: { timeSinceMeal: reading.timeSinceMeal } } : {})
        })
      }

      Alert.alert("Great Job!", "Your blood sugar reading has been saved.", [
        { text: "OK", onPress: () => navigation.navigate("Home" as never) }
      ])
    } catch (error) {
      console.error("Error submitting reading:", error)
      Alert.alert("Error", "Failed to log reading. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentTypeInfo = getReadingTypeInfo(reading.readingType)
  const validation = reading.value ? getValueValidation(reading.value, reading.readingType) : { isValid: true, message: "" }

  return (
    <Screen preset="auto" safeAreaEdges={["top"]} contentContainerStyle={$container}>
      {/* Header with Back Button */}
      <View style={$header}>
        <TouchableOpacity style={$backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={$headerContent}>
          <Text preset="headline" text="Log Your Sugar Reading" style={$headerTitle} />
          <Text preset="body" text="You're doing great! Let's log your sugar 💜" style={$headerSubtitle} />
        </View>
      </View>

      <ScrollView style={$content} showsVerticalScrollIndicator={false}>
        {/* Value Input */}
        <View style={$section}>
          <Text preset="button" text="Your reading" style={$sectionTitle} />
          <View style={$valueInputContainer}>
            <TextField
              value={reading.value}
              onChangeText={(value) => setReading(prev => ({ ...prev, value }))}
              placeholder="___"
              keyboardType="numeric"
              style={$valueInput}
              containerStyle={$valueInputWrapper}
              inputWrapperStyle={$textFieldWrapper}
            />
            <Text preset="button" text={currentTypeInfo.unit} style={$unitText} />
          </View>
          {validation.message && (
            <Text preset="default" text={validation.message} style={$warningText} />
          )}
        </View>

        {/* Reading Type Selection */}
        <View style={$section}>
          <Text preset="button" text="Reading Type" style={$sectionTitle} />
          <View style={$typeContainer}>
            {(["after_meal", "fasting", "random"] as ReadingType[]).map((type) => {
              const typeInfo = getReadingTypeInfo(type)
              const isSelected = reading.readingType === type
              return (
                <TouchableOpacity
                  key={type}
                  style={[
                    $typeButton,
                    isSelected && $typeButtonSelected,
                  ]}
                  onPress={() => setReading(prev => ({ ...prev, readingType: type }))}
                >
                  <Ionicons
                    name={typeInfo.icon}
                    size={24}
                    color={isSelected ? "#FFFFFF" : colors.tint}
                  />
                  <Text
                    preset="button"
                    text={type === "after_meal" ? "Post Meal" : type === "fasting" ? "Fasting" : "Random"}
                    style={[
                      $typeButtonText,
                      isSelected && $typeButtonTextSelected,
                    ]}
                  />
                </TouchableOpacity>
              )
            })}
          </View>

          {/* HbA1c Option */}
          <TouchableOpacity
            style={[
              $hba1cButton,
              reading.readingType === "hba1c" && $hba1cButtonSelected,
            ]}
            onPress={() => setReading(prev => ({ ...prev, readingType: "hba1c" }))}
          >
            <Ionicons
              name="analytics"
              size={20}
              color={reading.readingType === "hba1c" ? "#FFFFFF" : colors.tint}
            />
            <Text
              preset="button"
              text="HbA1c Lab Result"
              style={[
                $hba1cButtonText,
                reading.readingType === "hba1c" && $hba1cButtonTextSelected,
              ]}
            />
          </TouchableOpacity>
        </View>

        {/* Meal Timing (for post-meal) */}
        {reading.readingType === "after_meal" && (
          <View style={$section}>
            <View style={$mealPrompt}>
              <Ionicons name="time" size={20} color="#FF9500" />
              <Text preset="body" text="You're logging late at night. When was your last meal?" style={$mealPromptText} />
            </View>
            <TouchableOpacity style={$mealTimeButton}>
              <Text preset="button" text={reading.timeSinceMeal || "1 hour ago"} style={$mealTimeText} />
              <Ionicons name="chevron-forward" size={20} color={colors.textDim} />
            </TouchableOpacity>
          </View>
        )}

        {/* Missed Logging Reminder */}
        <View style={$reminderCard}>
          <Ionicons name="calendar" size={20} color="#FF6B6B" />
          <Text preset="body" text="Looks like you missed logging yesterday. Want to add it now?" style={$reminderText} />
        </View>

        {/* Input Methods */}
        <View style={$section}>
          <Text preset="button" text="Choose another way" style={$sectionTitle} />
          <View style={$inputMethodsContainer}>
            <TouchableOpacity
              style={$inputMethodButton}
              onPress={() => handleInputMethodSelect("voice")}
            >
              <Ionicons name="mic" size={24} color={colors.tint} />
              <Text preset="button" text="Voice Entry" style={$inputMethodText} />
            </TouchableOpacity>

            <TouchableOpacity
              style={$inputMethodButton}
              onPress={() => handleInputMethodSelect("upload")}
            >
              <Ionicons name="document" size={24} color={colors.tint} />
              <Text preset="button" text="Upload Report" style={$inputMethodText} />
            </TouchableOpacity>

            <TouchableOpacity
              style={$inputMethodButton}
              onPress={() => handleInputMethodSelect("device")}
            >
              <Ionicons name="bluetooth" size={24} color={colors.tint} />
              <Text preset="button" text="Connect Device" style={$inputMethodText} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Button */}
        <View style={$submitContainer}>
          <Button
            text="Submit"
            preset="gradient"
            onPress={handleSubmit}
            style={$submitButton}
            disabled={!reading.value || !validation.isValid || isSubmitting}
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </Screen>
  )
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: "#F8F9FA",
}

const $header: ViewStyle = {
  padding: 24,
  backgroundColor: "#2AA199",
  borderBottomLeftRadius: 24,
  borderBottomRightRadius: 24,
  ...shadowElevation(3),
  flexDirection: "row",
  alignItems: "center",
}

const $backButton: ViewStyle = {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  ...layout.center,
  marginRight: 16,
}

const $headerContent: ViewStyle = {
  flex: 1,
}

const $headerTitle: TextStyle = {
  color: "#FFFFFF",
  fontSize: 24,
  fontWeight: "600",
  marginBottom: 8,
}

const $headerSubtitle: TextStyle = {
  color: "#FFFFFF",
  opacity: 0.9,
  fontSize: 16,
}

const $content: ViewStyle = {
  flex: 1,
  padding: 20,
}

const $section: ViewStyle = {
  marginBottom: 32,
}

const $sectionTitle: TextStyle = {
  fontSize: 18,
  fontWeight: "600",
  marginBottom: 20,
  color: "#1A1A1A",
}

const $valueInputContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#FFFFFF",
  borderRadius: 16,
  padding: 24,
  ...shadowElevation(2),
  borderWidth: 1,
  borderColor: "rgba(0,0,0,0.05)",
}

const $valueInputWrapper: ViewStyle = {
  flex: 1,
  marginRight: 20,
}

const $textFieldWrapper: ViewStyle = {
  backgroundColor: "transparent",
  borderWidth: 0,
  paddingHorizontal: 0,
}

const $valueInput: TextStyle = {
  fontSize: 32,
  fontWeight: "600",
  textAlign: "center",
  color: "#1A1A1A",
  backgroundColor: "transparent",
}

const $unitText: TextStyle = {
  fontSize: 18,
  color: "#666666",
  fontWeight: "500",
}

const $warningText: TextStyle = {
  color: "#FF6B6B",
  fontSize: 14,
  marginTop: 12,
  textAlign: "center",
}

const $typeContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  gap: 16,
}

const $typeButton: ViewStyle = {
  flex: 1,
  backgroundColor: "#FFFFFF",
  borderRadius: 16,
  padding: 20,
  alignItems: "center",
  ...shadowElevation(2),
  borderWidth: 2,
  borderColor: "transparent",
  minHeight: 110,
  justifyContent: "center",
}

const $typeButtonSelected: ViewStyle = {
  backgroundColor: "#2AA199",
  borderColor: "#2AA199",
}

const $typeButtonText: TextStyle = {
  marginTop: 12,
  fontSize: 14,
  fontWeight: "500",
  textAlign: "center",
}

const $typeButtonTextSelected: TextStyle = {
  color: "#FFFFFF",
}

const $hba1cButton: ViewStyle = {
  backgroundColor: "#FFFFFF",
  borderRadius: 16,
  padding: 20,
  flexDirection: "row",
  alignItems: "center",
  ...shadowElevation(2),
  borderWidth: 2,
  borderColor: "transparent",
  marginTop: 16,
}

const $hba1cButtonSelected: ViewStyle = {
  backgroundColor: "#2AA199",
  borderColor: "#2AA199",
}

const $hba1cButtonText: TextStyle = {
  marginLeft: 12,
  fontSize: 16,
  fontWeight: "500",
}

const $hba1cButtonTextSelected: TextStyle = {
  color: "#FFFFFF",
}

const $mealPrompt: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#FFF9E6",
  borderRadius: 12,
  padding: 20,
  marginBottom: 16,
}

const $mealPromptText: TextStyle = {
  marginLeft: 12,
  flex: 1,
  fontSize: 14,
  color: "#B8860B",
}

const $mealTimeButton: ViewStyle = {
  backgroundColor: "#FFFFFF",
  borderRadius: 12,
  padding: 20,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  ...shadowElevation(1),
}

const $mealTimeText: TextStyle = {
  fontSize: 16,
}

const $reminderCard: ViewStyle = {
  backgroundColor: "#FFF0F0",
  borderRadius: 16,
  padding: 20,
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 32,
}

const $reminderText: TextStyle = {
  marginLeft: 12,
  flex: 1,
  fontSize: 14,
  color: "#D63384",
}

const $inputMethodsContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  gap: 16,
}

const $inputMethodButton: ViewStyle = {
  flex: 1,
  backgroundColor: "#FFFFFF",
  borderRadius: 16,
  padding: 20,
  alignItems: "center",
  ...shadowElevation(2),
  borderWidth: 1,
  borderColor: "rgba(0,0,0,0.05)",
  minHeight: 90,
  justifyContent: "center",
}

const $inputMethodText: TextStyle = {
  marginTop: 12,
  fontSize: 12,
  textAlign: "center",
  color: "#666666",
}

const $submitContainer: ViewStyle = {
  marginTop: 32,
  marginBottom: 40,
}

const $submitButton: ViewStyle = {
  borderRadius: 16,
  paddingVertical: 18,
} 