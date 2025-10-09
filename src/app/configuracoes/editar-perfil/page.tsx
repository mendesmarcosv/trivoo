'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import Sidebar from '@/components/Sidebar'
import PrimaryButton from '@/components/PrimaryButton'
import SecondaryButton from '@/components/SecondaryButton'
import Avatar from '@/components/Avatar'
import ImageCropModal from '@/components/ImageCropModal'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

export default function EditarPerfilPage() {
  const router = useRouter()
  const { user, userProfile, loading, fetchUserProfile } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [showCropModal, setShowCropModal] = useState(false)
  const [selectedImageSrc, setSelectedImageSrc] = useState('')
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
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

  // Função para selecionar arquivo de imagem
  const handleSelectImage = () => {
    fileInputRef.current?.click()
  }

  // Função para lidar com a seleção de arquivo
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast.error('Por favor, selecione apenas arquivos de imagem (JPG, PNG, WebP)')
      return
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB')
      return
    }

    // Criar URL para preview
    const reader = new FileReader()
    reader.onload = (e) => {
      const src = e.target?.result as string
      setSelectedImageSrc(src)
      setShowCropModal(true)
    }
    reader.readAsDataURL(file)
  }

  // Função para lidar com o crop completo
  const handleCropComplete = async (croppedImageBlob: Blob) => {
    if (!user?.id) return

    setIsUploadingImage(true)
    try {
      // Criar nome único para o arquivo
      const fileExt = 'jpg'
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      
      // Upload para Supabase Storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, croppedImageBlob, {
          contentType: 'image/jpeg',
          upsert: true
        })

      if (error) throw error

      // Obter URL pública da imagem
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      // Atualizar perfil com nova URL da imagem
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (updateError) throw updateError

      // Atualizar perfil no contexto
      await fetchUserProfile()
      
      // Forçar atualização do estado local
      setFormData(prev => ({ ...prev }))
      
      console.log('Avatar atualizado:', publicUrl)
      toast.success('Foto atualizada com sucesso!')
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error)
      toast.error('Erro ao fazer upload da imagem')
    } finally {
      setIsUploadingImage(false)
    }
  }

  // Função para excluir foto
  const handleDeleteImage = async () => {
    if (!user?.id) return

    setIsUploadingImage(true)
    try {
      // Remover URL da imagem do perfil
      const { error } = await supabase
        .from('profiles')
        .update({
          avatar_url: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      // Atualizar perfil no contexto
      await fetchUserProfile()
      
      toast.success('Foto removida com sucesso!')
    } catch (error) {
      console.error('Erro ao remover imagem:', error)
      toast.error('Erro ao remover imagem')
    } finally {
      setIsUploadingImage(false)
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
              <div>
                <h1 style={{ fontSize: '30px', fontWeight: 600, color: 'var(--ink-800)', marginBottom: '8px' }}>
                  Editar perfil
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--ink-600)' }}>
                  Última edição em {new Date(userProfile?.updated_at || user.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <SecondaryButton onClick={handleDiscard} disabled={!hasChanges}>
                Descartar
              </SecondaryButton>
              <PrimaryButton onClick={handleSave} disabled={!hasChanges || isSaving}>
                {isSaving ? 'Salvando...' : 'Salvar'}
              </PrimaryButton>
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
                avatarUrl={userProfile?.avatar_url}
              />
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleSelectImage}
                  disabled={isUploadingImage}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'var(--neutral-200)',
                    color: 'var(--ink-700)',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: isUploadingImage ? 'not-allowed' : 'pointer',
                    opacity: isUploadingImage ? 0.5 : 1,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => !isUploadingImage && (e.currentTarget.style.backgroundColor = 'var(--neutral-300)')}
                  onMouseLeave={e => !isUploadingImage && (e.currentTarget.style.backgroundColor = 'var(--neutral-200)')}
                >
                  <i className="ph ph-camera" style={{ fontSize: '16px' }}></i>
                  {isUploadingImage ? 'Enviando...' : 'Alterar'}
                </button>
                <button
                  onClick={handleDeleteImage}
                  disabled={isUploadingImage || !userProfile?.avatar_url}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'var(--neutral-200)',
                    color: 'var(--ink-700)',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: (isUploadingImage || !userProfile?.avatar_url) ? 'not-allowed' : 'pointer',
                    opacity: (isUploadingImage || !userProfile?.avatar_url) ? 0.5 : 1,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => !isUploadingImage && userProfile?.avatar_url && (e.currentTarget.style.backgroundColor = 'var(--neutral-300)')}
                  onMouseLeave={e => !isUploadingImage && userProfile?.avatar_url && (e.currentTarget.style.backgroundColor = 'var(--neutral-200)')}
                >
                  <i className="ph ph-trash" style={{ fontSize: '16px' }}></i>
                  Excluir
                </button>
              </div>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
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
                    backgroundColor: 'var(--neutral-300)',
                    fontSize: '16px',
                    color: 'var(--ink-600)',
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
                    backgroundColor: 'var(--neutral-200)',
                    fontSize: '16px',
                    color: 'var(--ink-800)',
                    transition: 'background-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.backgroundColor = 'white'}
                  onBlur={(e) => e.target.style.backgroundColor = 'var(--neutral-200)'}
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
      </main>

      {/* Image Crop Modal */}
      <ImageCropModal
        isOpen={showCropModal}
        onClose={() => setShowCropModal(false)}
        onCropComplete={handleCropComplete}
        imageSrc={selectedImageSrc}
      />
    </div>
  )
}
