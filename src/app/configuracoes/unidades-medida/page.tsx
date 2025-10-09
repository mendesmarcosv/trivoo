'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import Sidebar from '@/components/Sidebar'
import PrimaryButton from '@/components/PrimaryButton'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

export default function UnidadesMedidaPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'mi'>('km')
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg')
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm')

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
      .select('unit_preferences')
      .eq('user_id', user.id)
      .single()

    if (data?.unit_preferences) {
      setDistanceUnit(data.unit_preferences.distance || 'km')
      setWeightUnit(data.unit_preferences.weight || 'kg')
      setHeightUnit(data.unit_preferences.height || 'cm')
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
          unit_preferences: {
            distance: distanceUnit,
            weight: weightUnit,
            height: heightUnit
          },
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      toast.success('Unidades de medida atualizadas!')
    } catch (error) {
      console.error('Erro ao salvar:', error)
      toast.error('Erro ao salvar unidades')
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
              Unidades de medida
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
              Preferências de unidades
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '12px', 
                  color: 'var(--ink-700)', 
                  fontSize: '14px',
                  fontWeight: 500
                }}>
                  Distância
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setDistanceUnit('km')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: distanceUnit === 'km' ? 'var(--green-700)' : 'var(--neutral-200)',
                      color: distanceUnit === 'km' ? 'white' : 'var(--ink-700)',
                      fontSize: '16px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Quilômetros (km)
                  </button>
                  <button
                    onClick={() => setDistanceUnit('mi')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: distanceUnit === 'mi' ? 'var(--green-700)' : 'var(--neutral-200)',
                      color: distanceUnit === 'mi' ? 'white' : 'var(--ink-700)',
                      fontSize: '16px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Milhas (mi)
                  </button>
                </div>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '12px', 
                  color: 'var(--ink-700)', 
                  fontSize: '14px',
                  fontWeight: 500
                }}>
                  Peso
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setWeightUnit('kg')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: weightUnit === 'kg' ? 'var(--green-700)' : 'var(--neutral-200)',
                      color: weightUnit === 'kg' ? 'white' : 'var(--ink-700)',
                      fontSize: '16px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Quilogramas (kg)
                  </button>
                  <button
                    onClick={() => setWeightUnit('lb')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: weightUnit === 'lb' ? 'var(--green-700)' : 'var(--neutral-200)',
                      color: weightUnit === 'lb' ? 'white' : 'var(--ink-700)',
                      fontSize: '16px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Libras (lb)
                  </button>
                </div>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '12px', 
                  color: 'var(--ink-700)', 
                  fontSize: '14px',
                  fontWeight: 500
                }}>
                  Altura
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setHeightUnit('cm')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: heightUnit === 'cm' ? 'var(--green-700)' : 'var(--neutral-200)',
                      color: heightUnit === 'cm' ? 'white' : 'var(--ink-700)',
                      fontSize: '16px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Centímetros (cm)
                  </button>
                  <button
                    onClick={() => setHeightUnit('ft')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: heightUnit === 'ft' ? 'var(--green-700)' : 'var(--neutral-200)',
                      color: heightUnit === 'ft' ? 'white' : 'var(--ink-700)',
                      fontSize: '16px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Pés/Polegadas (ft)
                  </button>
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
