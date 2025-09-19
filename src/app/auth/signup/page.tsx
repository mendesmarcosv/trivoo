'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { useForm } from '@/lib/hooks/useForm'
import Link from 'next/link'

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

      const result = await signUp(values.email, values.password, { 
        name: values.name,
        phone: values.phone 
      })
      if (result.success) {
        router.push('/auth/login?message=Conta criada com sucesso! Verifique seu email.')
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
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#4C5E18] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-[#4C5E18]">Trivoo</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Já tem conta?</span>
              <Link
                href="/auth/login"
                className="px-4 py-2 text-[#758A25] border border-[#758A25] rounded-xl hover:bg-[#758A25] hover:text-white transition-colors"
              >
                Fazer login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto mt-16 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Crie sua conta</h1>
          <p className="text-gray-600">Junte-se à comunidade esportiva</p>
        </div>

        <div className="bg-white rounded-2xl p-8">
          <form onSubmit={form.handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome completo
              </label>
              <input
                type="text"
                placeholder="Digite seu nome completo"
                value={form.values.name}
                onChange={(e) => form.setValue('name', e.target.value)}
                onBlur={() => form.setTouched('name')}
                className={`w-full px-4 py-3 border rounded-xl transition-colors focus:outline-none focus:ring-2 ${
                  form.errors.name
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                }`}
                required
              />
              {form.errors.name && (
                <p className="text-red-500 text-sm mt-1">{form.errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Digite seu email"
                value={form.values.email}
                onChange={(e) => form.setValue('email', e.target.value)}
                onBlur={() => form.setTouched('email')}
                className={`w-full px-4 py-3 border rounded-xl transition-colors focus:outline-none focus:ring-2 ${
                  form.errors.email
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                }`}
                required
              />
              {form.errors.email && (
                <p className="text-red-500 text-sm mt-1">{form.errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
              <input
                type="tel"
                placeholder="(00) 00000-0000"
                value={form.values.phone}
                onChange={(e) => form.setValue('phone', e.target.value)}
                onBlur={() => form.setTouched('phone')}
                className={`w-full px-4 py-3 border rounded-xl transition-colors focus:outline-none focus:ring-2 ${
                  form.errors.phone
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                }`}
                required
              />
              {form.errors.phone && (
                <p className="text-red-500 text-sm mt-1">{form.errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                placeholder="Crie uma senha forte"
                value={form.values.password}
                onChange={(e) => form.setValue('password', e.target.value)}
                onBlur={() => form.setTouched('password')}
                className={`w-full px-4 py-3 border rounded-xl transition-colors focus:outline-none focus:ring-2 ${
                  form.errors.password
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                }`}
                required
              />
              {form.errors.password && (
                <p className="text-red-500 text-sm mt-1">{form.errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar senha
              </label>
              <input
                type="password"
                placeholder="Digite a senha novamente"
                value={form.values.confirmPassword}
                onChange={(e) => form.setValue('confirmPassword', e.target.value)}
                onBlur={() => form.setTouched('confirmPassword')}
                className={`w-full px-4 py-3 border rounded-xl transition-colors focus:outline-none focus:ring-2 ${
                  form.errors.confirmPassword
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
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

            <button
              type="submit"
              disabled={form.isSubmitting}
              className="w-full bg-[#4C5E18] text-white py-3 px-6 rounded-xl font-medium hover:bg-[#3d4d14] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {form.isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Criando conta...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <i className="ph ph-user-plus mr-2"></i>
                  Criar conta
                </div>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Ao criar uma conta, você concorda com nossos{' '}
            <Link href="/terms" className="text-[#758A25] hover:text-[#4C5E18] transition-colors">
              Termos de Uso
            </Link>{' '}
            e{' '}
            <Link href="/privacy" className="text-[#758A25] hover:text-[#4C5E18] transition-colors">
              Política de Privacidade
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>&copy; 2024 Trivoo. Todos os direitos reservados.</p>
        </div>
      </main>
    </div>
  )
}
