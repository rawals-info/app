import React, { FC, useState, useRef } from 'react'
import { View, ViewStyle, TextStyle, StatusBar, Platform, Pressable, TextInput, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Screen } from '@/components/Screen'
import { Text } from '@/components/Text'
import { Button } from '@/components/Button'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/services/api'
import { saveAuthToken } from '@/utils/persistence'
import { shadowElevation, layout } from '@/theme/styleHelpers'

interface Props {
  navigation?: any
}

export const LoginFormScreen: FC<Props> = ({ navigation }) => {
  const passwordInputRef = useRef<TextInput>(null)
  const { setUser, setAuthToken, setIsOnboarded } = useAuth()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack()
    }
  }

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address')
      return
    }

    setIsLoading(true)
    
    try {
      const result = await api.login({ email, password })
      
      if (result.kind === 'ok') {
        // Login successful
        await saveAuthToken(result.token as string)
        setAuthToken(result.token as string)
        setUser(result.user)
        setIsOnboarded(true) // Assume existing users have completed onboarding
        navigation?.navigate?.('Main')
      } else {
        // Login failed
        Alert.alert('Login Failed', 'Invalid email or password. Please try again.')
      }
    } catch (error) {
      console.error('Login error:', error)
      Alert.alert('Error', 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password', 
      'Please contact support to reset your password.',
      [{ text: 'OK' }]
    )
  }

  const handleSignUp = () => {
    navigation?.navigate?.('OnboardingGoal')
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
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </Pressable>

        {/* Header */}
        <View style={$header}>
          <Text 
            preset="headline" 
            text="Welcome Back" 
            style={$headerTitle} 
          />
          <Text 
            preset="body" 
            text="Sign in to your account" 
            style={$headerSubtitle} 
          />
        </View>

        {/* Form */}
        <View style={$form}>
          {/* Email */}
          <View style={$inputGroup}>
            <Text text="Email" style={$inputLabel} />
            <TextInput
              style={$textInput}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
            />
          </View>

          {/* Password */}
          <View style={$inputGroup}>
            <Text text="Password" style={$inputLabel} />
            <View style={$passwordContainer}>
              <TextInput
                ref={passwordInputRef}
                style={$passwordInput}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <Pressable 
                style={$eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color="#6B7280" 
                />
              </Pressable>
            </View>
          </View>

          {/* Forgot Password */}
          <Pressable onPress={handleForgotPassword} style={$forgotPassword}>
            <Text text="Forgot Password?" style={$forgotPasswordText} />
          </Pressable>
        </View>

        {/* Footer */}
        <View style={$footer}>
          <Button
            text={isLoading ? "Signing In..." : "Sign In"}
            preset="primary"
            disabled={isLoading}
            style={$loginButton}
            onPress={handleLogin}
          />
          
          {/* Sign Up Link */}
          <View style={$signUpContainer}>
            <Text text="Don't have an account? " style={$signUpText} />
            <Pressable onPress={handleSignUp}>
              <Text text="Sign Up" style={$signUpLink} />
            </Pressable>
          </View>
        </View>
      </Screen>
    </>
  )
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: '#FFFFFF',
  paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  justifyContent: 'space-between',
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

const $header: ViewStyle = {
  alignItems: 'center',
  paddingTop: 80,
  paddingHorizontal: 24,
  marginBottom: 32,
}

const $headerTitle: TextStyle = {
  fontSize: 28,
  fontWeight: '700',
  color: '#1F2937',
  textAlign: 'center',
  marginBottom: 8,
}

const $headerSubtitle: TextStyle = {
  fontSize: 16,
  color: '#6B7280',
  textAlign: 'center',
}

const $form: ViewStyle = {
  flex: 1,
  paddingHorizontal: 24,
}

const $inputGroup: ViewStyle = {
  marginBottom: 20,
}

const $inputLabel: TextStyle = {
  fontSize: 14,
  fontWeight: '600',
  color: '#1F2937',
  marginBottom: 8,
}

const $textInput: any = {
  height: 52,
  borderWidth: 2,
  borderColor: '#E5E7EB',
  borderRadius: 8,
  paddingHorizontal: 16,
  fontSize: 16,
  backgroundColor: '#FFFFFF',
  color: '#1F2937',
  ...shadowElevation(1),
}

const $passwordContainer: ViewStyle = {
  position: 'relative',
}

const $passwordInput: any = {
  height: 52,
  borderWidth: 2,
  borderColor: '#E5E7EB',
  borderRadius: 8,
  paddingHorizontal: 16,
  paddingRight: 50, // Space for eye icon
  fontSize: 16,
  backgroundColor: '#FFFFFF',
  color: '#1F2937',
  ...shadowElevation(1),
}

const $eyeButton: ViewStyle = {
  position: 'absolute',
  right: 16,
  top: 16,
  width: 20,
  height: 20,
}

const $forgotPassword: ViewStyle = {
  alignItems: 'flex-end',
  marginTop: 8,
  marginBottom: 24,
}

const $forgotPasswordText: TextStyle = {
  fontSize: 14,
  color: '#6B7280',
  fontWeight: '500',
}

const $footer: ViewStyle = {
  paddingHorizontal: 24,
  paddingBottom: 24,
}

const $loginButton: ViewStyle = {
  height: 56,
  backgroundColor: '#000000',
  borderRadius: 12,
  marginBottom: 24,
  ...shadowElevation(3),
}

const $signUpContainer: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
}

const $signUpText: TextStyle = {
  fontSize: 16,
  color: '#6B7280',
}

const $signUpLink: TextStyle = {
  fontSize: 16,
  color: '#000000',
  fontWeight: '600',
}
