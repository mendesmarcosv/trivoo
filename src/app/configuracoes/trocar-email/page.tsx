'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import Sidebar from '@/components/Sidebar'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

export default function TrocarEmailPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isSending, setIsSending] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async () => {
    if (!newEmail || !password) {
      toast.error('Preencha todos os campos')
      return
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail)) {
      toast.error('Email inválido')
      return
    }

    setIsSending(true)
    try {
      // Primeiro verificar a senha atual
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password
      })

      if (signInError) {
        toast.error('Senha incorreta')
        return
      }

      // Atualizar email
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      })

      if (error) throw error

      toast.success('Um email de confirmação foi enviado para o novo endereço!')
      
      // Limpar campos
      setNewEmail('')
      setPassword('')
    } catch (error: any) {
      console.error('Erro ao trocar email:', error)
      toast.error(error.message || 'Erro ao trocar email')
    } finally {
      setIsSending(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="layout">
      <Sidebar />
      
      <main className="config-content">
        <div className="config-header" style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => router.push('/configuracoes')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <i className="ph ph-caret-left" style={{ fontSize: '24px', color: 'var(--ink-600)' }}></i>
            </button>
            <h1 style={{ fontSize: '30px', fontWeight: 600, color: 'var(--ink-800)' }}>
              Trocar e-mail
            </h1>
          </div>
        </div>

        <div style={{ maxWidth: '60%' }}>
          <div className="config-section">
            <div style={{
              padding: '16px',
              backgroundColor: 'var(--green-50)',
              borderRadius: '12px',
              marginBottom: '24px',
              display: 'flex',
              gap: '12px'
            }}>
              <i className="ph ph-info" style={{ fontSize: '20px', color: 'var(--green-700)', marginTop: '2px' }}></i>
              <div style={{ fontSize: '14px', color: 'var(--green-900)', lineHeight: 1.5 }}>
                Você receberá um email de confirmação no novo endereço. 
                Clique no link para confirmar a alteração.
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'var(--ink-700)', 
                  fontSize: '14px',
                  fontWeight: 500
                }}>
                  E-mail atual
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: 'var(--neutral-300)',
                    fontSize: '16px',
                    color: 'var(--ink-600)',
                    cursor: 'not-allowed'
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'var(--ink-700)', 
                  fontSize: '14px',
                  fontWeight: 500
                }}>
                  Novo e-mail
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="novo@email.com"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: 'var(--neutral-200)',
                    fontSize: '16px',
                    color: 'var(--ink-800)',
                    transition: 'background-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.backgroundColor = 'white'}
                  onBlur={(e) => e.target.style.backgroundColor = 'var(--neutral-200)'}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'var(--ink-700)', 
                  fontSize: '14px',
                  fontWeight: 500
                }}>
                  Senha atual
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha para confirmar"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: 'var(--neutral-200)',
                    fontSize: '16px',
                    color: 'var(--ink-800)',
                    transition: 'background-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.backgroundColor = 'white'}
                  onBlur={(e) => e.target.style.backgroundColor = 'var(--neutral-200)'}
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
            <button
              onClick={() => router.push('/configuracoes')}
              style={{
                padding: '12px 32px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: 'var(--neutral-200)',
                color: 'var(--ink-700)',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--neutral-300)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--neutral-200)'}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSending || !newEmail || !password}
              style={{
                padding: '12px 32px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: 'var(--green-900)',
                color: 'white',
                fontSize: '16px',
                fontWeight: 600,
                cursor: (isSending || !newEmail || !password) ? 'not-allowed' : 'pointer',
                opacity: (isSending || !newEmail || !password) ? 0.5 : 1,
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => !isSending && newEmail && password && (e.currentTarget.style.backgroundColor = 'var(--green-950)')}
              onMouseLeave={e => !isSending && newEmail && password && (e.currentTarget.style.backgroundColor = 'var(--green-900)')}
            >
              {isSending ? 'Enviando...' : 'Confirmar alteração'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

interface ToggleSwitchProps {
  checked: boolean
  onChange: () => void
}

function ToggleSwitch({ checked, onChange }: ToggleSwitchProps) {
  return (
    <button
      onClick={onChange}
      style={{
        width: '48px',
        height: '28px',
        borderRadius: '14px',
        border: 'none',
        backgroundColor: checked ? 'var(--green-700)' : 'var(--neutral-300)',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
      }}
    >
      <div style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: 'white',
        position: 'absolute',
        top: '4px',
        left: checked ? '24px' : '4px',
        transition: 'left 0.2s'
      }} />
    </button>
  )
}
