'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import Sidebar from '@/components/Sidebar'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

export default function CoresTextoPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [fontSize, setFontSize] = useState(100)
  const [boldText, setBoldText] = useState(false)
  const [reduceTransparency, setReduceTransparency] = useState(false)
  const [colorBlindMode, setColorBlindMode] = useState<'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'>('none')

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
      .select('display_settings')
      .eq('user_id', user.id)
      .single()

    if (data?.display_settings) {
      setHighContrast(data.display_settings.high_contrast ?? false)
      setFontSize(data.display_settings.font_size ?? 100)
      setBoldText(data.display_settings.bold_text ?? false)
      setReduceTransparency(data.display_settings.reduce_transparency ?? false)
      setColorBlindMode(data.display_settings.color_blind_mode ?? 'none')
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
          display_settings: {
            high_contrast: highContrast,
            font_size: fontSize,
            bold_text: boldText,
            reduce_transparency: reduceTransparency,
            color_blind_mode: colorBlindMode
          },
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      toast.success('Configurações de exibição salvas!')
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
              Cores e texto
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
              Configurações de exibição
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                backgroundColor: 'var(--neutral-100)',
                borderRadius: '12px'
              }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--ink-800)', marginBottom: '4px' }}>
                    Alto contraste
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--ink-600)' }}>
                    Aumenta o contraste entre cores para melhor visibilidade
                  </div>
                </div>
                
                <ToggleSwitch checked={highContrast} onChange={() => setHighContrast(!highContrast)} />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'var(--ink-700)', 
                  fontSize: '14px',
                  fontWeight: 500
                }}>
                  Tamanho da fonte: {fontSize}%
                </label>
                <input
                  type="range"
                  min="75"
                  max="150"
                  step="5"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    cursor: 'pointer'
                  }}
                />
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginTop: '8px',
                  fontSize: '12px',
                  color: 'var(--ink-600)'
                }}>
                  <span>Pequeno (75%)</span>
                  <span>Padrão (100%)</span>
                  <span>Grande (150%)</span>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                backgroundColor: 'var(--neutral-100)',
                borderRadius: '12px'
              }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--ink-800)', marginBottom: '4px' }}>
                    Texto em negrito
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--ink-600)' }}>
                    Torna todo o texto mais espesso e legível
                  </div>
                </div>
                
                <ToggleSwitch checked={boldText} onChange={() => setBoldText(!boldText)} />
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                backgroundColor: 'var(--neutral-100)',
                borderRadius: '12px'
              }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--ink-800)', marginBottom: '4px' }}>
                    Reduzir transparência
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--ink-600)' }}>
                    Remove efeitos de transparência e desfoque
                  </div>
                </div>
                
                <ToggleSwitch checked={reduceTransparency} onChange={() => setReduceTransparency(!reduceTransparency)} />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '12px', 
                  color: 'var(--ink-700)', 
                  fontSize: '14px',
                  fontWeight: 500
                }}>
                  Modo para daltonismo
                </label>
                <select
                  value={colorBlindMode}
                  onChange={(e) => setColorBlindMode(e.target.value as any)}
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
                  <option value="none">Nenhum</option>
                  <option value="protanopia">Protanopia (vermelho-verde)</option>
                  <option value="deuteranopia">Deuteranopia (verde-vermelho)</option>
                  <option value="tritanopia">Tritanopia (azul-amarelo)</option>
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
