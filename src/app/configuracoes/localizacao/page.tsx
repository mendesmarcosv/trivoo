'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import Sidebar from '@/components/Sidebar'
import PrimaryButton from '@/components/PrimaryButton'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

export default function LocalizacaoPage() {
  const router = useRouter()
  const { user, userProfile, loading, fetchUserProfile } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [locationEnabled, setLocationEnabled] = useState(true)
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [radius, setRadius] = useState(10)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (userProfile) {
      setCity(userProfile.location || 'Niterói')
      setState('Rio de Janeiro')
    }
  }, [userProfile])

  const handleSave = async () => {
    if (!user?.id) return

    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          location: city,
          location_enabled: locationEnabled,
          search_radius: radius,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      await fetchUserProfile()
      toast.success('Localização atualizada!')
    } catch (error) {
      console.error('Erro ao salvar:', error)
      toast.error('Erro ao salvar localização')
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
              Localização
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
              Configurações de localização
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
                    Permitir localização
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--ink-600)' }}>
                    Use sua localização para encontrar eventos e clubes próximos
                  </div>
                </div>
                
                <button
                  onClick={() => setLocationEnabled(!locationEnabled)}
                  style={{
                    width: '48px',
                    height: '28px',
                    borderRadius: '14px',
                    border: 'none',
                    backgroundColor: locationEnabled ? 'var(--green-700)' : 'var(--neutral-300)',
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
                    left: locationEnabled ? '24px' : '4px',
                    transition: 'left 0.2s'
                  }} />
                </button>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'var(--ink-700)', 
                  fontSize: '14px',
                  fontWeight: 500
                }}>
                  Cidade
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={!locationEnabled}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: locationEnabled ? 'var(--neutral-200)' : 'var(--neutral-300)',
                    fontSize: '16px',
                    color: locationEnabled ? 'var(--ink-800)' : 'var(--ink-600)',
                    cursor: locationEnabled ? 'text' : 'not-allowed',
                    transition: 'background-color 0.2s'
                  }}
                  onFocus={(e) => locationEnabled && (e.target.style.backgroundColor = 'white')}
                  onBlur={(e) => locationEnabled && (e.target.style.backgroundColor = 'var(--neutral-200)')}
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
                  Estado
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  disabled={!locationEnabled}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: locationEnabled ? 'var(--neutral-200)' : 'var(--neutral-300)',
                    fontSize: '16px',
                    color: locationEnabled ? 'var(--ink-800)' : 'var(--ink-600)',
                    cursor: locationEnabled ? 'text' : 'not-allowed',
                    transition: 'background-color 0.2s'
                  }}
                  onFocus={(e) => locationEnabled && (e.target.style.backgroundColor = 'white')}
                  onBlur={(e) => locationEnabled && (e.target.style.backgroundColor = 'var(--neutral-200)')}
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
                  Raio de busca: {radius} km
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={radius}
                  onChange={(e) => setRadius(parseInt(e.target.value))}
                  disabled={!locationEnabled}
                  style={{
                    width: '100%',
                    cursor: locationEnabled ? 'pointer' : 'not-allowed',
                    opacity: locationEnabled ? 1 : 0.5
                  }}
                />
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginTop: '8px',
                  fontSize: '12px',
                  color: 'var(--ink-600)'
                }}>
                  <span>1 km</span>
                  <span>50 km</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '32px' }}>
            <PrimaryButton onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar'}
            </PrimaryButton>
          </div>
        </div>
      </main>
    </div>
  )
}
