'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import Sidebar from '@/components/Sidebar'
import PrimaryButton from '@/components/PrimaryButton'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

export default function RecursosAcessibilidadePage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState({
    wheelchair_access: false,
    sign_language: false,
    audio_description: false,
    adapted_equipment: false,
    accessible_parking: false,
    accessible_restroom: false
  })

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
      .select('accessibility_preferences')
      .eq('user_id', user.id)
      .single()

    if (data?.accessibility_preferences) {
      setSettings(data.accessibility_preferences)
    }
  }

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSave = async () => {
    if (!user?.id) return

    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          accessibility_preferences: settings,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      toast.success('Preferências de acessibilidade salvas!')
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
              Recursos de acessibilidade
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
              Recursos que desejo
            </h2>
            
            <p style={{ 
              fontSize: '14px', 
              color: 'var(--ink-600)', 
              marginBottom: '24px',
              lineHeight: 1.5
            }}>
              Selecione os recursos de acessibilidade que você deseja encontrar nos clubes e eventos. 
              Isso nos ajudará a recomendar locais adequados às suas necessidades.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <ToggleItem
                icon="ph-wheelchair"
                label="Acesso para cadeirantes"
                description="Rampas, elevadores e espaços adaptados"
                checked={settings.wheelchair_access}
                onChange={() => handleToggle('wheelchair_access')}
              />
              <ToggleItem
                icon="ph-hand-waving"
                label="Intérprete de Libras"
                description="Disponibilidade de intérprete de língua de sinais"
                checked={settings.sign_language}
                onChange={() => handleToggle('sign_language')}
              />
              <ToggleItem
                icon="ph-ear"
                label="Audiodescrição"
                description="Descrição de eventos e atividades por áudio"
                checked={settings.audio_description}
                onChange={() => handleToggle('audio_description')}
              />
              <ToggleItem
                icon="ph-barbell"
                label="Equipamentos adaptados"
                description="Equipamentos esportivos adaptados para diferentes necessidades"
                checked={settings.adapted_equipment}
                onChange={() => handleToggle('adapted_equipment')}
              />
              <ToggleItem
                icon="ph-car"
                label="Estacionamento acessível"
                description="Vagas reservadas para pessoas com deficiência"
                checked={settings.accessible_parking}
                onChange={() => handleToggle('accessible_parking')}
              />
              <ToggleItem
                icon="ph-toilet"
                label="Banheiro acessível"
                description="Banheiros adaptados e com espaço adequado"
                checked={settings.accessible_restroom}
                onChange={() => handleToggle('accessible_restroom')}
              />
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

interface ToggleItemProps {
  icon: string
  label: string
  description: string
  checked: boolean
  onChange: () => void
}

function ToggleItem({ icon, label, description, checked, onChange }: ToggleItemProps) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px',
      backgroundColor: 'var(--neutral-100)',
      borderRadius: '12px'
    }}>
      <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
        <i className={`ph ${icon}`} style={{ fontSize: '24px', color: 'var(--green-700)' }}></i>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--ink-800)', marginBottom: '4px' }}>
            {label}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--ink-600)' }}>
            {description}
          </div>
        </div>
      </div>
      
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
          transition: 'background-color 0.2s',
          flexShrink: 0,
          marginLeft: '16px'
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
    </div>
  )
}
