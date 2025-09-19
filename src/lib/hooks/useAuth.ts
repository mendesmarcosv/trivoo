'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { User, AuthError } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  loading: boolean
  error: AuthError | null
}

interface UserProfile {
  id?: string
  name?: string
  phone?: string
  bio?: string
  location?: string
  location_coords?: any
  avatar_url?: string
  created_at?: string
  updated_at?: string
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  })
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  // Função para buscar perfil do usuário
  const fetchUserProfile = async (userId?: string) => {
    const id = userId || authState.user?.id
    if (!id) return null

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Erro ao buscar perfil:', error)
        return null
      }

      setUserProfile(data)
      return data
    } catch (error) {
      console.error('Erro ao buscar perfil:', error)
      return null
    }
  }

  useEffect(() => {
    // Verificar sessão inicial
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        // Pequeno delay para evitar flash
        await new Promise(resolve => setTimeout(resolve, 100))
        
        setAuthState({
          user,
          loading: false,
          error
        })

        // Buscar perfil se usuário estiver autenticado
        if (user) {
          await fetchUserProfile(user.id)
        }
      } catch (error) {
        setAuthState({
          user: null,
          loading: false,
          error: error as AuthError
        })
      }
    }

    checkUser()

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthState(prev => ({
          user: session?.user ?? null,
          loading: false,
          error: null
        }))

        // Buscar perfil quando usuário fizer login
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
          setUserProfile(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      // Buscar perfil após login
      if (data.user) {
        await fetchUserProfile(data.user.id)
      }

      return { success: true, user: data.user }
    } catch (error) {
      setAuthState(prev => ({ ...prev, error: error as AuthError }))
      return { success: false, error: error as AuthError }
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }))
    }
  }

  const signUp = async (email: string, password: string, userData?: any) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })

      if (error) throw error

      // Criar profile automaticamente após cadastro
      if (data.user) {
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              name: userData?.name || '',
              phone: userData?.phone || '',
              bio: '',
              location: 'Niterói',
              location_coords: null,
              avatar_url: null
            })

          if (profileError) {
            console.error('Erro ao criar profile:', profileError)
          } else {
            // Buscar perfil criado
            await fetchUserProfile(data.user.id)
          }
        } catch (profileError) {
          console.error('Erro ao criar profile:', profileError)
        }
      }

      return { success: true, user: data.user }
    } catch (error) {
      setAuthState(prev => ({ ...prev, error: error as AuthError }))
      return { success: false, error: error as AuthError }
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }))
    }
  }

  const signOut = async () => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUserProfile(null)
      return { success: true }
    } catch (error) {
      setAuthState(prev => ({ ...prev, error: error as AuthError }))
      return { success: false, error: error as AuthError }
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }))
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
      return { success: true }
    } catch (error) {
      return { success: false, error: error as AuthError }
    }
  }

  return {
    user: authState.user,
    userProfile,
    loading: authState.loading,
    error: authState.error,
    isAuthenticated: !!authState.user,
    signIn,
    signUp,
    signOut,
    resetPassword,
    fetchUserProfile
  }
}