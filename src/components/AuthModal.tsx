'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useForm } from '@/lib/hooks/useForm'
import { useAuth } from '@/lib/hooks/useAuth'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'login' | 'signup'
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode)
  const { signIn, signUp, loading } = useAuth()

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: ''
    },
    onSubmit: async (values) => {
      let result
      if (mode === 'login') {
        result = await signIn(values.email, values.password)
      } else {
        result = await signUp(values.email, values.password, { name: values.name })
      }

      if (result.success) {
        onClose()
      } else {
        throw new Error(result.error?.message || 'Erro na autenticação')
      }
    }
  })

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 9999 }}>
      <div className="absolute inset-0 bg-black/60" aria-hidden="true"></div>
      <div className="relative bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {mode === 'login' ? 'Bem-vindo de volta!' : 'Crie sua conta'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="ph ph-x text-xl"></i>
          </button>
        </div>

        <form onSubmit={form.handleSubmit} className="space-y-4">
          {mode === 'signup' && (
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
          )}

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
              Senha
            </label>
            <input
              type="password"
              placeholder="Digite sua senha"
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

          {form.submitError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-red-600 text-sm">{form.submitError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || form.isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {form.isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Processando...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <i className={`ph ${mode === 'login' ? 'ph-sign-in' : 'ph-user-plus'} mr-2`}></i>
                {mode === 'login' ? 'Entrar' : 'Criar conta'}
              </div>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm mb-2">
            {mode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
          </p>
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            {mode === 'login' ? 'Criar conta gratuita' : 'Fazer login'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
