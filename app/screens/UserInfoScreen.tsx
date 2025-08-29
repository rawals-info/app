import React, { FC, useState } from 'react'
// eslint-disable-next-line no-restricted-imports
import { View, Pressable, ViewStyle, TextStyle, StatusBar, Platform, Alert, ScrollView, TextInput, Image, ImageStyle, ActionSheetIOS } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { Screen } from '@/components/Screen'
import { Text } from '@/components/Text'
import { Button } from '@/components/Button'
import { useAppTheme } from '@/theme/context'
import { layout, shadowElevation } from '@/theme/styleHelpers'

interface UserInfoScreenProps {
  navigation?: any
  route?: { 
    params?: { 
      title: string
      summary: string
      goal: string 
    } 
  }
}

export const UserInfoScreen: FC<UserInfoScreenProps> = ({ navigation, route }) => {
  const { themed } = useAppTheme()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | ''>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack()
    } else {
      navigation?.navigate?.('Questionnaire')
    }
  }

  const validateForm = () => {
    if (!firstName.trim()) {
      Alert.alert('Validation Error', 'Please enter your first name')
      return false
    }
    if (!lastName.trim()) {
      Alert.alert('Validation Error', 'Please enter your last name')  
      return false
    }
    if (!email.trim()) {
      Alert.alert('Validation Error', 'Please enter your email address')
      return false
    }
    if (!phoneNumber.trim()) {
      Alert.alert('Validation Error', 'Please enter your mobile number')
      return false
    }
    if (!age.trim() || isNaN(Number(age)) || Number(age) < 1 || Number(age) > 120) {
      Alert.alert('Validation Error', 'Please enter a valid age')
      return false
    }
    if (!gender) {
      Alert.alert('Validation Error', 'Please select your gender')
      return false
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address')
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    
    setIsSubmitting(true)
    try {
      // Store user info temporarily - will be used during account creation
      const userInfo = {
        firstName: firstName.trim(),
        lastName: lastName.trim(), 
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        age: Number(age),
        gender
      }

      // Navigate to Summary with user info
      const { title, summary, goal } = route?.params || {}
      navigation?.navigate?.('Summary', {
        title,
        summary,
        goal,
        userInfo
      })
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkipForNow = () => {
    const { title, summary, goal } = route?.params || {}
    navigation?.navigate?.('Summary', {
      title,
      summary,
      goal,
      userInfo: null
    })
  }

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <Screen preset="fixed" safeAreaEdges={["top", "bottom"]} contentContainerStyle={$container}>
        {/* Back button */}
        <Pressable 
          style={$backButton} 
          onPress={handleBack} 
          hitSlop={15}
        >
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </Pressable>

        {/* Header */}
        <View style={$headerSection}>
          <Text 
            preset="headline"
            text="About you" 
            style={$headerTitle} 
          />
          <Text text="Step 3 of 4" style={$stepText} />
          <View style={$progressBar}>
            <View style={[$progressFill, { width: '75%' }]} />
          </View>
        </View>
        
        {/* Form Content */}
        <ScrollView 
          style={$scrollView}
          contentContainerStyle={$scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Name - inline */}
          <View style={$fieldContainer}>
            <Text text="Name" style={$fieldLabel} />
            <View style={$nameRow}>
              <TextInput
                style={[$textInput, $nameInput]}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First name"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
              />
              <TextInput
                style={[$textInput, $nameInput]}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last name"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Email */}
          <View style={$fieldContainer}>
            <Text text="Email Address" style={$fieldLabel} />
            <TextInput
              style={$textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email address"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          {/* Mobile number */}
          <View style={$fieldContainer}>
            <Text text="Mobile Number" style={$fieldLabel} />
            <TextInput
              style={$textInput}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Enter your mobile number"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
            />
          </View>

          {/* Age */}
          <View style={$fieldContainer}>
            <Text text="Age" style={$fieldLabel} />
            <TextInput
              style={$textInput}
              value={age}
              onChangeText={setAge}
              placeholder="Enter your age"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              maxLength={3}
            />
          </View>

          {/* Gender */}
          <View style={$fieldContainer}>
            <Text text="Gender" style={$fieldLabel} />
            <View style={$genderContainer}>
              <Pressable 
                style={[
                  $genderBox,
                  gender === 'male' && $genderBoxSelected
                ]}
                onPress={() => setGender('male')}
                android_ripple={{ color: '#F3F4F6', borderless: false }}
              >
                <Text 
                  text="Male"
                  style={[
                    $genderBoxText,
                    gender === 'male' && $genderBoxTextSelected
                  ]}
                />
                {gender === 'male' && (
                  <View style={$genderCheckCircle}>
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  </View>
                )}
              </Pressable>
              
              <Pressable 
                style={[
                  $genderBox,
                  gender === 'female' && $genderBoxSelected
                ]}
                onPress={() => setGender('female')}
                android_ripple={{ color: '#F3F4F6', borderless: false }}
              >
                <Text 
                  text="Female"
                  style={[
                    $genderBoxText,
                    gender === 'female' && $genderBoxTextSelected
                  ]}
                />
                {gender === 'female' && (
                  <View style={$genderCheckCircle}>
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  </View>
                )}
              </Pressable>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={$footer}>
          <Button
            text="Next"
            preset="primary"
            disabled={isSubmitting}
            style={$submitButton}
            onPress={handleSubmit}
          />
        </View>
      </Screen>
    </>
  )
}

// Styles
const $container: ViewStyle = {
  flex: 1,
  backgroundColor: '#F8FFFE',
  paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
}

const $backButton: ViewStyle = {
  position: 'absolute',
  top: Platform.OS === 'android' ? StatusBar.currentHeight || 0 + 16 : 16,
  left: 24,
  zIndex: 10,
  width: 44,
  height: 44,
  borderRadius: 22,
  ...layout.center,
  backgroundColor: '#FFFFFF',
  borderWidth: 1,
  borderColor: '#E5E7EB',
  ...shadowElevation(2),
}

const $headerSection: ViewStyle = {
  paddingTop: 60,
  paddingHorizontal: 24,
  paddingBottom: 24,
  backgroundColor: '#FFFFFF',
}

const $headerTitle: TextStyle = {
  fontSize: 24,
  fontWeight: '600',
  color: '#1F2937',
  marginBottom: 8,
}

const $stepText: TextStyle = {
  fontSize: 14,
  color: '#6B7280',
  marginBottom: 16,
}

const $progressBar: ViewStyle = {
  height: 4,
  backgroundColor: '#E5E7EB',
  borderRadius: 2,
  overflow: 'hidden',
}

const $progressFill: ViewStyle = {
  height: '100%',
  backgroundColor: '#1F2937',
  borderRadius: 2,
}

const $scrollView: ViewStyle = {
  flex: 1,
}

const $scrollContent: ViewStyle = {
  paddingHorizontal: 24,
  paddingBottom: 24,
}

const $fieldContainer: ViewStyle = {
  marginBottom: 24,
}

const $fieldLabel: TextStyle = {
  fontSize: 16,
  fontWeight: '600',
  color: '#1F2937',
  marginBottom: 12,
}

const $nameRow: ViewStyle = {
  flexDirection: 'row',
  gap: 12,
}

const $nameInput: any = {
  flex: 1,
}

const $textInput: any = {
  height: 48,
  borderWidth: 2,
  borderColor: '#E5E7EB',
  borderRadius: 8,
  paddingHorizontal: 12,
  fontSize: 14,
  backgroundColor: '#FFFFFF',
  color: '#374151',
  ...shadowElevation(1),
}

const $genderContainer: ViewStyle = {
  flexDirection: 'row',
  gap: 12,
}

const $genderBox: ViewStyle = {
  flex: 1,
  height: 48,
  borderWidth: 2,
  borderColor: '#E5E7EB',
  borderRadius: 8,
  backgroundColor: '#FFFFFF',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  ...shadowElevation(1),
}

const $genderBoxSelected: ViewStyle = {
  borderColor: '#000000',
  backgroundColor: '#F8F8F8',
}

const $genderBoxText: TextStyle = {
  fontSize: 14,
  color: '#374151',
  fontWeight: '500',
}

const $genderBoxTextSelected: TextStyle = {
  color: '#000000',
  fontWeight: '600',
}

const $genderCheckCircle: ViewStyle = {
  position: 'absolute',
  right: 8,
  top: 8,
  width: 20,
  height: 20,
  borderRadius: 10,
  backgroundColor: '#000000',
  alignItems: 'center',
  justifyContent: 'center',
}

const $footer: ViewStyle = {
  paddingVertical: 20,
  paddingHorizontal: 24,
  backgroundColor: '#F8FFFE',
  borderTopWidth: 1,
  borderTopColor: '#E5E7EB',
}

const $submitButton: ViewStyle = {
  height: 56,
  backgroundColor: '#000000',
  borderRadius: 12,
  marginBottom: 12,
  ...shadowElevation(3),
}

const $skipContainer: ViewStyle = {
  alignItems: 'center',
  paddingVertical: 8,
}

const $skipText: TextStyle = {
  fontSize: 14,
  color: '#6B7280',
  textDecorationLine: 'underline',
}
