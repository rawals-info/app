import { api } from "./api"

export interface MealData {
  id?: string
  mealType: 'breakfast' | 'brunch' | 'lunch' | 'dinner' | 'snack'
  loggedAt: string
  inputMethod: 'photo' | 'voice' | 'quick_add' | 'same_as_last'
  location?: { latitude: number; longitude: number; address?: string }
  photoPath?: string
  voicePath?: string
  moodBefore?: string
  hungerLevel?: number
  notes?: string
  aiStatus: 'pending' | 'processed' | 'error'
  items?: MealItemData[]
  createdAt?: string
  updatedAt?: string
}

export interface MealItemData {
  id?: string
  foodItemId: string
  quantity: number
  unit: 'g' | 'ml' | 'piece' | 'cup' | 'tbsp'
  caloriesEst?: number
  giEst?: number
  source: 'user_estimate' | 'ai_estimate' | 'device'
  foodItem?: {
    name: string
    variant?: string
    baseGi?: number
    macroProfile?: any
  }
}

export interface GetMealsParams {
  startDate?: string
  endDate?: string
  mealType?: string
  limit?: number
  offset?: number
}

export interface MealStats {
  totalMeals: number
  avgCaloriesPerMeal: number
  commonFoods: string[]
  mealTypeDistribution: Record<string, number>
}

class MealService {
  // Create a new meal
  async createMeal(meal: Omit<MealData, "id" | "createdAt" | "updatedAt">) {
    const response = await api.apisauce.post("/api/meals", meal)
    return response.data
  }

  // Get meals with optional filtering
  async getMeals(params?: GetMealsParams) {
    const response = await api.apisauce.get("/api/meals", params)
    return response.data
  }

  // Get a specific meal by ID
  async getMealById(id: string) {
    const response = await api.apisauce.get(`/api/meals/${id}`)
    return response.data
  }

  // Update an existing meal
  async updateMeal(id: string, updates: Partial<MealData>) {
    const response = await api.apisauce.put(`/api/meals/${id}`, updates)
    return response.data
  }

  // Delete a meal
  async deleteMeal(id: string) {
    const response = await api.apisauce.delete(`/api/meals/${id}`)
    return response.data
  }

  // Upload photo for meal
  async uploadPhoto(photo: any): Promise<string> {
    const formData = new FormData()
    formData.append('photo', {
      uri: photo.uri,
      type: photo.type || 'image/jpeg',
      name: photo.fileName || 'meal_photo.jpg',
    } as any)

    const response = await api.apisauce.post("/api/meals/upload-photo", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return (response.data as any)?.photoPath || ""
  }

  // Upload voice recording for meal
  async uploadVoice(audio: any): Promise<string> {
    const formData = new FormData()
    formData.append('voice', {
      uri: audio.uri,
      type: audio.type || 'audio/m4a',
      name: audio.fileName || 'meal_voice.m4a',
    } as any)

    const response = await api.apisauce.post("/api/meals/upload-voice", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return (response.data as any)?.voicePath || ""
  }

  // Get meal statistics
  async getMealStats(params?: { startDate?: string; endDate?: string }): Promise<MealStats> {
    const response = await api.apisauce.get("/api/meals/stats", params)
    return response.data as MealStats
  }

  // Search food items
  async searchFoods(query: string) {
    const response = await api.apisauce.get("/api/foods/search", { q: query })
    return response.data
  }

  // Get recent meals for "same as last" functionality
  async getRecentMeals(limit: number = 5) {
    const response = await api.apisauce.get("/api/meals", { 
      limit, 
      offset: 0,
      sortBy: 'loggedAt',
      sortOrder: 'desc'
    })
    return response.data
  }
}

export const mealService = new MealService() 