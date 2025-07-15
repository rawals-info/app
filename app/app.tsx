/* eslint-disable import/first */
/**
 * Welcome to the main entry point of the app. In this file, we'll
 * be kicking off our app.
 *
 * Most of this file is boilerplate and you shouldn't need to modify
 * it very often. But take some time to look through and understand
 * what is going on here.
 *
 * The app navigation resides in ./app/navigators, so head over there
 * if you're interested in adding screens and navigators.
 */
if (__DEV__) {
  // Load Reactotron in development only.
  // Note that you must be using metro's `inlineRequires` for this to work.
  // If you turn it off in metro.config.js, you'll have to manually import it.
  require("./devtools/ReactotronConfig.ts")
}
import "./utils/gestureHandler"

import React, { useEffect, useState } from "react"
import { useFonts } from "expo-font"
import * as Linking from "expo-linking"
import { KeyboardProvider } from "react-native-keyboard-controller"
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import { AuthProvider, useAuth } from "./context/AuthContext"
import { initI18n } from "./i18n"
import { AppNavigator } from "./navigators/AppNavigator"
import { OnboardingScreen } from "./screens/OnboardingScreen"
import { LoginScreen } from "./screens/LoginScreen"
import { SplashScreen } from "./screens/SplashScreen"
import { useNavigationPersistence } from "./navigators/navigationUtilities"
import { ThemeProvider } from "./theme/context"
import { customFontsToLoad } from "./theme/typography"
import { loadDateFnsLocale } from "./utils/formatDate"
import * as storage from "./utils/storage"
import { getAuthToken, hasOnboarded } from "./utils/persistence"
import { OnboardingGoalScreen } from './screens/OnboardingGoalScreen'

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"

// Web linking configuration
const prefix = Linking.createURL("/")
const config = {
  screens: {
    Login: {
      path: "",
    },
    Welcome: "welcome",
    Demo: {
      screens: {
        DemoShowroom: {
          path: "showroom/:queryIndex?/:itemIndex?",
        },
        DemoDebug: "debug",
        DemoPodcastList: "podcast",
        DemoCommunity: "community",
      },
    },
  },
}

// ----- Inner component handling bootstrap ---------

function RootNavigatorWrapper({
  initialNavigationState,
  onNavigationStateChange,
}: {
  initialNavigationState: any
  onNavigationStateChange: (state: any | undefined) => void
}) {
  const [bootState, setBootState] = useState<"loading" | "onboarding" | "auth" | "app">(
    "loading",
  )

  const { setAuthToken } = useAuth()

  useEffect(() => {
    async function bootstrap() {
      const [token, onboardFlag] = await Promise.all([getAuthToken(), hasOnboarded()])

      if (!onboardFlag) setBootState("onboarding")
      else if (token) {
        setAuthToken(token)
        setBootState("app")
      } else setBootState("auth")
    }

    bootstrap()
  }, [setAuthToken])

  const Stack = createNativeStackNavigator()

  function WrapSingle(Component: React.ComponentType) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Screen" component={Component as any} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }

  function OnboardingNav() {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Onboarding">
          <Stack.Screen name="Onboarding" component={OnboardingScreen as any} />
          <Stack.Screen name="OnboardingGoal" component={OnboardingGoalScreen as any} />
          <Stack.Screen name="Login" component={LoginScreen as any} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }

  if (bootState === "loading") return <SplashScreen />
  if (bootState === "onboarding") return <OnboardingNav />
  if (bootState === "auth") return WrapSingle(LoginScreen)

  return (
    <AppNavigator
      linking={{ prefixes: [prefix], config }}
      initialState={initialNavigationState}
      onStateChange={onNavigationStateChange}
    />
  )
}

/**
 * This is the root component of our app.
 * @param {AppProps} props - The props for the `App` component.
 * @returns {JSX.Element} The rendered `App` component.
 */
export function App() {
  const {
    initialNavigationState,
    onNavigationStateChange,
    isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY)

  const [areFontsLoaded, fontLoadError] = useFonts(customFontsToLoad)
  const [isI18nInitialized, setIsI18nInitialized] = useState(false)

  useEffect(() => {
    initI18n()
      .then(() => setIsI18nInitialized(true))
      .then(() => loadDateFnsLocale())
  }, [])

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color.
  // In iOS: application:didFinishLaunchingWithOptions:
  // In Android: https://stackoverflow.com/a/45838109/204044
  // You can replace with your own loading component if you wish.
  if (!isNavigationStateRestored || !isI18nInitialized || (!areFontsLoaded && !fontLoadError)) {
    return null
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <KeyboardProvider>
        <AuthProvider>
          <ThemeProvider>
            <RootNavigatorWrapper
              initialNavigationState={initialNavigationState}
              onNavigationStateChange={onNavigationStateChange}
            />
          </ThemeProvider>
        </AuthProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  )
}
