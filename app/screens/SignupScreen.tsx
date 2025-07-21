import React, { FC, useRef, useState } from "react"
// eslint-disable-next-line no-restricted-imports
import { Pressable, TextInput, TextStyle, ViewStyle, StatusBar, Platform } from "react-native"
import { Ionicons } from '@expo/vector-icons'

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { useAuth } from "@/context/AuthContext"
import { api } from "@/services/api"
import { saveAuthToken } from "@/utils/persistence"
// no storage flag
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { layout, shadowElevation } from "@/theme/styleHelpers"

interface SignupScreenProps extends AppStackScreenProps<"Signup"> {}

export const SignupScreen: FC<SignupScreenProps> = ({ navigation }) => {
  const passwordInput = useRef<TextInput>(null)
  const confirmPasswordInput = useRef<TextInput>(null)

  const [fullName, setFullName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [passwordError, setPasswordError] = useState<string>("")

  const { setAuthToken, setUser, setIsOnboarded } = useAuth()
  const { themed } = useAppTheme()

  async function signup() {
    // Reset error
    setPasswordError("")
    
    // Validation
    if (!fullName || !email || !password) {
      return
    }
    
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match")
      return
    }

    const [firstName, ...rest] = fullName.trim().split(" ")
    const lastName = rest.join(" ")

    const result = await api.signup({
      firstName,
      lastName,
      email,
      password,
    })

    if (result.kind === "ok") {
      await saveAuthToken(result.token as string)
      setAuthToken(result.token as string)
      setUser(result.user)

      // Check onboarding status
      const statusResp = await api.getOnboardingStatus()
      const completed = statusResp.kind === 'ok' && statusResp.data?.success ? statusResp.data.data.isComplete : false
      setIsOnboarded(completed)

      // If user selected a goal before signing up, forward it to backend now
      try {
        const pendingGoal = await AsyncStorage.getItem("pendingGoal")
        if (pendingGoal) {
          await api.setGoal(pendingGoal as any)
          await AsyncStorage.removeItem("pendingGoal")
        }
      } catch {}

      if (navigation?.navigate) {
        if (completed) {
           navigation.navigate("Main" as any)
        } else {
           navigation.navigate("Onboarding")
        }
      }
    } else {
      // eslint-disable-next-line no-console
      console.warn("Signup failed", result)
    }
  }

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <Screen
        preset="fixed"
        contentContainerStyle={$container}
        safeAreaEdges={["top", "bottom"]}
      >
        {/* Back button */}
        <Pressable 
          style={$backButton} 
          onPress={() => navigation.goBack()} 
          hitSlop={15}
        >
          <Ionicons name="arrow-back" size={24} color="#2AA199" />
        </Pressable>

        <Text 
          preset="headline" 
          text="Create an Account" 
          style={$heading} 
        />
        
        <Text 
          preset="body" 
          text="Join Diabetes Buddy today" 
          style={$subheading} 
        />

        <TextField
          value={fullName}
          onChangeText={setFullName}
          containerStyle={$field}
          label="Full Name"
          placeholder="Enter your full name"
          autoCapitalize="words"
          onSubmitEditing={() => passwordInput.current?.focus()}
          inputWrapperStyle={$inputWrapper}
        />

        <TextField
          value={email}
          onChangeText={setEmail}
          containerStyle={$field}
          label="Email"
          placeholder="Enter your email address"
          autoCapitalize="none"
          keyboardType="email-address"
          onSubmitEditing={() => passwordInput.current?.focus()}
          inputWrapperStyle={$inputWrapper}
        />

        <TextField
          ref={passwordInput}
          value={password}
          onChangeText={setPassword}
          containerStyle={$field}
          label="Password"
          placeholder="Create a password"
          secureTextEntry
          onSubmitEditing={() => confirmPasswordInput.current?.focus()}
          inputWrapperStyle={$inputWrapper}
        />

        <TextField
          ref={confirmPasswordInput}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          containerStyle={$field}
          label="Confirm Password"
          placeholder="Re-enter password"
          secureTextEntry
          onSubmitEditing={signup}
          helper={passwordError}
          status={passwordError ? "error" : undefined}
          inputWrapperStyle={[
            $inputWrapper,
            passwordError && $inputWrapperError
          ]}
        />

        <Button 
          text="Sign Up" 
          style={$signupButton} 
          preset="primary" 
          onPress={signup} 
        />

        <Pressable 
          onPress={() => navigation.navigate("Login")}
          style={$loginContainer}
        >
          <Text 
            text="Already have an account? " 
            preset="body"
            style={$loginText} 
          />
          <Text 
            text="Log in" 
            preset="body"
            weight="semiBold"
            style={$loginLink} 
          />
        </Pressable>
      </Screen>
    </>
  )
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: '#FFFFFF',
  paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  paddingHorizontal: 24,
}

const $backButton: ViewStyle = {
  position: 'absolute',
  top: Platform.OS === 'android' ? StatusBar.currentHeight || 0 + 16 : 16,
  left: 24,
  zIndex: 10,
  width: 40,
  height: 40,
  borderRadius: 20,
  ...layout.center,
  backgroundColor: 'rgba(42, 161, 153, 0.1)',
  ...shadowElevation(2),
}

const $heading: TextStyle = {
  fontSize: 26,
  lineHeight: 34,
  fontWeight: '600',
  color: '#2AA199',
  letterSpacing: 0,
  marginTop: 80,
  marginBottom: 8,
  textAlign: 'center',
}

const $subheading: TextStyle = {
  fontSize: 16,
  lineHeight: 24,
  color: '#666666',
  marginBottom: 32,
  textAlign: 'center',
}

const $field: ViewStyle = {
  marginBottom: 16,
}

const $inputWrapper: ViewStyle = {
  borderWidth: 2,
  borderColor: 'rgba(42, 161, 153, 0.2)',
  borderRadius: 12,
  backgroundColor: '#FFFFFF',
  paddingHorizontal: 16,
  paddingVertical: 12,
  ...shadowElevation(1),
}

const $inputWrapperFocused: ViewStyle = {
  borderColor: '#2AA199',
  ...shadowElevation(2),
}

const $inputWrapperError: ViewStyle = {
  borderColor: '#FF4D6D',
  backgroundColor: 'rgba(255, 77, 109, 0.03)',
}

const $errorText: TextStyle = {
  color: '#FF4D6D',
  fontSize: 14,
  marginTop: 4,
}

const $signupButton: ViewStyle = {
  height: 50,
  marginTop: 16,
  marginBottom: 24,
  backgroundColor: '#2AA199',
  ...shadowElevation(3),
}

const $loginContainer: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'center',
  marginTop: 8,
  backgroundColor: 'rgba(42, 161, 153, 0.03)',
  padding: 16,
  borderRadius: 12,
}

const $loginText: TextStyle = {
  fontSize: 16,
  color: '#666666',
}

const $loginLink: TextStyle = {
  fontSize: 16,
  color: '#2AA199',
  fontWeight: '600',
} 