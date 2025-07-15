import { FC, useRef, useState } from "react"
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

  const { setAuthToken } = useAuth()
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
          inputWrapperStyle={$inputWrapper}
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
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  ...shadowElevation(2),
}

const $heading: TextStyle = {
  fontSize: 26,
  lineHeight: 34,
  fontWeight: '600', // SemiBold works better with Poppins
  color: '#000000',
  letterSpacing: 0,
  marginTop: 80,
  marginBottom: 8,
  textAlign: 'center',
}

const $subheading: TextStyle = {
  fontSize: 16,
  lineHeight: 24,
  color: '#333333',
  marginBottom: 32,
  textAlign: 'center',
}

const $field: ViewStyle = {
  marginBottom: 16,
}

const $inputWrapper: ViewStyle = {
  borderWidth: 2,
  borderColor: '#DDDDDD',
  borderRadius: 12,
  backgroundColor: '#FFFFFF',
  paddingHorizontal: 16,
  paddingVertical: 12,
  ...shadowElevation(1),
}

const $signupButton: ViewStyle = {
  height: 50,
  marginTop: 16,
  marginBottom: 24,
  ...shadowElevation(3),
}

const $loginContainer: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'center',
  marginTop: 8,
}

const $loginText: TextStyle = {
  fontSize: 16,
  color: '#333333',
}

const $loginLink: TextStyle = {
  fontSize: 16,
  color: '#2AA199',
} 