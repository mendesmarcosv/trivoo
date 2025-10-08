'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Button from '@/components/Button'
import Avatar from '@/components/Avatar'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

export default function EditProfilePage() {
  const router = useRouter()
  const { user, userProfile, loading, fetchUserProfile } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
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
        .eq('id', user?.id)

      if (error) throw error

      await fetchUserProfile()
      toast.success('Perfil atualizado com sucesso!')
      router.push('/profile')
    } catch (error) {
      console.error('Erro ao salvar perfil:', error)
      toast.error('Erro ao salvar alterações')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDiscard = () => {
    setFormData(originalData)
    router.push('/profile')
  }

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData)

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
                Última edição em {new Date(userProfile?.updated_at || user?.updated_at || Date.now()).toLocaleDateString('pt-BR')}
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button
                onClick={handleDiscard}
                className="bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50"
                disabled={isSaving}
              >
                Descartar
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className="bg-green-900 hover:bg-green-950"
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
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '24px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--neutral-200)' }}>
              <Avatar 
                name={formData.name}
                email={user?.email}
                size="xl"
                avatarUrl={userProfile?.avatar_url}
              />
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <Button className="bg-green-700 hover:bg-green-800">
                  Alterar foto
                </Button>
                <Button className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100">
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
            
            <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--neutral-200)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ink-700)', fontSize: '14px', fontWeight: 500 }}>
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
                      border: '1px solid var(--neutral-300)',
                      backgroundColor: 'white',
                      fontSize: '16px',
                      color: 'var(--ink-800)',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--green-700)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--neutral-300)'}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ink-700)', fontSize: '14px', fontWeight: 500 }}>
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
                      border: '1px solid var(--neutral-300)',
                      backgroundColor: 'var(--neutral-100)',
                      fontSize: '16px',
                      color: 'var(--ink-600)',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ink-700)', fontSize: '14px', fontWeight: 500 }}>
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(00) 00000-0000"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid var(--neutral-300)',
                      backgroundColor: 'white',
                      fontSize: '16px',
                      color: 'var(--ink-800)',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--green-700)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--neutral-300)'}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ink-700)', fontSize: '14px', fontWeight: 500 }}>
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
                      border: '1px solid var(--neutral-300)',
                      backgroundColor: 'white',
                      fontSize: '16px',
                      color: 'var(--ink-800)',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--green-700)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--neutral-300)'}
                  />
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ink-700)', fontSize: '14px', fontWeight: 500 }}>
                  Biografia
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Conte um pouco sobre você..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--neutral-300)',
                    backgroundColor: 'white',
                    fontSize: '16px',
                    color: 'var(--ink-800)',
                    resize: 'vertical',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--green-700)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--neutral-300)'}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
