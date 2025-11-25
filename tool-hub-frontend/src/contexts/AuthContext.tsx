"use client"

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import Cookies from 'js-cookie'
import { AuthContextType, LoginRequestDTO, User } from '@/types/auth'
import AuthService from '@/services/authService'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = useMemo(() => !!user && !!token, [user, token])

  useEffect(() => {
    // Verificar se há token salvo nos cookies
    const savedToken = Cookies.get('token')
    const savedUser = Cookies.get('user')

    if (savedToken && savedUser) {
      try {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      } catch {
        // Limpar cookies corrompidos
        Cookies.remove('token')
        Cookies.remove('user')
      }
    }

    setIsLoading(false)
  }, [])

  const login = useCallback(async (credentials: LoginRequestDTO) => {
    try {
      setIsLoading(true)
      const response = await AuthService.login(credentials)

      console.log('Login response:', response)
      setToken(response.token)
      setUser(response.user)

      // Salvar nos cookies
      Cookies.set('token', response.token, { expires: 7 }) // 7 dias
      Cookies.set('user', JSON.stringify(response.user), { expires: 7 })
      console.log('User saved to cookies:', response.user)

    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    Cookies.remove('token')
    Cookies.remove('user')
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
