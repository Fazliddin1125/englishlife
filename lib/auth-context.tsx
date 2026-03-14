"use client"

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { Role } from "@/lib/store"
import { setOnUnauthorized } from "@/lib/auth-callback"

export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
  branchId?: string | null
}

interface AuthContextType {
  user: AuthUser | null
  token: string | null
  isReady: boolean
  login: (user: AuthUser, token: string) => void
  logout: () => void
  /** Token eskirgan yoki rad etilganda chaqiring – storage tozalanadi */
  handleUnauthorized: () => void
  isAuthenticated: boolean
}

const AUTH_USER_KEY = "englishlife_user"
const AUTH_TOKEN_KEY = "englishlife_token"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function readStoredAuth(): { user: AuthUser | null; token: string | null } {
  if (typeof window === "undefined") return { user: null, token: null }
  try {
    const storedUser = localStorage.getItem(AUTH_USER_KEY)
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY)
    if (storedUser && storedToken) {
      const user = JSON.parse(storedUser) as AuthUser
      return { user, token: storedToken }
    }
  } catch {
    // ignore
  }
  return { user: null, token: null }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)
  const hydrated = useRef(false)

  useEffect(() => {
    if (hydrated.current) return
    hydrated.current = true
    const { user: u, token: t } = readStoredAuth()
    setUser(u)
    setToken(t)
    setIsReady(true)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    try {
      localStorage.removeItem(AUTH_USER_KEY)
      localStorage.removeItem(AUTH_TOKEN_KEY)
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    setOnUnauthorized(() => {
      logout()
      router.replace("/login")
    })
    return () => setOnUnauthorized(null)
  }, [logout, router])

  const login = useCallback((u: AuthUser, t: string) => {
    setUser(u)
    setToken(t)
    try {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(u))
      localStorage.setItem(AUTH_TOKEN_KEY, t)
    } catch {
      // ignore
    }
  }, [])

  const handleUnauthorized = useCallback(() => {
    setUser(null)
    setToken(null)
    try {
      localStorage.removeItem(AUTH_USER_KEY)
      localStorage.removeItem(AUTH_TOKEN_KEY)
    } catch {
      // ignore
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isReady,
        login,
        logout,
        handleUnauthorized,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
