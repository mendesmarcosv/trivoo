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
  fitness_level?: string
  city?: string
  birth_date?: string
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true, // Começa true para evitar redirects prematuros
    error: null
  })
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Função para buscar perfil do usuário
  const fetchUserProfile = async (userId?: string) => {
    const id = userId || authState.user?.id
    if (!id) return null

    // Timeout de 5 segundos para buscar perfil
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
    )

    try {
      const queryPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any

      if (error) {
        // Se o perfil não existir, criar um novo
        if (error.code === 'PGRST116') {
          console.log('Perfil não encontrado, criando...')
          const user = authState.user || await supabase.auth.getUser().then(r => r.data.user)
          
          if (user) {
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                name: user.user_metadata?.name || '',
                phone: user.user_metadata?.phone || '',
                bio: '',
                location: 'Niterói',
                location_coords: null,
                avatar_url: null
              })
              .select()
              .single()

            if (createError) {
              console.error('Erro ao criar perfil:', createError)
              return null
            }

            setUserProfile(newProfile)
            return newProfile
          }
        }
        console.error('Erro ao buscar perfil:', error)
        return null
      }

      setUserProfile(data)
      return data
    } catch (error: any) {
      if (error.message === 'Profile fetch timeout') {
        console.warn('Timeout ao buscar perfil - continuando sem perfil')
      } else {
        console.error('Erro ao buscar perfil:', error)
      }
      return null
    }
  }

  useEffect(() => {
    let isMounted = true
    
    // Verificar sessão inicial
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (isMounted) {
          setAuthState({
            user,
            loading: false,
            error
          })
          setIsInitialized(true)

          // Buscar perfil se usuário estiver autenticado
          if (user) {
            fetchUserProfile(user.id).catch(err => {
              console.error('Erro ao buscar perfil:', err)
            })
          }
        }
      } catch (error) {
        if (isMounted) {
          setAuthState({
            user: null,
            loading: false,
            error: error as AuthError
          })
          setIsInitialized(true)
        }
      }
    }

    checkUser()
    
    // Timeout de segurança apenas se não inicializou
    const safetyTimeout = setTimeout(() => {
      if (!isInitialized && isMounted) {
        console.warn('Auth timeout - forçando loading: false')
        setAuthState(prev => ({ ...prev, loading: false }))
        setIsInitialized(true)
      }
    }, 5000) // 5 segundos

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (isMounted) {
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
      }
    )

    return () => {
      isMounted = false
      clearTimeout(safetyTimeout)
      subscription.unsubscribe()
    }
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