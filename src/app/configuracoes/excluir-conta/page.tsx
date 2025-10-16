'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import Sidebar from '@/components/Sidebar'
import PrimaryButton from '@/components/PrimaryButton'
import SecondaryButton from '@/components/SecondaryButton'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

export default function ExcluirContaPage() {
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [password, setPassword] = useState('')

  const handleDeleteAccount = async () => {
    if (confirmText !== 'EXCLUIR') {
      toast.error('Digite "EXCLUIR" para confirmar')
      return
    }

    if (!password) {
      toast.error('Digite sua senha para confirmar')
      return
    }

    setIsDeleting(true)
    try {
      // Verificar senha
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password
      })

      if (signInError) {
        toast.error('Senha incorreta')
        return
      }

      // Marcar perfil como deletado (soft delete)
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          is_deleted: true,
          deleted_at: new Date().toISOString()
        })
        .eq('id', user?.id)

      if (profileError) throw profileError

      // Fazer logout
      await signOut()
      
      toast.success('Conta excluída com sucesso')
      router.push('/auth/login')
    } catch (error: any) {
      console.error('Erro ao excluir conta:', error)
      toast.error(error.message || 'Erro ao excluir conta')
    } finally {
      setIsDeleting(false)
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
              Excluir conta
            </h1>
          </div>
        </div>

        <div style={{ maxWidth: '60%' }}>
          {!showConfirmation ? (
            <>
              <div className="config-section">
                <h2 style={{ 
                  fontSize: '22px', 
                  fontWeight: 600, 
                  color: 'var(--neutral-700)',
                  marginBottom: '24px'
                }}>
                  Antes de excluir sua conta
                </h2>
                
                <div style={{
                  padding: '20px',
                  backgroundColor: 'var(--red-50)',
                  borderRadius: '12px',
                  marginBottom: '24px',
                  border: '1px solid var(--red-200)'
                }}>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <i className="ph ph-warning" style={{ fontSize: '24px', color: 'var(--red-600)' }}></i>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--red-900)' }}>
                      Esta ação é permanente
                    </h3>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--red-800)', lineHeight: 1.6 }}>
                    Ao excluir sua conta, você perderá permanentemente:
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                  <div style={{
                    padding: '16px',
                    backgroundColor: 'var(--neutral-100)',
                    borderRadius: '12px',
                    display: 'flex',
                    gap: '12px'
                  }}>
                    <i className="ph ph-x-circle" style={{ fontSize: '20px', color: 'var(--red-600)', marginTop: '2px' }}></i>
                    <span style={{ fontSize: '14px', color: 'var(--ink-700)' }}>
                      Todos os seus dados pessoais e histórico
                    </span>
                  </div>
                  <div style={{
                    padding: '16px',
                    backgroundColor: 'var(--neutral-100)',
                    borderRadius: '12px',
                    display: 'flex',
                    gap: '12px'
                  }}>
                    <i className="ph ph-x-circle" style={{ fontSize: '20px', color: 'var(--red-600)', marginTop: '2px' }}></i>
                    <span style={{ fontSize: '14px', color: 'var(--ink-700)' }}>
                      Seus esportes de interesse e preferências
                    </span>
                  </div>
                  <div style={{
                    padding: '16px',
                    backgroundColor: 'var(--neutral-100)',
                    borderRadius: '12px',
                    display: 'flex',
                    gap: '12px'
                  }}>
                    <i className="ph ph-x-circle" style={{ fontSize: '20px', color: 'var(--red-600)', marginTop: '2px' }}></i>
                    <span style={{ fontSize: '14px', color: 'var(--ink-700)' }}>
                      Suas inscrições em eventos e aulas
                    </span>
                  </div>
                  <div style={{
                    padding: '16px',
                    backgroundColor: 'var(--neutral-100)',
                    borderRadius: '12px',
                    display: 'flex',
                    gap: '12px'
                  }}>
                    <i className="ph ph-x-circle" style={{ fontSize: '20px', color: 'var(--red-600)', marginTop: '2px' }}></i>
                    <span style={{ fontSize: '14px', color: 'var(--ink-700)' }}>
                      Suas avaliações e comentários
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-start' }}>
                <PrimaryButton onClick={() => router.push('/configuracoes')}>
                  Manter minha conta
                </PrimaryButton>
                <SecondaryButton onClick={() => setShowConfirmation(true)}>
                  Continuar com exclusão
                </SecondaryButton>
              </div>
            </>
          ) : (
            <>
              <div className="config-section">
                <h2 style={{ 
                  fontSize: '22px', 
                  fontWeight: 600, 
                  color: 'var(--red-700)',
                  marginBottom: '24px'
                }}>
                  Confirmar exclusão da conta
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <label style={{
                      display: 'block', 
                      marginBottom: '8px', 
                      color: 'var(--ink-700)', 
                      fontSize: '14px',
                      fontWeight: 500
                    }}>
                      Digite &quot;EXCLUIR&quot; para confirmar
                    </label>
                    <input
                      type="text"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                      placeholder="EXCLUIR"
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
                      Senha
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Digite sua senha"
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
                <SecondaryButton onClick={() => setShowConfirmation(false)} fullWidth>
                  Voltar
                </SecondaryButton>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting || confirmText !== 'EXCLUIR' || !password}
                  style={{
                    flex: 1,
                    padding: '12px 32px',
                    borderRadius: '24px',
                    border: 'none',
                    backgroundColor: 'var(--red-600)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: (isDeleting || confirmText !== 'EXCLUIR' || !password) ? 'not-allowed' : 'pointer',
                    opacity: (isDeleting || confirmText !== 'EXCLUIR' || !password) ? 0.5 : 1,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => !isDeleting && confirmText === 'EXCLUIR' && password && (e.currentTarget.style.backgroundColor = 'var(--red-700)')}
                  onMouseLeave={e => !isDeleting && confirmText === 'EXCLUIR' && password && (e.currentTarget.style.backgroundColor = 'var(--red-600)')}
                >
                  {isDeleting ? 'Excluindo...' : 'Excluir permanentemente'}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
