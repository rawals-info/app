import AsyncStorage from '@react-native-async-storage/async-storage'

type CategorySlug = 'non_patient' | 'at_risk' | 'patient'
export interface CachedCategory {
  slug: CategorySlug
  affirmationText: string
  updatedAt: string // ISO string
  questions: Array<{
    id: string
    questionText: string
    responseType: 'mcq' | 'numeric' | 'yes_no'
    options?: any | null
    order: number
    updatedAt: string
  }>
}

const KEY_PREFIX = 'questionnaire_category_'

export async function getCachedCategory(slug: CategorySlug): Promise<CachedCategory | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY_PREFIX + slug)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export async function saveCachedCategory(slug: CategorySlug, data: CachedCategory) {
  try {
    await AsyncStorage.setItem(KEY_PREFIX + slug, JSON.stringify(data))
  } catch (err) {
    // non-fatal
    console.warn('[QuestionCache] Failed to save cache', err)
  }
} 