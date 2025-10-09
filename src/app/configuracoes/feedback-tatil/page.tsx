'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import Sidebar from '@/components/Sidebar'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

export default function FeedbackTatilPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [hapticEnabled, setHapticEnabled] = useState(true)
  const [hapticIntensity, setHapticIntensity] = useState(50)
  const [buttonVibration, setButtonVibration] = useState(true)
  const [successVibration, setSuccessVibration] = useState(true)
  const [errorVibration, setErrorVibration] = useState(true)

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
      .select('haptic_settings')
      .eq('user_id', user.id)
      .single()

    if (data?.haptic_settings) {
      setHapticEnabled(data.haptic_settings.enabled ?? true)
      setHapticIntensity(data.haptic_settings.intensity ?? 50)
      setButtonVibration(data.haptic_settings.button_vibration ?? true)
      setSuccessVibration(data.haptic_settings.success_vibration ?? true)
      setErrorVibration(data.haptic_settings.error_vibration ?? true)
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
          haptic_settings: {
            enabled: hapticEnabled,
            intensity: hapticIntensity,
            button_vibration: buttonVibration,
            success_vibration: successVibration,
            error_vibration: errorVibration
          },
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      toast.success('Configurações de feedback tátil salvas!')
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
              Feedback tátil
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
              Configurações de vibração
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
                    Ativar feedback tátil
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--ink-600)' }}>
                    Vibrações ao interagir com o aplicativo
                  </div>
                </div>
                
                <button
                  onClick={() => setHapticEnabled(!hapticEnabled)}
                  style={{
                    width: '48px',
                    height: '28px',
                    borderRadius: '14px',
                    border: 'none',
                    backgroundColor: hapticEnabled ? 'var(--green-700)' : 'var(--neutral-300)',
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
                    left: hapticEnabled ? '24px' : '4px',
                    transition: 'left 0.2s'
                  }} />
                </button>
              </div>

              <div style={{ 
                opacity: hapticEnabled ? 1 : 0.5,
                pointerEvents: hapticEnabled ? 'auto' : 'none'
              }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'var(--ink-700)', 
                  fontSize: '14px',
                  fontWeight: 500
                }}>
                  Intensidade: {hapticIntensity}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={hapticIntensity}
                  onChange={(e) => setHapticIntensity(parseInt(e.target.value))}
                  disabled={!hapticEnabled}
                  style={{
                    width: '100%',
                    cursor: hapticEnabled ? 'pointer' : 'not-allowed'
                  }}
                />
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginTop: '8px',
                  fontSize: '12px',
                  color: 'var(--ink-600)'
                }}>
                  <span>Leve</span>
                  <span>Forte</span>
                </div>
              </div>

              <div style={{ 
                opacity: hapticEnabled ? 1 : 0.5,
                pointerEvents: hapticEnabled ? 'auto' : 'none'
              }}>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: 500, 
                  color: 'var(--ink-700)',
                  marginBottom: '12px',
                  marginTop: '8px'
                }}>
                  Eventos de vibração
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <ToggleItem
                    label="Toque em botões"
                    checked={buttonVibration}
                    onChange={() => setButtonVibration(!buttonVibration)}
                  />
                  <ToggleItem
                    label="Ações bem-sucedidas"
                    checked={successVibration}
                    onChange={() => setSuccessVibration(!successVibration)}
                  />
                  <ToggleItem
                    label="Erros e avisos"
                    checked={errorVibration}
                    onChange={() => setErrorVibration(!errorVibration)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '32px' }}>
            <button
              onClick={handleSave}
              disabled={isSaving}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'var(--green-700)',
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                cursor: isSaving ? 'not-allowed' : 'pointer',
                opacity: isSaving ? 0.5 : 1,
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => !isSaving && (e.currentTarget.style.backgroundColor = 'var(--green-800)')}
              onMouseLeave={e => !isSaving && (e.currentTarget.style.backgroundColor = 'var(--green-700)')}
            >
              {isSaving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

interface ToggleItemProps {
  label: string
  checked: boolean
  onChange: () => void
}

function ToggleItem({ label, checked, onChange }: ToggleItemProps) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 16px',
      backgroundColor: 'var(--neutral-50)',
      borderRadius: '8px'
    }}>
      <span style={{ fontSize: '14px', color: 'var(--ink-700)' }}>
        {label}
      </span>
      
      <button
        onClick={onChange}
        style={{
          width: '42px',
          height: '24px',
          borderRadius: '12px',
          border: 'none',
          backgroundColor: checked ? 'var(--green-700)' : 'var(--neutral-300)',
          position: 'relative',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
      >
        <div style={{
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          backgroundColor: 'white',
          position: 'absolute',
          top: '4px',
          left: checked ? '22px' : '4px',
          transition: 'left 0.2s'
        }} />
      </button>
    </div>
  )
}
