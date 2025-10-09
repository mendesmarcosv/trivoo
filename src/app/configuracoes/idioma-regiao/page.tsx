'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import Sidebar from '@/components/Sidebar'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

export default function IdiomaRegiaoPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [language, setLanguage] = useState('pt-BR')
  const [timezone, setTimezone] = useState('America/Sao_Paulo')
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadSettings()
    }
  }, [user])

  const loadSettings = async () => {
    if (!user?.id) return

    const { data } = await supabase
      .from('user_settings')
      .select('language_preferences')
      .eq('user_id', user.id)
      .single()

    if (data?.language_preferences) {
      setLanguage(data.language_preferences.language || 'pt-BR')
      setTimezone(data.language_preferences.timezone || 'America/Sao_Paulo')
      setDateFormat(data.language_preferences.dateFormat || 'DD/MM/YYYY')
    }
  }

  const handleSave = async () => {
    if (!user?.id) return

    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          language_preferences: {
            language,
            timezone,
            dateFormat
          },
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      toast.success('Idioma e região atualizados!')
    } catch (error) {
      console.error('Erro ao salvar:', error)
      toast.error('Erro ao salvar configurações')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) return null

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
              Idioma e região
            </h1>
          </div>
        </div>

        <div style={{ maxWidth: '60%' }}>
          <div className="config-section">
            <h2 style={{ 
              fontSize: '22px', 
              fontWeight: 600, 
              color: 'var(--neutral-700)',
              marginBottom: '24px'
            }}>
              Preferências regionais
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
                  Idioma
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: 'var(--neutral-200)',
                    fontSize: '16px',
                    color: 'var(--ink-800)',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.backgroundColor = 'white'}
                  onBlur={(e) => e.target.style.backgroundColor = 'var(--neutral-200)'}
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (United States)</option>
                  <option value="es-ES">Español (España)</option>
                  <option value="fr-FR">Français (France)</option>
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
                  Fuso horário
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: 'var(--neutral-200)',
                    fontSize: '16px',
                    color: 'var(--ink-800)',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.backgroundColor = 'white'}
                  onBlur={(e) => e.target.style.backgroundColor = 'var(--neutral-200)'}
                >
                  <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                  <option value="America/Manaus">Manaus (GMT-4)</option>
                  <option value="America/Rio_Branco">Rio Branco (GMT-5)</option>
                  <option value="America/Noronha">Fernando de Noronha (GMT-2)</option>
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
                  Formato de data
                </label>
                <select
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: 'var(--neutral-200)',
                    fontSize: '16px',
                    color: 'var(--ink-800)',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.backgroundColor = 'white'}
                  onBlur={(e) => e.target.style.backgroundColor = 'var(--neutral-200)'}
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2024)</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2024)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (2024-12-31)</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '32px' }}>
            <button
              onClick={handleSave}
              disabled={isSaving}
              style={{
                padding: '12px 32px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: 'var(--green-900)',
                color: 'white',
                fontSize: '16px',
                fontWeight: 600,
                cursor: isSaving ? 'not-allowed' : 'pointer',
                opacity: isSaving ? 0.5 : 1,
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => !isSaving && (e.currentTarget.style.backgroundColor = 'var(--green-950)')}
              onMouseLeave={e => !isSaving && (e.currentTarget.style.backgroundColor = 'var(--green-900)')}
            >
              {isSaving ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
