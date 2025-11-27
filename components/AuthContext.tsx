"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { loginUser, registerUser, getCurrentUser, type AuthResponse, type User } from "@/lib/api"

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (identifier: string, password: string) => Promise<AuthResponse>
  register: (userData: {
    username: string
    email: string
    password: string
    name?: string
    phone?: string
  }) => Promise<AuthResponse>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (savedToken) {
      void loadUser(savedToken)
    } else {
      setLoading(false)
    }
  }, [])

  async function loadUser(authToken: string) {
    try {
      const userData = await getCurrentUser(authToken)
      setUser(userData)
      setToken(authToken)
    } catch (error) {
      console.error("Error al cargar usuario:", error)
      localStorage.removeItem("token")
    } finally {
      setLoading(false)
    }
  }

  async function login(identifier: string, password: string): Promise<AuthResponse> {
    const data = await loginUser(identifier, password)
    localStorage.setItem("token", data.jwt)
    setToken(data.jwt)
    setUser(data.user)
    return data
  }

  async function register(userData: {
    username: string
    email: string
    password: string
    name?: string
    phone?: string
  }): Promise<AuthResponse> {
    const payload = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      name: userData.name ?? "",
      phone: userData.phone ?? "",
    }
    const data = await registerUser(payload)
    localStorage.setItem("token", data.jwt)
    setToken(data.jwt)
    setUser(data.user)
    return data
  }

  function logout() {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
