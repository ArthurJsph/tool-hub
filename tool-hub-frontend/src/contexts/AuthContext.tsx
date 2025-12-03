"use client"

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { AuthContextType, LoginRequestDTO, User } from '@/types/auth'
import AuthService from '@/services/authService'
import { storage, STORAGE_KEYS } from '@/lib/storage'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = useMemo(() => !!user && !!token, [user, token])

  useEffect(() => {
    // Check session with backend instead of reading local cookies
    const checkSession = async () => {
      try {
        const isValid = await AuthService.validateToken()
        if (isValid) {
          const savedUser = storage.get(STORAGE_KEYS.USER_CACHE)
          if (savedUser) {
            setUser(JSON.parse(savedUser))
            setToken('http-only-cookie')
          } else {
            // If valid but no user cache, maybe fetch user profile?
            // For now, let's assume cache is source of truth for user details
            // or trigger a fetch if needed.
            // Ideally: const user = await apiService.get('/users/me')
            // setUser(user)
          }
        } else {
          // Invalid session
          setUser(null)
          setToken(null)
          storage.remove(STORAGE_KEYS.USER_CACHE)
        }
      } catch (error) {
        console.error('Session check failed', error)
        setUser(null)
        setToken(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  const login = useCallback(async (credentials: LoginRequestDTO) => {
    try {
      setIsLoading(true)
      const response = await AuthService.login(credentials)

      // Token is now in HttpOnly cookie, handled by browser
      setToken('http-only-cookie') // Dummy value to indicate auth
      setUser(response.user)

      // Cache user info for UI (not sensitive data)
      storage.setJSON(STORAGE_KEYS.USER_CACHE, response.user)

    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await AuthService.logout()
    } catch (e) {
      console.error('Logout failed', e)
    }
    setUser(null)
    setToken(null)
    storage.remove(STORAGE_KEYS.USER_CACHE)
    window.location.href = '/auth' // Force redirect to login
  }, [])

  const value = useMemo(() => ({
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated,
  }), [user, token, login, logout, isLoading, isAuthenticated])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

export default AuthContext
