/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import React, { ComponentProps } from "react"
import { NavigationContainer, NavigatorScreenParams } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"

import Config from "@/config"
import { useAuth } from "@/context/AuthContext"
import { ErrorBoundary } from "@/screens/ErrorScreen/ErrorBoundary"
import { LoginScreen } from "@/screens/LoginScreen"
import { LoginFormScreen } from "@/screens/LoginFormScreen"
import { OnboardingGoalScreen } from "@/screens/OnboardingGoalScreen"
import { QuestionnaireScreen } from "@/screens/QuestionnaireScreen"
import { UserInfoScreen } from "@/screens/UserInfoScreen"
import { WelcomeScreen } from "@/screens/WelcomeScreen"
import { useAppTheme } from "@/theme/context"
import { SummaryScreen } from "@/screens/SummaryScreen"
import { BloodSugarLogScreen } from "@/screens/BloodSugarLogScreen"
import { FoodLogScreen } from "@/screens/FoodLogScreen"
import { QuickAddMealScreen } from "@/screens/QuickAddMealScreen"
import { VoiceMealScreen } from "@/screens/VoiceMealScreen"

import { MainNavigator, MainTabParamList } from "./MainNavigator"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Welcome: undefined
  Login: undefined
  LoginForm: undefined
  OnboardingGoal: undefined
  Questionnaire: { goal?: string }
  UserInfo: { title: string; summary: string; goal: string }
  Summary: { title: string; summary: string; goal: string; userInfo?: any }
  Main: NavigatorScreenParams<MainTabParamList>
  BloodSugarLog: undefined
  FoodLog: undefined
  PhotoMeal: { mealData: any }
  VoiceMeal: { mealData: any }
  QuickAddMeal: { mealData: any }
  SameAsLastMeal: { mealData: any; recentMeals: any[] }
  // 🔥 Your screens go here
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = () => {
  const { isAuthenticated } = useAuth()
  const { isOnboarded } = useAuth()

  const {
    theme: { colors },
  } = useAppTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
      initialRouteName="Login"
    >
      {/* Landing and Auth screens - always available */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="LoginForm" component={LoginFormScreen} />
      
      {/* Onboarding screens */}
      <Stack.Screen name="OnboardingGoal" component={OnboardingGoalScreen} />
      <Stack.Screen name="Questionnaire" component={QuestionnaireScreen} />
      <Stack.Screen name="UserInfo" component={UserInfoScreen} />
      <Stack.Screen name="Summary" component={SummaryScreen} />

      {/* Main app screens */}
      <Stack.Screen name="Main" component={MainNavigator} />
      <Stack.Screen 
        name="BloodSugarLog" 
        component={BloodSugarLogScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom'
        }}
      />
      <Stack.Screen 
        name="FoodLog" 
        component={FoodLogScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom'
        }}
      />
      <Stack.Screen 
        name="QuickAddMeal" 
        component={QuickAddMealScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_right'
        }}
      />
      <Stack.Screen 
        name="VoiceMeal" 
        component={VoiceMealScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom'
        }}
      />

      {/** 🔥 Your screens go here */}
      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </Stack.Navigator>
  )
}

export interface NavigationProps
  extends Partial<ComponentProps<typeof NavigationContainer<AppStackParamList>>> {}

export const AppNavigator = (props: NavigationProps) => {
  const { navigationTheme } = useAppTheme()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme} {...props}>
      <ErrorBoundary catchErrors={Config.catchErrors}>
        <AppStack />
      </ErrorBoundary>
    </NavigationContainer>
  )
}
