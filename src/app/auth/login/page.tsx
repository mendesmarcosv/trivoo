'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { useForm } from '@/lib/hooks/useForm'
import Link from 'next/link'
import Button from '@/components/Button'

export default function LoginPage() {
  const router = useRouter()
  const { signIn, isAuthenticated, loading } = useAuth()

  const form = useForm({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: async (values) => {
      const result = await signIn(values.email, values.password)
      if (result.success) {
        router.push('/')
      } else {
        // Tratar diferentes tipos de erro do Supabase
        let errorMessage = 'Erro no login'
        
        if (result.error?.message) {
          switch (result.error.message) {
            case 'Invalid login credentials':
              errorMessage = 'Email ou senha incorretos'
              break
            case 'Email not confirmed':
              errorMessage = 'Confirme seu email antes de fazer login'
              break
            case 'Too many requests':
              errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos'
              break
            default:
              errorMessage = result.error.message
          }
        }
        
        throw new Error(errorMessage)
      }
    }
  })

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center px-4 py-8">
      {/* Logo */}
      <div className="mb-8">
        <img src="/images/logo-trivoo-dark.svg" alt="Trivoo" className="h-10" />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Bem-vindo de volta!</h1>
          <p className="text-neutral-600">Entre na sua conta para continuar</p>
        </div>

        <div className="bg-white rounded-2xl p-8 mb-6">
          <form onSubmit={form.handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Digite seu email"
                value={form.values.email}
                onChange={(e) => form.setValue('email', e.target.value)}
                onBlur={() => form.setTouched('email')}
                className={`w-full px-4 py-3 border-0 rounded-xl transition-colors focus:outline-none focus:ring-2 text-sm placeholder:text-sm ${
                  form.errors.email
                    ? 'bg-red-50 focus:ring-red-200'
                    : 'bg-neutral-100 focus:ring-green-700 focus:bg-white'
                }`}
                required
              />
              {form.errors.email && (
                <p className="text-red-500 text-sm mt-1">{form.errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                placeholder="Digite sua senha"
                value={form.values.password}
                onChange={(e) => form.setValue('password', e.target.value)}
                onBlur={() => form.setTouched('password')}
                className={`w-full px-4 py-3 border-0 rounded-xl transition-colors focus:outline-none focus:ring-2 text-sm placeholder:text-sm ${
                  form.errors.password
                    ? 'bg-red-50 focus:ring-red-200'
                    : 'bg-neutral-100 focus:ring-green-700 focus:bg-white'
                }`}
                required
              />
              {form.errors.password && (
                <p className="text-red-500 text-sm mt-1">{form.errors.password}</p>
              )}
            </div>

            {form.submitError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-red-600 text-sm">{form.submitError}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={form.isSubmitting}
              className="w-full"
            >
              {form.isSubmitting ? 'Entrando...' : 'Fazer Login'}
            </Button>
          </form>
        </div>

        {/* Create Account Link */}
        <div className="text-center">
          <span className="text-neutral-600">Não tem conta? </span>
          <Link
            href="/auth/signup"
            className="text-green-700 hover:text-green-900 transition-colors font-medium no-underline"
          >
            Criar conta
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 text-neutral-500 text-sm">
        <p>&copy; 2025 Trivoo. Todos os direitos reservados.</p>
      </div>
    </div>
  )
}
