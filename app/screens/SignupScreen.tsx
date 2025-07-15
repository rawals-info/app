import { FC, useRef, useState } from "react"
// eslint-disable-next-line no-restricted-imports
import { Pressable, TextInput, TextStyle, ViewStyle } from "react-native"

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

interface SignupScreenProps extends AppStackScreenProps<"Signup"> {}

export const SignupScreen: FC<SignupScreenProps> = ({ navigation }) => {
  const passwordInput = useRef<TextInput>(null)
  const confirmPasswordInput = useRef<TextInput>(null)

  const [fullName, setFullName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")

  const { setAuthToken } = useAuth()
  const { themed } = useAppTheme()

  async function signup() {
    if (!email || !password || password !== confirmPassword) return

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
    <Screen
      preset="auto"
      contentContainerStyle={themed($container)}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text preset="heading" text="Create an Account" style={themed($heading)} />
      <Text preset="subheading" text="Join Diabetes Buddy today" style={themed($subheading)} />

      <TextField
        value={fullName}
        onChangeText={setFullName}
        containerStyle={themed($field)}
        label="Full Name"
        placeholder="Enter your full name"
        autoCapitalize="words"
        onSubmitEditing={() => passwordInput.current?.focus()}
      />

      <TextField
        value={email}
        onChangeText={setEmail}
        containerStyle={themed($field)}
        label="Email"
        placeholder="Enter your email address"
        autoCapitalize="none"
        keyboardType="email-address"
        onSubmitEditing={() => passwordInput.current?.focus()}
      />

      <TextField
        ref={passwordInput}
        value={password}
        onChangeText={setPassword}
        containerStyle={themed($field)}
        label="Password"
        placeholder="Create a password"
        secureTextEntry
        onSubmitEditing={() => confirmPasswordInput.current?.focus()}
      />

      <TextField
        ref={confirmPasswordInput}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        containerStyle={themed($field)}
        label="Confirm Password"
        placeholder="Re-enter password"
        secureTextEntry
        onSubmitEditing={signup}
      />

      <Button text="Sign Up" style={themed($button)} preset="reversed" onPress={signup} />

      <Pressable onPress={() => navigation.navigate("Login")}>
        <Text text="Already have an account? Log in" size="sm" weight="medium" style={themed($link)} />
      </Pressable>
    </Screen>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
})

const $heading: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $subheading: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $field: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $button: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.md,
  marginBottom: spacing.lg,
})

const $link: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.tint,
  textAlign: "center",
}) 