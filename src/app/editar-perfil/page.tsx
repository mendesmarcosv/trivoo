'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import Sidebar from '@/components/Sidebar'
import Button from '@/components/Button'
import Avatar from '@/components/Avatar'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

export default function EditarPerfilPage() {
  const router = useRouter()
  const { user, userProfile, loading, fetchUserProfile } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: ''
  })

  const [originalData, setOriginalData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: ''
  })

  // Máscara para telefone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value)
    handleInputChange('phone', formatted)
  }

  // Carregar dados do usuário
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && userProfile) {
      const data = {
        name: userProfile.name || user.user_metadata?.name || '',
        email: user.email || '',
        phone: userProfile.phone || user.user_metadata?.phone || '',
        bio: userProfile.bio || '',
        location: userProfile.location || 'Niterói'
      }
      
      setFormData(data)
      setOriginalData(data)
    }
  }, [user, userProfile])

  // Verificar mudanças
  useEffect(() => {
    const hasChanged = JSON.stringify(formData) !== JSON.stringify(originalData)
    setHasChanges(hasChanged)
  }, [formData, originalData])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    if (!user?.id) return

    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          phone: formData.phone,
          bio: formData.bio,
          location: formData.location,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      // Atualizar perfil no contexto
      await fetchUserProfile()
      
      // Atualizar dados originais
      setOriginalData(formData)
      setHasChanges(false)

      toast.success('Perfil atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar perfil:', error)
      toast.error('Erro ao salvar alterações')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDiscard = () => {
    setFormData(originalData)
    setHasChanges(false)
    toast.success('Alterações descartadas')
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '30px', fontWeight: 600, color: 'var(--ink-800)', marginBottom: '8px' }}>
                Editar perfil
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--ink-600)' }}>
                Última edição em {new Date(userProfile?.updated_at || user.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button
                onClick={handleDiscard}
                disabled={!hasChanges}
                className="bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Descartar
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className="bg-green-900 hover:bg-green-950 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: '60%' }}>
          {/* Profile Picture Section */}
          <div className="config-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <i className="ph ph-user" style={{ fontSize: '24px', color: 'var(--green-700)' }}></i>
              <h2 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--neutral-700)' }}>
                Foto do perfil
              </h2>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <Avatar 
                name={formData.name}
                email={user?.email}
                size="xl"
              />
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <Button className="bg-green-900 hover:bg-green-950">
                  Alterar foto
                </Button>
                <Button className="bg-red-50 border border-red-200 text-red-600 hover:bg-red-100">
                  Excluir foto
                </Button>
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="config-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <i className="ph ph-user-circle" style={{ fontSize: '24px', color: 'var(--green-700)' }}></i>
              <h2 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--neutral-700)' }}>
                Informações pessoais
              </h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'var(--ink-700)', 
                  fontSize: '14px',
                  fontWeight: 500
                }}>
                  Nome completo
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: 'var(--neutral-50)',
                    fontSize: '16px',
                    color: 'var(--ink-800)',
                    transition: 'background-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.backgroundColor = 'white'}
                  onBlur={(e) => e.target.style.backgroundColor = 'var(--neutral-50)'}
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
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: 'var(--neutral-200)',
                    fontSize: '16px',
                    color: 'var(--ink-500)',
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
                  Telefone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: 'var(--neutral-50)',
                    fontSize: '16px',
                    color: 'var(--ink-800)',
                    transition: 'background-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.backgroundColor = 'white'}
                  onBlur={(e) => e.target.style.backgroundColor = 'var(--neutral-50)'}
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
                  Localização
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: 'var(--neutral-50)',
                    fontSize: '16px',
                    color: 'var(--ink-800)',
                    transition: 'background-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.backgroundColor = 'white'}
                  onBlur={(e) => e.target.style.backgroundColor = 'var(--neutral-50)'}
                />
              </div>
            </div>

            {/* Bio - Full Width */}
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ 
                  color: 'var(--ink-700)', 
                  fontSize: '14px',
                  fontWeight: 500
                }}>
                  Biografia
                </label>
                <span style={{ 
                  color: 'var(--ink-600)', 
                  fontSize: '12px'
                }}>
                  {formData.bio.length}/500
                </span>
              </div>
              <textarea
                value={formData.bio}
                onChange={(e) => {
                  if (e.target.value.length <= 500) {
                    handleInputChange('bio', e.target.value)
                  }
                }}
                placeholder="Conte um pouco sobre você..."
                rows={4}
                maxLength={500}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: 'var(--neutral-50)',
                  fontSize: '16px',
                  color: 'var(--ink-800)',
                  resize: 'vertical',
                  transition: 'background-color 0.2s'
                }}
                onFocus={(e) => e.target.style.backgroundColor = 'white'}
                onBlur={(e) => e.target.style.backgroundColor = 'var(--neutral-50)'}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
