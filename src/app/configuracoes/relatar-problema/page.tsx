'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import Sidebar from '@/components/Sidebar'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

export default function RelatarProblemaPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isSending, setIsSending] = useState(false)
  const [category, setCategory] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const categories = [
    'Erro técnico',
    'Problema de performance',
    'Problema com login',
    'Problema com pagamento',
    'Conteúdo inadequado',
    'Problema com notificações',
    'Outro'
  ]

  const handleSubmit = async () => {
    if (!user?.id) {
      toast.error('Você precisa estar logado')
      return
    }

    if (!category || !title || !description) {
      toast.error('Preencha todos os campos')
      return
    }

    setIsSending(true)
    try {
      const { error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.id,
          category,
          title,
          description,
          status: 'open',
          created_at: new Date().toISOString()
        })

      if (error) throw error

      toast.success('Problema relatado com sucesso! Nossa equipe entrará em contato.')
      
      // Limpar formulário
      setCategory('')
      setTitle('')
      setDescription('')
      
      // Voltar para configurações após 2 segundos
      setTimeout(() => {
        router.push('/configuracoes')
      }, 2000)
    } catch (error) {
      console.error('Erro ao enviar:', error)
      toast.error('Erro ao enviar relatório')
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
              Relatar um problema
            </h1>
          </div>
        </div>

        <div style={{ maxWidth: '60%' }}>
          <div className="config-section">
            <p style={{ 
              fontSize: '14px', 
              color: 'var(--ink-600)', 
              marginBottom: '24px',
              lineHeight: 1.5
            }}>
              Encontrou algum problema ou tem alguma sugestão? Conte para nós! 
              Nossa equipe analisará seu relato e entrará em contato o mais breve possível.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'var(--ink-700)', 
                  fontSize: '14px',
                  fontWeight: 500
                }}>
                  Categoria
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: 'var(--neutral-200)',
                    fontSize: '16px',
                    color: category ? 'var(--ink-800)' : 'var(--ink-600)',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.backgroundColor = 'white'}
                  onBlur={(e) => e.target.style.backgroundColor = 'var(--neutral-200)'}
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'var(--ink-700)', 
                  fontSize: '14px',
                  fontWeight: 500
                }}>
                  Título do problema
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Não consigo fazer login"
                  maxLength={100}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ 
                    color: 'var(--ink-700)', 
                    fontSize: '14px',
                    fontWeight: 500
                  }}>
                    Descrição detalhada
                  </label>
                  <span style={{ 
                    color: 'var(--ink-600)', 
                    fontSize: '12px'
                  }}>
                    {description.length}/1000
                  </span>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => {
                    if (e.target.value.length <= 1000) {
                      setDescription(e.target.value)
                    }
                  }}
                  placeholder="Descreva o problema em detalhes. Inclua o que você estava fazendo, o que aconteceu e quando o problema ocorreu..."
                  rows={8}
                  maxLength={1000}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: 'var(--neutral-200)',
                    fontSize: '16px',
                    color: 'var(--ink-800)',
                    resize: 'vertical',
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
              disabled={isSending || !category || !title || !description}
              style={{
                padding: '12px 32px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: 'var(--green-900)',
                color: 'white',
                fontSize: '16px',
                fontWeight: 600,
                cursor: (isSending || !category || !title || !description) ? 'not-allowed' : 'pointer',
                opacity: (isSending || !category || !title || !description) ? 0.5 : 1,
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => !isSending && category && title && description && (e.currentTarget.style.backgroundColor = 'var(--green-950)')}
              onMouseLeave={e => !isSending && category && title && description && (e.currentTarget.style.backgroundColor = 'var(--green-900)')}
            >
              {isSending ? 'Enviando...' : 'Enviar relatório'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
