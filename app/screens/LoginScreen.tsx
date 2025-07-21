import React, { ComponentType, FC, useEffect, useMemo, useRef, useState } from "react"
// eslint-disable-next-line no-restricted-imports
import { Pressable, TextInput, TextStyle, ViewStyle, StatusBar, Platform } from "react-native"
import { Ionicons } from '@expo/vector-icons'

import { Button } from "@/components/Button"
import { PressableIcon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField, type TextFieldAccessoryProps } from "@/components/TextField"
import { useAuth } from "@/context/AuthContext"
import { api } from "@/services/api"
import { saveAuthToken } from "@/utils/persistence"
// no storage
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { useAppTheme } from "@/theme/context"
import { CommonActions } from "@react-navigation/native"
import type { ThemedStyle } from "@/theme/types"
import { layout, shadowElevation } from "@/theme/styleHelpers"

interface LoginScreenProps {
  navigation?: any
  route?: unknown
}

export const LoginScreen: FC<LoginScreenProps> = ({ navigation }) => {
  const authPasswordInput = useRef<TextInput>(null)

  const [authPassword, setAuthPassword] = useState("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const { authEmail, setAuthEmail, setAuthToken, validationError, setUser, setIsOnboarded } = useAuth()

  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  useEffect(() => {
    // Here is where you could fetch credentials from keychain or storage
    // and pre-fill the form fields.
    setAuthEmail("")
    setAuthPassword("")
  }, [setAuthEmail])

  const error = isSubmitted ? validationError : ""

  async function login() {
    setIsSubmitted(true)
    setAttemptsCount(attemptsCount + 1)

    if (validationError) return

    const result = await api.login({ email: authEmail ?? "", password: authPassword })

    if (result.kind === "ok") {
      setIsSubmitted(false)
      setAuthPassword("")
      setAuthEmail("")
      await saveAuthToken(result.token as string)
      setAuthToken(result.token as string)
      setUser(result.user)

      // Fetch onboarding status then navigate
      const statusResp = await api.getOnboardingStatus()
      const completed = statusResp.kind === 'ok' && statusResp.data?.success ? statusResp.data.data.isComplete : false
      setIsOnboarded(completed)

      if (navigation) {
        const target = completed ? "Main" : "Onboarding"
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: target }],
          }),
        )
      }
    } else {
      // Display API error
      // For simplicity we'll reuse validationError prop to show API issues
      // eslint-disable-next-line no-console
      console.warn("Login failed", result)
    }
  }

  const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <PressableIcon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [isAuthPasswordHidden, colors.palette.neutral800],
  )

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
          onPress={() => navigation?.navigate?.("OnboardingGoal")} 
          hitSlop={15}
        >
          <Ionicons name="arrow-back" size={24} color="#2AA199" />
        </Pressable>

        <Text 
          testID="login-heading" 
          text="Welcome Back" 
          preset="headline" 
          style={$heading}
        />
        
        <Text 
          text="Sign in to your account" 
          preset="body" 
          style={$subheading}
        />

        <TextField
          value={authEmail}
          onChangeText={setAuthEmail}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
          label="Email"
          placeholder="Enter your email address"
          helper={error}
          status={error ? "error" : undefined}
          onSubmitEditing={() => authPasswordInput.current?.focus()}
          inputWrapperStyle={[
            $inputWrapper,
            error && $inputWrapperError
          ]}
        />

        <TextField
          ref={authPasswordInput}
          value={authPassword}
          onChangeText={setAuthPassword}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="password"
          autoCorrect={false}
          secureTextEntry={isAuthPasswordHidden}
          label="Password"
          placeholder="Enter your password"
          onSubmitEditing={login}
          RightAccessory={PasswordRightAccessory}
          inputWrapperStyle={$inputWrapper}
        />

        <Button
          testID="login-button"
          text="Log In"
          style={$loginButton}
          preset="primary"
          onPress={login}
        />

        <Pressable 
          onPress={() => navigation?.navigate?.("Signup")}
          style={$signupContainer}
        >
          <Text
            text="Don't have an account? "
            preset="body"
            style={$signupText}
          />
          <Text
            text="Sign up"
            preset="body"
            weight="semiBold"
            style={$signupLink}
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
  marginBottom: 40,
  textAlign: 'center',
}

const $textField: ViewStyle = {
  marginBottom: 20,
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

const $loginButton: ViewStyle = {
  height: 50,
  marginTop: 16,
  marginBottom: 24,
  backgroundColor: '#2AA199',
  ...shadowElevation(3),
}

const $signupContainer: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'center',
  marginTop: 8,
  backgroundColor: 'rgba(42, 161, 153, 0.03)',
  padding: 16,
  borderRadius: 12,
}

const $signupText: TextStyle = {
  fontSize: 16,
  color: '#666666',
}

const $signupLink: TextStyle = {
  fontSize: 16,
  color: '#2AA199',
  fontWeight: '600',
}
