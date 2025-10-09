'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import Sidebar from '@/components/Sidebar'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

interface NotificationSettings {
  push_enabled: boolean
  email_enabled: boolean
  new_events: boolean
  event_reminders: boolean
  club_updates: boolean
  teacher_messages: boolean
  sports_recommendations: boolean
}

export default function NotificacoesPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState<NotificationSettings>({
    push_enabled: true,
    email_enabled: true,
    new_events: true,
    event_reminders: true,
    club_updates: true,
    teacher_messages: true,
    sports_recommendations: false
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

    const { data, error } = await supabase
      .from('user_settings')
      .select('notification_settings')
      .eq('user_id', user.id)
      .single()

    if (data?.notification_settings) {
      setSettings(data.notification_settings)
    }
  }

  const handleToggle = (key: keyof NotificationSettings) => {
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
          notification_settings: settings,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      toast.success('Configurações de notificação salvas!')
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
        {/* Header */}
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
              Notificações
            </h1>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: '60%' }}>
          {/* Canais de Notificação */}
          <div className="config-section">
            <h2 style={{ 
              fontSize: '22px', 
              fontWeight: 600, 
              color: 'var(--neutral-700)',
              marginBottom: '24px'
            }}>
              Canais de notificação
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <ToggleItem
                label="Notificações push"
                description="Receba notificações no aplicativo"
                checked={settings.push_enabled}
                onChange={() => handleToggle('push_enabled')}
              />
              <ToggleItem
                label="Notificações por e-mail"
                description="Receba notificações no seu e-mail"
                checked={settings.email_enabled}
                onChange={() => handleToggle('email_enabled')}
              />
            </div>
          </div>

          {/* Tipos de Notificação */}
          <div className="config-section">
            <h2 style={{ 
              fontSize: '22px', 
              fontWeight: 600, 
              color: 'var(--neutral-700)',
              marginBottom: '24px'
            }}>
              Tipos de notificação
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <ToggleItem
                label="Novos eventos"
                description="Notificações sobre novos eventos nos seus esportes"
                checked={settings.new_events}
                onChange={() => handleToggle('new_events')}
              />
              <ToggleItem
                label="Lembretes de eventos"
                description="Receba lembretes antes dos eventos"
                checked={settings.event_reminders}
                onChange={() => handleToggle('event_reminders')}
              />
              <ToggleItem
                label="Atualizações de clubes"
                description="Novidades dos clubes que você segue"
                checked={settings.club_updates}
                onChange={() => handleToggle('club_updates')}
              />
              <ToggleItem
                label="Mensagens de professores"
                description="Mensagens e atualizações dos seus professores"
                checked={settings.teacher_messages}
                onChange={() => handleToggle('teacher_messages')}
              />
              <ToggleItem
                label="Recomendações de esportes"
                description="Sugestões de novos esportes baseadas no seu perfil"
                checked={settings.sports_recommendations}
                onChange={() => handleToggle('sports_recommendations')}
              />
            </div>
          </div>

          {/* Botão Salvar */}
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

interface ToggleItemProps {
  label: string
  description: string
  checked: boolean
  onChange: () => void
}

function ToggleItem({ label, description, checked, onChange }: ToggleItemProps) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px',
      backgroundColor: 'var(--neutral-100)',
      borderRadius: '12px'
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--ink-800)', marginBottom: '4px' }}>
          {label}
        </div>
        <div style={{ fontSize: '14px', color: 'var(--ink-600)' }}>
          {description}
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
    </div>
  )
}
