import * as SecureStore from "expo-secure-store"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Platform } from "react-native"

// KEYS
const KEY_AUTH_TOKEN = "authToken"
const KEY_HAS_ONBOARDED = "hasOnboarded"

async function secureStoreAvailable() {
  if (Platform.OS === "web") return false
  try {
    return await SecureStore.isAvailableAsync()
  } catch {
    return false
  }
}

// Auth Token --------------------------------------------------
export async function saveAuthToken(token: string) {
  if (await secureStoreAvailable()) {
    await SecureStore.setItemAsync(KEY_AUTH_TOKEN, token)
  } else {
    await AsyncStorage.setItem(KEY_AUTH_TOKEN, token)
  }
}

export async function getAuthToken() {
  if (await secureStoreAvailable()) {
    return SecureStore.getItemAsync(KEY_AUTH_TOKEN)
  }
  return AsyncStorage.getItem(KEY_AUTH_TOKEN)
}

export async function clearAuthToken() {
  if (await secureStoreAvailable()) {
    await SecureStore.deleteItemAsync(KEY_AUTH_TOKEN)
  } else {
    await AsyncStorage.removeItem(KEY_AUTH_TOKEN)
  }
}

// Onboarding Flag ---------------------------------------------
export async function setHasOnboarded() {
  await AsyncStorage.setItem(KEY_HAS_ONBOARDED, "true")
}

export async function hasOnboarded() {
  const flag = await AsyncStorage.getItem(KEY_HAS_ONBOARDED)
  return Boolean(flag)
} 