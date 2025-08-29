/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://docs.infinite.red/ignite-cli/boilerplate/app/services/#backend-api-integration)
 * documentation for more details.
 */
import { ApiResponse, ApisauceInstance, create } from "apisauce"

import Config from "@/config"
import type { EpisodeItem } from "@/services/api/types"

import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem"
import type { ApiConfig, ApiFeedResponse } from "./types"

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  /**
   * Set the authentication header for API requests
   */
  setAuthToken(token: string | null) {
    if (token) {
      this.apisauce.setHeader('Authorization', `Bearer ${token}`)
    } else {
      this.apisauce.deleteHeader('Authorization')
    }
  }

  /**
   * Gets a list of recent React Native Radio episodes.
   */
  async getEpisodes(): Promise<{ kind: "ok"; episodes: EpisodeItem[] } | GeneralApiProblem> {
    // make the api call
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
      `api.json?rss_url=https%3A%2F%2Ffeeds.simplecast.com%2FhEI_f9Dx`,
    )

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data

      // This is where we transform the data into the shape we expect for our model.
      const episodes: EpisodeItem[] =
        rawData?.items.map((raw) => ({
          ...raw,
        })) ?? []

      return { kind: "ok", episodes }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  /**
   * Log the user in and return a JWT token & user data
   */
  async login({ email, password }: { email: string; password: string }) {
    const response: ApiResponse<any> = await this.apisauce.post("/api/auth/login", {
      email,
      password,
    })

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const data = response.data as any
      return { kind: "ok" as const, token: data.data.token, user: data.data.user }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" as const }
    }
  }

  /**
   * Register a new user
   */
  async signup(payload: {
    firstName: string
    lastName: string
    email: string
    password: string
    phoneNumber?: string
    dateOfBirth?: Date | null
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
  }) {
    const response: ApiResponse<any> = await this.apisauce.post("/api/auth/register", payload)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const data = response.data as any
      return { kind: "ok" as const, token: data.data.token, user: data.data.user }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" as const }
    }
  }

  async setGoal(goal: 'prevent' | 'monitor' | 'diagnosed') {
    const resp: ApiResponse<any> = await this.apisauce.post('/api/onboarding/goal', { goal })
    if (!resp.ok) {
      const problem = getGeneralApiProblem(resp)
      if (problem) return problem
    }
    return { kind: 'ok' as const }
  }

  /**
   * Mark onboarding as complete for the authenticated user
   */
  async completeOnboarding() {
    const resp: ApiResponse<any> = await this.apisauce.post('/api/onboarding/complete')
    if (!resp.ok) {
      const problem = getGeneralApiProblem(resp)
      if (problem) return problem
    }
    return { kind: 'ok' as const }
  }

  /**
   * Fetch onboarding status for authenticated user
   */
  async getOnboardingStatus() {
    const resp: ApiResponse<any> = await this.apisauce.get('/api/onboarding/status')
    if (!resp.ok) {
      const problem = getGeneralApiProblem(resp)
      if (problem) return problem
    }
    return { kind: 'ok' as const, data: resp.data }
  }

  /**
   * Fetch questionnaire questions by category
   */
  async getQuestions(category: string) {
    const response: ApiResponse<any> = await this.apisauce.get(`/api/questionnaire/questions?category=${category}`)
    
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    
    try {
      const data = response.data
      return { kind: 'ok' as const, data }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: 'bad-data' as const }
    }
  }

  /**
   * Submit questionnaire answers
   */
  async submitAnswers(answers: Array<{ questionId: string; answerValue: string }>) {
    const response: ApiResponse<any> = await this.apisauce.post('/api/questionnaire/answers', { answers })
    
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    
    return { kind: 'ok' as const }
  }

  /**
   * Fetch personalised summary based on answers
   */
  async getSummary(payload: { goal: string; answers: Array<{ questionId: string; answerValue: string }> }) {
    const response: ApiResponse<any> = await this.apisauce.post('/api/questionnaire/summary', payload)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    return { kind: 'ok' as const, data: response.data }
  }
}

// Singleton instance of the API for convenience
export const api = new Api()
