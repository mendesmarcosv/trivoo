'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { useForm } from '@/lib/hooks/useForm'
import Link from 'next/link'
import Button from '@/components/Button'
import { toast } from 'react-hot-toast'

export default function SignupPage() {
  const router = useRouter()
  const { signUp, isAuthenticated, loading } = useAuth()

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    },
    onSubmit: async (values) => {
      if (values.password !== values.confirmPassword) {
        throw new Error('As senhas não coincidem')
      }

      if (values.password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres')
      }

      const result = await signUp(values.email, values.password, { 
        name: values.name,
        phone: values.phone 
      })
      
      if (result.success) {
        toast.success('Conta criada com sucesso! Verifique seu email.')
        router.push('/auth/login')
      } else {
        throw new Error(result.error?.message || 'Erro no cadastro')
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
      <div className="mb-8">
        <img src="/images/logo-trivoo-dark.svg" alt="Trivoo" className="h-10" />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Crie sua conta</h1>
          <p className="text-neutral-600">Junte-se à comunidade esportiva</p>
        </div>

        <div className="bg-white rounded-2xl p-8 mb-6">
          <form onSubmit={form.handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Nome completo
              </label>
              <input
                type="text"
                placeholder="Digite seu nome completo"
                value={form.values.name}
                onChange={(e) => form.setValue('name', e.target.value)}
                onBlur={() => form.setTouched('name')}
                className={`w-full px-4 py-3 border-0 rounded-xl transition-colors focus:outline-none focus:ring-2 text-sm placeholder:text-sm ${
                  form.errors.name
                    ? 'bg-red-50 focus:ring-red-200'
                    : 'bg-neutral-100 focus:ring-green-700 focus:bg-white'
                }`}
                required
              />
              {form.errors.name && (
                <p className="text-red-500 text-sm mt-1">{form.errors.name}</p>
              )}
            </div>

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
                Telefone
              </label>
              <input
                type="tel"
                placeholder="(00) 00000-0000"
                value={form.values.phone}
                onChange={(e) => form.setValue('phone', e.target.value)}
                onBlur={() => form.setTouched('phone')}
                className={`w-full px-4 py-3 border-0 rounded-xl transition-colors focus:outline-none focus:ring-2 text-sm placeholder:text-sm ${
                  form.errors.phone
                    ? 'bg-red-50 focus:ring-red-200'
                    : 'bg-neutral-100 focus:ring-green-700 focus:bg-white'
                }`}
                required
              />
              {form.errors.phone && (
                <p className="text-red-500 text-sm mt-1">{form.errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                placeholder="Crie uma senha (mínimo 6 caracteres)"
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

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Confirmar senha
              </label>
              <input
                type="password"
                placeholder="Digite a senha novamente"
                value={form.values.confirmPassword}
                onChange={(e) => form.setValue('confirmPassword', e.target.value)}
                onBlur={() => form.setTouched('confirmPassword')}
                className={`w-full px-4 py-3 border-0 rounded-xl transition-colors focus:outline-none focus:ring-2 text-sm placeholder:text-sm ${
                  form.errors.confirmPassword
                    ? 'bg-red-50 focus:ring-red-200'
                    : 'bg-neutral-100 focus:ring-green-700 focus:bg-white'
                }`}
                required
              />
              {form.errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{form.errors.confirmPassword}</p>
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
              {form.isSubmitting ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </form>
        </div>

        <div className="text-center mt-4">
          <span className="text-neutral-600">Já tem conta? </span>
          <Link
            href="/auth/login"
            className="text-green-700 hover:text-green-900 transition-colors font-medium no-underline"
          >
            Fazer login
          </Link>
        </div>
      </div>

      <div className="text-center mt-8 text-neutral-500 text-sm">
        <p>&copy; 2025 Trivoo. Todos os direitos reservados.</p>
      </div>
    </div>
  )
}

