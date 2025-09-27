'use client'

import { useState, useEffect } from 'react'
import { MockUser, defaultUser } from '@/data/mockUsers'

interface AuthState {
  user: MockUser | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: defaultUser, // Sempre usar usuário fictício por padrão
    loading: false,
    error: null
  })

  useEffect(() => {
    // Simular carregamento inicial
    const timer = setTimeout(() => {
      setAuthState(prev => ({
        ...prev,
        loading: false
      }))
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    // Simular delay de login
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Sempre retornar sucesso com usuário fictício
    setAuthState(prev => ({
      ...prev,
      loading: false,
      user: defaultUser
    }))
    
    return { success: true, user: defaultUser }
  }

  const signUp = async (email: string, password: string, userData?: any) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    // Simular delay de cadastro
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Sempre retornar sucesso com usuário fictício
    setAuthState(prev => ({
      ...prev,
      loading: false,
      user: defaultUser
    }))
    
    return { success: true, user: defaultUser }
  }

  const signOut = async () => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    // Simular delay de logout
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Manter usuário fictício mesmo após logout
    setAuthState(prev => ({
      ...prev,
      loading: false,
      user: defaultUser
    }))
    
    return { success: true }
  }

  const resetPassword = async (email: string) => {
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { success: true }
  }

  return {
    user: authState.user,
    userProfile: authState.user, // Usar o mesmo usuário como perfil
    loading: authState.loading,
    error: authState.error,
    isAuthenticated: true, // Sempre autenticado com dados fictícios
    signIn,
    signUp,
    signOut,
    resetPassword,
    fetchUserProfile: async () => authState.user
  }
}