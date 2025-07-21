import { createContext, FC, PropsWithChildren, useCallback, useContext, useMemo } from "react"
import { useMMKVString } from "react-native-mmkv"
import { api } from "@/services/api"
import { useState } from "react"

export interface User {
  id: string
  firstName?: string
  lastName?: string
  email: string
}

export type AuthContextType = {
  isAuthenticated: boolean
  authToken?: string
  user?: User
  authEmail?: string
  setAuthToken: (token?: string) => void
  setUser: (user?: User) => void
  isOnboarded: boolean
  setIsOnboarded: (flag: boolean) => void
  setAuthEmail: (email: string) => void
  logout: () => void
  validationError: string
}

export const AuthContext = createContext<AuthContextType | null>(null)

export interface AuthProviderProps {}

export const AuthProvider: FC<PropsWithChildren<AuthProviderProps>> = ({ children }) => {
  const [authToken, mmkvSetAuthToken] = useMMKVString("AuthProvider.authToken")
  const [authEmail, setAuthEmail] = useMMKVString("AuthProvider.authEmail")
  const [userJson, setUserJson] = useMMKVString("AuthProvider.user")
  const [onboardedFlag, setOnboardedFlag] = useState(false)

  const user = userJson ? (JSON.parse(userJson) as User) : undefined

  const setUser = useCallback(
    (u?: User) => {
      if (u) {
        setUserJson(JSON.stringify(u))
      } else {
        setUserJson(undefined)
      }
    },
    [setUserJson],
  )

  // When we change the token, update api headers as well
  const setAuthToken = useCallback(
    (token?: string) => {
      if (token) {
        api.apisauce.setHeader("Authorization", `Bearer ${token}`)
      } else {
        api.apisauce.deleteHeader("Authorization")
      }
      mmkvSetAuthToken(token)
    },
    [mmkvSetAuthToken],
  )

  const logout = useCallback(() => {
    setAuthToken(undefined)
    setAuthEmail("")
    setUser(undefined)
  }, [setAuthEmail, setAuthToken])

  const validationError = useMemo(() => {
    if (!authEmail || authEmail.length === 0) return "can't be blank"
    if (authEmail.length < 6) return "must be at least 6 characters"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authEmail)) return "must be a valid email address"
    return ""
  }, [authEmail])

  const value: AuthContextType = {
    isAuthenticated: !!authToken,
    authToken,
    user,
    setUser,
    isOnboarded: onboardedFlag,
    setIsOnboarded: setOnboardedFlag,
    authEmail,
    setAuthToken,
    setAuthEmail,
    logout,
    validationError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
