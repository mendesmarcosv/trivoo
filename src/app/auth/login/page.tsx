'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { useForm } from '@/lib/hooks/useForm'
import Link from 'next/link'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Loading from '@/components/Loading'

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
    return <Loading fullScreen message="Carregando..." />
  }

  if (isAuthenticated) {
    return <Loading fullScreen message="Redirecionando..." />
  }

      return (
        <div className="h-screen flex overflow-hidden auth-page-mobile">
          {/* Left Side - Image */}
          <div className="hidden lg:flex lg:w-2/5 relative auth-image-side">
            <img 
              src="/images/login-foto-1.webp" 
              alt="Trivoo Login" 
              className="w-full h-full object-cover"
            />
            {/* Logo no canto superior esquerdo */}
            <div className="absolute top-8 left-8">
              <img src="/images/logo-trivoo-lightgreen.svg" alt="Trivoo" className="h-12" />
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full lg:w-3/5 flex items-center justify-center px-8 py-6 overflow-y-auto auth-form-side" style={{ backgroundColor: '#F3F3F5' }}>
        <div className="w-full" style={{ maxWidth: '490px' }}>
          {/* Logo for mobile */}
          <div className="auth-logo-mobile lg:hidden text-center mb-6">
            <img src="/images/logo-trivoo-dark.svg" alt="Trivoo" className="h-10 mx-auto" />
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Bem-vindo de volta!</h1>
            <p className="text-neutral-600 text-sm">Entre na sua conta para continuar</p>
          </div>

              <div className="bg-white rounded-2xl p-6 border border-neutral-200">
                <form onSubmit={form.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <Input
                    label="Email"
                    type="email"
                    placeholder="seu@email.com"
                    value={form.values.email}
                    onChange={(e) => form.setValue('email', e.target.value)}
                    onBlur={() => form.setTouched('email')}
                    error={form.errors.email}
                    required
                  />

                  <Input
                    label="Senha"
                    type="password"
                    placeholder="Digite sua senha"
                    value={form.values.password}
                    onChange={(e) => form.setValue('password', e.target.value)}
                    onBlur={() => form.setTouched('password')}
                    error={form.errors.password}
                    required
                  />

              {/* Manter conectado e Esqueceu senha */}
              <div style={{ 
                width: '100%', 
                paddingTop: '8px', 
                paddingBottom: '8px', 
                background: 'white', 
                overflow: 'hidden', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                display: 'flex' 
              }}>
                <div style={{ 
                  padding: '10px', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  gap: '10px', 
                  display: 'flex',
                  cursor: 'pointer'
                }}>
                  <input 
                    type="checkbox" 
                    id="keepConnected"
                    style={{ 
                      width: '18px', 
                      height: '18px', 
                      borderRadius: '4px', 
                      border: '1px solid #758A25',
                      cursor: 'pointer',
                      accentColor: '#758A25'
                    }} 
                  />
                  <label 
                    htmlFor="keepConnected"
                    style={{ 
                      color: '#4C4C4C', 
                      fontSize: '14px', 
                      fontFamily: 'Raleway', 
                      fontWeight: 600, 
                      lineHeight: '28px', 
                      wordWrap: 'break-word',
                      cursor: 'pointer'
                    }}
                  >
                    Manter-me conectado
                  </label>
                </div>
                <div style={{ 
                  padding: '10px', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  gap: '10px', 
                  display: 'flex',
                  cursor: 'pointer'
                }}>
                  <a 
                    href="#"
                    style={{ 
                      color: '#758A25', 
                      fontSize: '14px', 
                      fontFamily: 'Raleway', 
                      fontWeight: 600, 
                      lineHeight: '28px', 
                      wordWrap: 'break-word',
                      textDecoration: 'none'
                    }}
                  >
                    Esqueceu a senha?
                  </a>
                </div>
              </div>

              <Button
                type="submit"
                disabled={form.isSubmitting}
                className="w-full"
              >
                {form.isSubmitting ? 'Entrando...' : 'Fazer Login'}
              </Button>
            </form>

            {/* Ou continuar com */}
            <div style={{ 
              width: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px', 
              margin: '24px 0' 
            }}>
              <div style={{ flex: 1, height: '1px', background: '#758A25' }}></div>
              <span style={{ 
                color: '#758A25', 
                fontSize: '14px', 
                fontFamily: 'Raleway', 
                fontWeight: 600,
                whiteSpace: 'nowrap'
              }}>
                Ou continuar com
              </span>
              <div style={{ flex: 1, height: '1px', background: '#758A25' }}></div>
            </div>

            {/* Botões Google e Apple */}
            <div style={{ 
              display: 'flex', 
              gap: '16px', 
              width: '100%' 
            }}>
              <button
                type="button"
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  background: 'white',
                  border: '1px solid #E5E5E5',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontFamily: 'Raleway',
                  fontWeight: 600,
                  color: '#1A1A1A',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#F5F5F5'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.8 10.2273C19.8 9.52275 19.7455 8.83639 19.6436 8.16821H10.2V12.0491H15.7018C15.4582 13.3009 14.7345 14.3564 13.6564 15.0682V17.5773H16.8545C18.7636 15.8364 19.8 13.2727 19.8 10.2273Z" fill="#4285F4"/>
                  <path d="M10.2 20C12.96 20 15.2618 19.1045 16.8545 17.5773L13.6564 15.0682C12.7418 15.6682 11.5745 16.0227 10.2 16.0227C7.53818 16.0227 5.29636 14.2636 4.48545 11.9H1.17818V14.4909C2.75545 17.6591 6.18909 20 10.2 20Z" fill="#34A853"/>
                  <path d="M4.48545 11.9C4.27273 11.3 4.15364 10.6591 4.15364 10C4.15364 9.34091 4.27273 8.7 4.48545 8.1V5.50909H1.17818C0.427273 6.99091 0 8.65 0 10C0 11.35 0.427273 13.0091 1.17818 14.4909L4.48545 11.9Z" fill="#FBBC05"/>
                  <path d="M10.2 3.97727C11.6873 3.97727 13.0218 4.48182 14.0782 5.47273L16.9164 2.63455C15.2618 1.28455 12.96 0 10.2 0C6.18909 0 2.75545 2.34091 1.17818 5.50909L4.48545 8.1C5.29636 5.73636 7.53818 3.97727 10.2 3.97727Z" fill="#EA4335"/>
                </svg>
                Google
              </button>

              <button
                type="button"
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  background: 'white',
                  border: '1px solid #E5E5E5',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontFamily: 'Raleway',
                  fontWeight: 600,
                  color: '#1A1A1A',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#F5F5F5'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.5832 10.0001C16.5832 9.58343 16.5498 9.16676 16.4915 8.7751H9.99984V11.0751H13.7082C13.5582 11.8918 13.1082 12.6168 12.4498 13.1001V14.6418H14.6082C15.8248 13.5251 16.5832 11.9251 16.5832 10.0001Z" fill="#4285F4"/>
                  <path d="M9.99984 16.1667C11.6998 16.1667 13.1332 15.6167 14.6082 14.6417L12.4498 13.1C11.8915 13.4917 11.1748 13.7167 9.99984 13.7167C8.36651 13.7167 6.96651 12.5917 6.47484 11.1167H4.24984V12.7084C5.73317 15.6584 7.77484 16.1667 9.99984 16.1667Z" fill="#34A853"/>
                  <path d="M6.47484 11.1167C6.19984 10.3 6.19984 9.39998 6.47484 8.58331V6.99165H4.24984C3.23317 9.01665 3.23317 10.9833 4.24984 13.0083L6.47484 11.1167Z" fill="#FBBC05"/>
                  <path d="M9.99984 6.28333C11.2332 6.26666 12.4248 6.74166 13.3165 7.59166L15.2165 5.69166C13.0665 3.66666 10.1498 2.60833 6.47484 4.39166L8.69984 6.28333C9.18317 4.81666 10.5832 3.68333 12.2248 3.68333H9.99984V6.28333Z" fill="#EA4335"/>
                </svg>
                Apple
              </button>
            </div>

            {/* Create Account Link */}
            <div className="text-center mt-6">
              <span className="text-neutral-600 text-sm">Não tem conta? </span>
              <Link
                href="/auth/signup"
                className="text-green-700 hover:text-green-900 transition-colors font-medium no-underline text-sm"
              >
                Cadastre-se
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
