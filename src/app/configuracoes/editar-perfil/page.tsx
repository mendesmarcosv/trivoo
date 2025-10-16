'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import Sidebar from '@/components/Sidebar'
import PrimaryButton from '@/components/PrimaryButton'
import SecondaryButton from '@/components/SecondaryButton'
import Avatar from '@/components/Avatar'
import ImageCropModal from '@/components/ImageCropModal'
import SelectableTag from '@/components/SelectableTag'
import Loading from '@/components/Loading'
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
  const [allDisabilityConditions, setAllDisabilityConditions] = useState<Array<{id: number, label_pt: string}>>([])
  const [userDisabilityConditions, setUserDisabilityConditions] = useState<number[]>([])
  const [originalDisabilityConditions, setOriginalDisabilityConditions] = useState<number[]>([])
  
  // Recursos de locais
  const [allLocationResources, setAllLocationResources] = useState<Array<{id: number, label_pt: string}>>([])
  const [selectedLocationResources, setSelectedLocationResources] = useState<number[]>([])
  const [originalLocationResources, setOriginalLocationResources] = useState<number[]>([])
  
  // Ofertas de professores
  const [allCoachOfferings, setAllCoachOfferings] = useState<Array<{id: number, label_pt: string}>>([])
  const [selectedCoachOfferings, setSelectedCoachOfferings] = useState<number[]>([])
  const [originalCoachOfferings, setOriginalCoachOfferings] = useState<number[]>([])
  
  // Esportes de interesse
  const [allSportsInterest, setAllSportsInterest] = useState<Array<{id: number, name: string}>>([])
  const [selectedSportsInterest, setSelectedSportsInterest] = useState<number[]>([])
  const [originalSportsInterest, setOriginalSportsInterest] = useState<number[]>([])
  
  // Esportes praticados anteriormente
  const [allSportsPracticed, setAllSportsPracticed] = useState<Array<{id: number, label_pt: string}>>([])
  const [selectedSportsPracticed, setSelectedSportsPracticed] = useState<number[]>([])
  const [originalSportsPracticed, setOriginalSportsPracticed] = useState<number[]>([])
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    birthDate: '',
    fitnessLevel: '',
    location: '',
    hasDisability: false,
    accessibilityModeEnabled: false
  })

  const [originalData, setOriginalData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    birthDate: '',
    fitnessLevel: '',
    location: '',
    hasDisability: false,
    accessibilityModeEnabled: false
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
      const timer = setTimeout(() => {
        router.push('/auth/login')
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [user, loading, router])

  // Buscar condições de deficiência
  useEffect(() => {
    const fetchDisabilityConditions = async () => {
      const { data } = await supabase
        .from('disability_conditions')
        .select('id, label_pt')
        .eq('active', true)
        .order('sort_order')
      
      if (data) {
        setAllDisabilityConditions(data)
      }
    }

    fetchDisabilityConditions()
  }, [])

  // Buscar condições selecionadas pelo usuário
  useEffect(() => {
    const fetchUserConditions = async () => {
      if (!user?.id) return

      const { data } = await supabase
        .from('user_disability_conditions')
        .select('condition_id')
        .eq('user_id', user.id)
      
      if (data) {
        const conditions = data.map(item => item.condition_id)
        setUserDisabilityConditions(conditions)
        setOriginalDisabilityConditions(conditions)
      } else {
        setUserDisabilityConditions([])
        setOriginalDisabilityConditions([])
      }
    }

    if (formData.hasDisability) {
      fetchUserConditions()
    } else {
      setUserDisabilityConditions([])
      setOriginalDisabilityConditions([])
    }
  }, [user?.id, formData.hasDisability])

  // Buscar recursos de locais disponíveis
  useEffect(() => {
    const fetchLocationResources = async () => {
      const { data } = await supabase
        .from('accessibility_location_resources')
        .select('id, label_pt')
        .eq('active', true)
        .order('sort_order')
      
      if (data) {
        setAllLocationResources(data)
      }
    }

    fetchLocationResources()
  }, [])

  // Buscar recursos de locais selecionados pelo usuário
  useEffect(() => {
    const fetchUserLocationResources = async () => {
      if (!user?.id) return

      const { data } = await supabase
        .from('user_desired_location_resources')
        .select('resource_id')
        .eq('user_id', user.id)
      
      if (data) {
        const resources = data.map(item => item.resource_id)
        setSelectedLocationResources(resources)
        setOriginalLocationResources(resources)
      } else {
        setSelectedLocationResources([])
        setOriginalLocationResources([])
      }
    }

    if (formData.accessibilityModeEnabled) {
      fetchUserLocationResources()
    } else {
      setSelectedLocationResources([])
      setOriginalLocationResources([])
    }
  }, [user?.id, formData.accessibilityModeEnabled])

  // Buscar ofertas de professores disponíveis
  useEffect(() => {
    const fetchCoachOfferings = async () => {
      const { data } = await supabase
        .from('coach_accessibility_offerings')
        .select('id, label_pt')
        .eq('active', true)
        .order('sort_order')
      
      if (data) {
        setAllCoachOfferings(data)
      }
    }

    fetchCoachOfferings()
  }, [])

  // Buscar ofertas de professores selecionadas pelo usuário
  useEffect(() => {
    const fetchUserCoachOfferings = async () => {
      if (!user?.id) return

      const { data } = await supabase
        .from('user_desired_coach_offerings')
        .select('offering_id')
        .eq('user_id', user.id)
      
      if (data) {
        const offerings = data.map(item => item.offering_id)
        setSelectedCoachOfferings(offerings)
        setOriginalCoachOfferings(offerings)
      } else {
        setSelectedCoachOfferings([])
        setOriginalCoachOfferings([])
      }
    }

    if (formData.accessibilityModeEnabled) {
      fetchUserCoachOfferings()
    } else {
      setSelectedCoachOfferings([])
      setOriginalCoachOfferings([])
    }
  }, [user?.id, formData.accessibilityModeEnabled])

  // Buscar esportes de interesse disponíveis
  useEffect(() => {
    const fetchSportsInterest = async () => {
      const { data } = await supabase
        .from('sports')
        .select('id, name')
        .eq('is_active', true)
        .order('name')
      
      if (data) {
        setAllSportsInterest(data)
      }
    }

    fetchSportsInterest()
  }, [])

  // Buscar esportes de interesse selecionados pelo usuário
  useEffect(() => {
    const fetchUserSportsInterest = async () => {
      if (!user?.id) return

      const { data } = await supabase
        .from('user_sports')
        .select('sport_id')
        .eq('user_id', user.id)
      
      if (data) {
        const sports = data.map(item => item.sport_id)
        setSelectedSportsInterest(sports)
        setOriginalSportsInterest(sports)
      } else {
        setSelectedSportsInterest([])
        setOriginalSportsInterest([])
      }
    }

    fetchUserSportsInterest()
  }, [user?.id])

  // Buscar esportes praticados disponíveis
  useEffect(() => {
    const fetchSportsPracticed = async () => {
      const { data } = await supabase
        .from('sports_general')
        .select('id, label_pt')
        .eq('active', true)
        .order('sort_order')
      
      if (data) {
        setAllSportsPracticed(data)
      }
    }

    fetchSportsPracticed()
  }, [])

  // Buscar esportes praticados selecionados pelo usuário
  useEffect(() => {
    const fetchUserSportsPracticed = async () => {
      if (!user?.id) return

      const { data } = await supabase
        .from('user_sports_practiced')
        .select('sport_id')
        .eq('user_id', user.id)
      
      if (data) {
        const sports = data.map(item => item.sport_id)
        setSelectedSportsPracticed(sports)
        setOriginalSportsPracticed(sports)
      } else {
        setSelectedSportsPracticed([])
        setOriginalSportsPracticed([])
      }
    }

    fetchUserSportsPracticed()
  }, [user?.id])

  useEffect(() => {
    if (user && userProfile) {
      const data = {
        name: userProfile.name || user.user_metadata?.name || '',
        email: user.email || '',
        phone: userProfile.phone || user.user_metadata?.phone || '',
        city: userProfile.city || '',
        birthDate: userProfile.birth_date || '',
        fitnessLevel: userProfile.fitness_level || '',
        location: userProfile.location || 'Niterói',
        hasDisability: userProfile.has_disability || false,
        accessibilityModeEnabled: userProfile.accessibility_mode_enabled || false
      }
      
      setFormData(data)
      setOriginalData(data)
    }
  }, [user, userProfile])

  // Verificar mudanças
  useEffect(() => {
    const formChanged = JSON.stringify(formData) !== JSON.stringify(originalData)
    const conditionsChanged = JSON.stringify(userDisabilityConditions.sort()) !== JSON.stringify(originalDisabilityConditions.sort())
    const locationResourcesChanged = JSON.stringify(selectedLocationResources.sort()) !== JSON.stringify(originalLocationResources.sort())
    const coachOfferingsChanged = JSON.stringify(selectedCoachOfferings.sort()) !== JSON.stringify(originalCoachOfferings.sort())
    const sportsInterestChanged = JSON.stringify(selectedSportsInterest.sort()) !== JSON.stringify(originalSportsInterest.sort())
    const sportsPracticedChanged = JSON.stringify(selectedSportsPracticed.sort()) !== JSON.stringify(originalSportsPracticed.sort())
    const hasChanged = formChanged || conditionsChanged || locationResourcesChanged || coachOfferingsChanged || sportsInterestChanged || sportsPracticedChanged
    setHasChanges(hasChanged)
  }, [formData, originalData, userDisabilityConditions, originalDisabilityConditions, selectedLocationResources, originalLocationResources, selectedCoachOfferings, originalCoachOfferings, selectedSportsInterest, originalSportsInterest, selectedSportsPracticed, originalSportsPracticed])

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
          city: formData.city,
          birth_date: formData.birthDate,
          fitness_level: formData.fitnessLevel,
          location: formData.location,
          has_disability: formData.hasDisability,
          accessibility_mode_enabled: formData.accessibilityModeEnabled,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      // Atualizar condição de deficiência selecionada
      if (formData.hasDisability) {
        // Remover condições antigas
        await supabase
          .from('user_disability_conditions')
          .delete()
          .eq('user_id', user.id)

        // Adicionar nova condição se selecionada
        if (userDisabilityConditions.length > 0) {
          await supabase
            .from('user_disability_conditions')
            .insert({
              user_id: user.id,
              condition_id: userDisabilityConditions[0]
            })
        }
      } else {
        // Se não possui deficiência, remover todas as condições
        await supabase
          .from('user_disability_conditions')
          .delete()
          .eq('user_id', user.id)
      }

      // Atualizar recursos de locais
      if (formData.accessibilityModeEnabled) {
        // Remover seleções antigas
        await supabase
          .from('user_desired_location_resources')
          .delete()
          .eq('user_id', user.id)

        // Inserir novas seleções
        if (selectedLocationResources.length > 0) {
          const itemsToInsert = selectedLocationResources.map(resourceId => ({
            user_id: user.id,
            resource_id: resourceId
          }))
          await supabase
            .from('user_desired_location_resources')
            .insert(itemsToInsert)
        }
      } else {
        // Se acessibilidade desativada, remover todos os recursos
        await supabase
          .from('user_desired_location_resources')
          .delete()
          .eq('user_id', user.id)
      }

      // Atualizar ofertas de professores
      if (formData.accessibilityModeEnabled) {
        // Remover seleções antigas
        await supabase
          .from('user_desired_coach_offerings')
          .delete()
          .eq('user_id', user.id)

        // Inserir novas seleções
        if (selectedCoachOfferings.length > 0) {
          const itemsToInsert = selectedCoachOfferings.map(offeringId => ({
            user_id: user.id,
            offering_id: offeringId
          }))
          await supabase
            .from('user_desired_coach_offerings')
            .insert(itemsToInsert)
        }
      } else {
        // Se acessibilidade desativada, remover todas as ofertas
        await supabase
          .from('user_desired_coach_offerings')
          .delete()
          .eq('user_id', user.id)
      }

      // Atualizar esportes de interesse
      // Remover seleções antigas
      await supabase
        .from('user_sports')
        .delete()
        .eq('user_id', user.id)

      // Inserir novas seleções
      if (selectedSportsInterest.length > 0) {
        const itemsToInsert = selectedSportsInterest.map(sportId => ({
          user_id: user.id,
          sport_id: sportId
        }))
        await supabase
          .from('user_sports')
          .insert(itemsToInsert)
      }

      // Atualizar esportes praticados anteriormente
      // Remover seleções antigas
      await supabase
        .from('user_sports_practiced')
        .delete()
        .eq('user_id', user.id)

      // Inserir novas seleções
      if (selectedSportsPracticed.length > 0) {
        const itemsToInsert = selectedSportsPracticed.map(sportId => ({
          user_id: user.id,
          sport_id: sportId
        }))
        await supabase
          .from('user_sports_practiced')
          .insert(itemsToInsert)
      }

      // Atualizar perfil no contexto
      await fetchUserProfile()
      
      // Atualizar dados originais
      setOriginalData(formData)
      setOriginalDisabilityConditions(userDisabilityConditions)
      setOriginalLocationResources(selectedLocationResources)
      setOriginalCoachOfferings(selectedCoachOfferings)
      setOriginalSportsInterest(selectedSportsInterest)
      setOriginalSportsPracticed(selectedSportsPracticed)
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
    setUserDisabilityConditions(originalDisabilityConditions)
    setSelectedLocationResources(originalLocationResources)
    setSelectedCoachOfferings(originalCoachOfferings)
    setSelectedSportsInterest(originalSportsInterest)
    setSelectedSportsPracticed(originalSportsPracticed)
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

  return (
    <div className="layout">
      <Sidebar />
      
      <main className="config-content edit-profile-page-mobile">
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
                  Última edição em {new Date(userProfile?.updated_at || user?.created_at || Date.now()).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="edit-profile-header-actions" style={{ display: 'flex', gap: '12px' }}>
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
        <div className="edit-profile-container" style={{ maxWidth: '60%' }}>
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
                  Mora em
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Cidade"
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
                  Data de nascimento
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
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
                  Condicionamento físico
                </label>
                <select
                  value={formData.fitnessLevel}
                  onChange={(e) => handleInputChange('fitnessLevel', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: 'var(--neutral-200)',
                    fontSize: '16px',
                    color: 'var(--ink-800)',
                    transition: 'background-color 0.2s',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => e.target.style.backgroundColor = 'white'}
                  onBlur={(e) => e.target.style.backgroundColor = 'var(--neutral-200)'}
                >
                  <option value="">Selecione...</option>
                  <option value="Sedentário">Sedentário</option>
                  <option value="Iniciante">Iniciante</option>
                  <option value="Praticante">Praticante</option>
                  <option value="Avançado">Avançado</option>
                  <option value="Atleta">Atleta</option>
                </select>
              </div>
            </div>
          </div>

          {/* Esportes Section */}
          <div className="config-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <i className="ph ph-basketball" style={{ fontSize: '24px', color: 'var(--green-700)' }}></i>
              <h2 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--neutral-700)' }}>
                Esportes
              </h2>
            </div>

            {/* Esportes de interesse */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '16px', 
                color: 'var(--ink-700)', 
                fontSize: '16px',
                fontWeight: 600
              }}>
                Esportes de interesse
              </label>
              <p style={{ 
                fontSize: '14px', 
                color: 'var(--ink-600)', 
                marginBottom: '16px' 
              }}>
                Selecione os esportes que você tem interesse em praticar ou conhecer mais.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {allSportsInterest.map(sport => (
                  <SelectableTag
                    key={sport.id}
                    label={sport.name}
                    selected={selectedSportsInterest.includes(sport.id)}
                    onClick={() => {
                      setSelectedSportsInterest(prev => {
                        if (prev.includes(sport.id)) {
                          return prev.filter(id => id !== sport.id)
                        } else {
                          return [...prev, sport.id]
                        }
                      })
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Esportes praticados anteriormente */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '16px', 
                color: 'var(--ink-700)', 
                fontSize: '16px',
                fontWeight: 600
              }}>
                Esportes praticados anteriormente
              </label>
              <p style={{ 
                fontSize: '14px', 
                color: 'var(--ink-600)', 
                marginBottom: '16px' 
              }}>
                Selecione todos os esportes que você já praticou, mesmo que tenha sido apenas uma vez.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {allSportsPracticed.map(sport => (
                  <SelectableTag
                    key={sport.id}
                    label={sport.label_pt}
                    selected={selectedSportsPracticed.includes(sport.id)}
                    onClick={() => {
                      setSelectedSportsPracticed(prev => {
                        if (prev.includes(sport.id)) {
                          return prev.filter(id => id !== sport.id)
                        } else {
                          return [...prev, sport.id]
                        }
                      })
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Accessibility Section */}
          <div className="config-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <i className="ph ph-wheelchair" style={{ fontSize: '24px', color: 'var(--green-700)' }}></i>
              <h2 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--neutral-700)' }}>
                Acessibilidade
              </h2>
            </div>

            {/* Possui deficiência */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '12px', 
                color: 'var(--ink-700)', 
                fontSize: '14px',
                fontWeight: 500
              }}>
                Possui deficiência?
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, hasDisability: true }))
                  }}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '24px',
                    border: formData.hasDisability ? 'none' : '1.5px solid var(--neutral-400)',
                    backgroundColor: formData.hasDisability ? 'var(--green-800)' : 'transparent',
                    color: formData.hasDisability ? 'white' : 'var(--ink-700)',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Sim
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, hasDisability: false }))
                  }}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '24px',
                    border: !formData.hasDisability ? 'none' : '1.5px solid var(--neutral-400)',
                    backgroundColor: !formData.hasDisability ? 'var(--green-800)' : 'transparent',
                    color: !formData.hasDisability ? 'white' : 'var(--ink-700)',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Não
                </button>
              </div>
            </div>

            {/* Dropdown de condição de deficiência se "Sim" */}
            {formData.hasDisability && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'var(--ink-700)', 
                  fontSize: '14px',
                  fontWeight: 500
                }}>
                  Selecionar condição de deficiência
                </label>
                <select
                  value={userDisabilityConditions[0] || ''}
                  onChange={(e) => {
                    const conditionId = parseInt(e.target.value)
                    setUserDisabilityConditions(conditionId ? [conditionId] : [])
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    paddingRight: '40px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: 'var(--neutral-200)',
                    fontSize: '14px',
                    color: 'var(--ink-800)',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    appearance: 'none',
                    backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '20px'
                  }}
                  onFocus={(e) => e.target.style.backgroundColor = 'white'}
                  onBlur={(e) => e.target.style.backgroundColor = 'var(--neutral-200)'}
                >
                  <option value="">Selecione uma condição</option>
                  {allDisabilityConditions.map(condition => (
                    <option key={condition.id} value={condition.id}>
                      {condition.label_pt}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Modo de acessibilidade */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginTop: '32px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <i className="ph ph-user-focus" style={{ fontSize: '28px', color: '#006FCA' }}></i>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: '#006FCA', marginBottom: '4px' }}>
                    Modo de acessibilidade
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--ink-600)' }}>
                    Personaliza recomendações e buscas para usuários com deficiência
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, accessibilityModeEnabled: !prev.accessibilityModeEnabled }))
                }}
                style={{
                  width: '48px',
                  height: '28px',
                  borderRadius: '14px',
                  border: 'none',
                  backgroundColor: formData.accessibilityModeEnabled ? '#006FCA' : 'var(--neutral-400)',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  flexShrink: 0
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '12px',
                  backgroundColor: 'white',
                  position: 'absolute',
                  top: '2px',
                  left: formData.accessibilityModeEnabled ? '22px' : '2px',
                  transition: 'all 0.3s',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}></div>
              </button>
            </div>

            {/* Recursos de Acessibilidade - só aparecem se modo ativo */}
            {formData.accessibilityModeEnabled && (
              <>
                {/* Recursos desejados nos locais */}
                <div style={{ marginTop: '32px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '16px', 
                    color: 'var(--ink-700)', 
                    fontSize: '16px',
                    fontWeight: 600
                  }}>
                    Recursos desejados nos locais
                  </label>
                  <p style={{ 
                    fontSize: '14px', 
                    color: 'var(--ink-600)', 
                    marginBottom: '16px' 
                  }}>
                    Selecione os recursos de acessibilidade que você considera importantes nos locais de prática esportiva.
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {allLocationResources.map(resource => (
                      <SelectableTag
                        key={resource.id}
                        label={resource.label_pt}
                        selected={selectedLocationResources.includes(resource.id)}
                        onClick={() => {
                          setSelectedLocationResources(prev => {
                            if (prev.includes(resource.id)) {
                              return prev.filter(id => id !== resource.id)
                            } else {
                              return [...prev, resource.id]
                            }
                          })
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* O que os professores devem oferecer */}
                <div style={{ marginTop: '32px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '16px', 
                    color: 'var(--ink-700)', 
                    fontSize: '16px',
                    fontWeight: 600
                  }}>
                    O que os professores devem oferecer
                  </label>
                  <p style={{ 
                    fontSize: '14px', 
                    color: 'var(--ink-600)', 
                    marginBottom: '16px' 
                  }}>
                    Selecione as características e ofertas que você considera importantes nos professores e instrutores.
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {allCoachOfferings.map(offering => (
                      <SelectableTag
                        key={offering.id}
                        label={offering.label_pt}
                        selected={selectedCoachOfferings.includes(offering.id)}
                        onClick={() => {
                          setSelectedCoachOfferings(prev => {
                            if (prev.includes(offering.id)) {
                              return prev.filter(id => id !== offering.id)
                            } else {
                              return [...prev, offering.id]
                            }
                          })
                        }}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons - Mobile Only (no final) */}
          <div className="edit-profile-footer-actions" style={{ display: 'none', flexDirection: 'column', gap: '12px', marginTop: '32px', width: '100%' }}>
            <SecondaryButton onClick={handleDiscard} disabled={!hasChanges}>
              Descartar
            </SecondaryButton>
            <PrimaryButton onClick={handleSave} disabled={!hasChanges || isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar'}
            </PrimaryButton>
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
