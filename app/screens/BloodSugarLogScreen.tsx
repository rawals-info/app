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
import type { NavigationProp } from "@react-navigation/native"
import * as DocumentPicker from 'expo-document-picker'
import * as ImagePicker from 'expo-image-picker'

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
  const navigation = useNavigation<NavigationProp<any>>()
  const [reading, setReading] = useState<BloodSugarReading>({
    value: "",
    readingType: "random",
    inputMethod: "manual",
    timeSinceMeal: "1 hour ago",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showMealTimePicker, setShowMealTimePicker] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<any>(null)
  const [showInputMethodPicker, setShowInputMethodPicker] = useState(false)

  const mealTimeOptions = [
    { label: "15 minutes ago", value: "15min", minutes: 15 },
    { label: "30 minutes ago", value: "30min", minutes: 30 },
    { label: "45 minutes ago", value: "45min", minutes: 45 },
    { label: "1 hour ago", value: "1hour", minutes: 60 },
    { label: "1.5 hours ago", value: "1.5hour", minutes: 90 },
    { label: "2 hours ago", value: "2hour", minutes: 120 },
    { label: "3 hours ago", value: "3hour", minutes: 180 },
  ]

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
        handleFileUpload()
        break
    }
  }

  const handleFileUpload = async () => {
    try {
      // Request permissions for camera/gallery
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access your photos to upload lab reports.')
        return
      }

      Alert.alert(
        "Upload Lab Report",
        "Choose how you'd like to upload your report:",
        [
          {
            text: "Take Photo",
            onPress: async () => {
              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
              })
              
              if (!result.canceled && result.assets[0]) {
                setUploadedFile(result.assets[0])
                Alert.alert("Success", "Photo captured! You can now submit your reading.")
              }
            }
          },
          {
            text: "Choose from Gallery",
            onPress: async () => {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
              })
              
              if (!result.canceled && result.assets[0]) {
                setUploadedFile(result.assets[0])
                Alert.alert("Success", "Image selected! You can now submit your reading.")
              }
            }
          },
          {
            text: "Select Document",
            onPress: async () => {
              const result = await DocumentPicker.getDocumentAsync({
                type: ['image/*', 'application/pdf'],
                copyToCacheDirectory: true,
              })
              
              if (!result.canceled && result.assets[0]) {
                setUploadedFile(result.assets[0])
                Alert.alert("Success", "Document selected! You can now submit your reading.")
              }
            }
          },
          { text: "Cancel", style: "cancel" }
        ]
      )
    } catch (error) {
      console.error('Error uploading file:', error)
      Alert.alert("Error", "Failed to upload file. Please try again.")
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
      
      let response
      if (reading.readingType === "hba1c") {
        // Create HbA1c reading
        response = await bloodSugarService.createHbA1cReading({
          value: numValue,
          unit: "percent",
          takenAt: new Date().toISOString(),
          source: reading.inputMethod === "upload" ? "lab_report" : "manual"
        })
      } else {
        // Create regular blood sugar reading
        const selectedMealTime = mealTimeOptions.find(option => option.label === reading.timeSinceMeal)
        const mealDateTime = selectedMealTime ? new Date(Date.now() - selectedMealTime.minutes * 60 * 1000) : null
        
        response = await bloodSugarService.createReading({
          value: numValue,
          unit: "mg/dL",
          readingDateTime: new Date().toISOString(),
          readingType: reading.readingType === "after_meal" ? "after_meal" : reading.readingType,
          entryMethod: reading.inputMethod === "manual" ? "manual" : "device",
          notes: reading.notes || undefined,
          // Optional custom field for future use
          ...(reading.readingType === "after_meal" && reading.timeSinceMeal ? { 
            deviceInfo: { 
              timeSinceMeal: reading.timeSinceMeal,
              mealDateTime: mealDateTime?.toISOString(),
              minutesSinceMeal: selectedMealTime?.minutes
            } 
          } : {})
        })
      }

      console.log("API Response:", response)
      
      // Check if response indicates success
      if (response && (response as any)?.success !== false) {
        setShowSuccess(true)
        
        // Auto-navigate after 2 seconds or immediately if user taps
        setTimeout(() => {
          navigation.goBack()
        }, 2000)
      } else {
        throw new Error("Server returned error response")
      }
    } catch (error) {
      console.error("Error submitting reading:", error)
      Alert.alert("Error", "Failed to log reading. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentTypeInfo = getReadingTypeInfo(reading.readingType)
  const validation = reading.value ? getValueValidation(reading.value, reading.readingType) : { isValid: true, message: "" }

  // If showing success, render success screen
  if (showSuccess) {
    return (
      <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$successContainer}>
        <View style={$successContent}>
          <Ionicons name="checkmark-circle" size={80} color="#2AA199" />
          <Text preset="headline" text="Great Job!" style={$successTitle} />
          <Text preset="body" text="Your blood sugar reading has been saved successfully!" style={$successMessage} />
          <Text preset="default" text="Redirecting to home..." style={$successSubtext} />
          
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

        {/* Choose Another Way Button */}
        <TouchableOpacity 
          style={$chooseAnotherWayButton}
          onPress={() => setShowInputMethodPicker(true)}
        >
          <Ionicons name="options" size={20} color="#2AA199" />
          <Text preset="button" text="Choose another way" style={$chooseAnotherWayText} />
          <Ionicons name="chevron-forward" size={20} color="#666666" />
        </TouchableOpacity>

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
              <Text preset="body" text="When was your last meal?" style={$mealPromptText} />
            </View>
            <TouchableOpacity 
              style={$mealTimeButton}
              onPress={() => setShowMealTimePicker(true)}
            >
              <Text preset="button" text={reading.timeSinceMeal} style={$mealTimeText} />
              <Ionicons name="chevron-forward" size={20} color={colors.textDim} />
            </TouchableOpacity>
          </View>
        )}

        {/* Missed Logging Reminder */}
        <View style={$reminderCard}>
          <Ionicons name="calendar" size={20} color="#FF6B6B" />
          <Text preset="body" text="Looks like you missed logging yesterday. Want to add it now?" style={$reminderText} />
        </View>

        {/* Show uploaded file if any */}
        {uploadedFile && (
          <View style={$uploadedFileCard}>
            <Ionicons name="document-attach" size={20} color="#2AA199" />
            <View style={$uploadedFileInfo}>
              <Text preset="button" text="Uploaded File" style={$uploadedFileTitle} />
              <Text preset="default" text={uploadedFile.name || 'Lab report'} style={$uploadedFileName} />
            </View>
            <TouchableOpacity 
              style={$removeFileButton}
              onPress={() => setUploadedFile(null)}
            >
              <Ionicons name="close-circle" size={20} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        )}

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

      {/* Meal Time Picker Modal */}
      {showMealTimePicker && (
        <View style={$modalOverlay}>
          <View style={$modalContent}>
            <Text preset="headline" text="When was your last meal?" style={$modalTitle} />
            
            {mealTimeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  $modalOption,
                  reading.timeSinceMeal === option.label && $modalOptionSelected
                ]}
                onPress={() => {
                  setReading(prev => ({ ...prev, timeSinceMeal: option.label }))
                  setShowMealTimePicker(false)
                }}
              >
                <Text 
                  preset="button" 
                  text={option.label} 
                  style={[
                    $modalOptionText,
                    reading.timeSinceMeal === option.label && $modalOptionTextSelected
                  ]} 
                />
                {reading.timeSinceMeal === option.label && (
                  <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity 
              style={$modalCloseButton}
              onPress={() => setShowMealTimePicker(false)}
            >
              <Text preset="button" text="Cancel" style={$modalCloseText} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Input Method Picker Modal */}
      {showInputMethodPicker && (
        <View style={$modalOverlay}>
          <View style={$modalContent}>
            <Text preset="headline" text="Choose another way" style={$modalTitle} />
            <Text preset="default" text="Select how you'd like to log your reading" style={$modalSubtitle} />
            
            <TouchableOpacity
              style={$inputMethodModalOption}
              onPress={() => {
                setShowInputMethodPicker(false)
                handleInputMethodSelect("voice")
              }}
            >
              <View style={$inputMethodIcon}>
                <Ionicons name="mic" size={24} color="#2AA199" />
              </View>
              <View style={$inputMethodInfo}>
                <Text preset="button" text="Voice Entry" style={$inputMethodTitle} />
                <Text preset="default" text="Speak your reading aloud" style={$inputMethodDesc} />
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666666" />
            </TouchableOpacity>

            <TouchableOpacity
              style={$inputMethodModalOption}
              onPress={() => {
                setShowInputMethodPicker(false)
                handleInputMethodSelect("upload")
              }}
            >
              <View style={$inputMethodIcon}>
                <Ionicons name="document" size={24} color="#2AA199" />
              </View>
              <View style={$inputMethodInfo}>
                <Text preset="button" text={uploadedFile ? "Change File" : "Upload Report"} style={$inputMethodTitle} />
                <Text preset="default" text="Take photo or select file" style={$inputMethodDesc} />
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666666" />
            </TouchableOpacity>

            <TouchableOpacity
              style={$inputMethodModalOption}
              onPress={() => {
                setShowInputMethodPicker(false)
                handleInputMethodSelect("device")
              }}
            >
              <View style={$inputMethodIcon}>
                <Ionicons name="bluetooth" size={24} color="#2AA199" />
              </View>
              <View style={$inputMethodInfo}>
                <Text preset="button" text="Connect Device" style={$inputMethodTitle} />
                <Text preset="default" text="Sync from glucose meter" style={$inputMethodDesc} />
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666666" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={$modalCloseButton}
              onPress={() => setShowInputMethodPicker(false)}
            >
              <Text preset="button" text="Cancel" style={$modalCloseText} />
            </TouchableOpacity>
          </View>
        </View>
      )}
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

const $successContainer: ViewStyle = {
  flex: 1,
  backgroundColor: "#F8F9FA",
  justifyContent: "center",
  alignItems: "center",
  padding: 24,
}

const $successContent: ViewStyle = {
  alignItems: "center",
  backgroundColor: "#FFFFFF",
  borderRadius: 24,
  padding: 40,
  ...shadowElevation(3),
  maxWidth: 320,
  width: "100%",
}

const $successTitle: TextStyle = {
  fontSize: 28,
  fontWeight: "700",
  color: "#2AA199",
  marginTop: 24,
  marginBottom: 16,
  textAlign: "center",
}

const $successMessage: TextStyle = {
  fontSize: 16,
  color: "#1A1A1A",
  textAlign: "center",
  marginBottom: 12,
  lineHeight: 24,
}

const $successSubtext: TextStyle = {
  fontSize: 14,
  color: "#666666",
  textAlign: "center",
  marginBottom: 32,
}

const $successButton: ViewStyle = {
  backgroundColor: "#2AA199",
  borderRadius: 16,
  paddingVertical: 16,
  paddingHorizontal: 32,
  minWidth: 120,
}

const $successButtonText: TextStyle = {
  color: "#FFFFFF",
  fontSize: 16,
  fontWeight: "600",
  textAlign: "center",
}

const $modalOverlay: ViewStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
}

const $modalContent: ViewStyle = {
  backgroundColor: "#FFFFFF",
  borderRadius: 20,
  padding: 24,
  margin: 20,
  maxWidth: 320,
  width: "100%",
  ...shadowElevation(5),
}

const $modalTitle: TextStyle = {
  fontSize: 20,
  fontWeight: "600",
  color: "#1A1A1A",
  textAlign: "center",
  marginBottom: 24,
}

const $modalOption: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  padding: 16,
  borderRadius: 12,
  marginBottom: 8,
  backgroundColor: "#F8F9FA",
  borderWidth: 2,
  borderColor: "transparent",
}

const $modalOptionSelected: ViewStyle = {
  backgroundColor: "#2AA199",
  borderColor: "#2AA199",
}

const $modalOptionText: TextStyle = {
  fontSize: 16,
  color: "#1A1A1A",
}

const $modalOptionTextSelected: TextStyle = {
  color: "#FFFFFF",
  fontWeight: "600",
}

const $modalCloseButton: ViewStyle = {
  marginTop: 16,
  padding: 16,
  alignItems: "center",
}

const $modalCloseText: TextStyle = {
  fontSize: 16,
  color: "#666666",
}

const $uploadedFileCard: ViewStyle = {
  backgroundColor: "#F0FDF4",
  borderRadius: 12,
  padding: 16,
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 24,
  borderWidth: 1,
  borderColor: "#2AA199",
}

const $uploadedFileInfo: ViewStyle = {
  flex: 1,
  marginLeft: 12,
}

const $uploadedFileTitle: TextStyle = {
  fontSize: 14,
  color: "#2AA199",
  fontWeight: "600",
  marginBottom: 2,
}

const $uploadedFileName: TextStyle = {
  fontSize: 12,
  color: "#666666",
}

const $removeFileButton: ViewStyle = {
  padding: 4,
}

const $chooseAnotherWayButton: ViewStyle = {
  backgroundColor: "#FFFFFF",
  borderRadius: 12,
  padding: 16,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 24,
  ...shadowElevation(1),
  borderWidth: 1,
  borderColor: "rgba(0,0,0,0.05)",
}

const $chooseAnotherWayText: TextStyle = {
  flex: 1,
  marginLeft: 12,
  fontSize: 16,
  color: "#2AA199",
  fontWeight: "500",
}

const $modalSubtitle: TextStyle = {
  fontSize: 14,
  color: "#666666",
  textAlign: "center",
  marginBottom: 24,
}

const $inputMethodModalOption: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  padding: 16,
  borderRadius: 12,
  marginBottom: 12,
  backgroundColor: "#F8F9FA",
  borderWidth: 1,
  borderColor: "rgba(0,0,0,0.05)",
}

const $inputMethodIcon: ViewStyle = {
  width: 48,
  height: 48,
  borderRadius: 24,
  backgroundColor: "rgba(42, 161, 153, 0.1)",
  ...layout.center,
  marginRight: 16,
}

const $inputMethodInfo: ViewStyle = {
  flex: 1,
}

const $inputMethodTitle: TextStyle = {
  fontSize: 16,
  fontWeight: "600",
  color: "#1A1A1A",
  marginBottom: 2,
}

const $inputMethodDesc: TextStyle = {
  fontSize: 12,
  color: "#666666",
} 