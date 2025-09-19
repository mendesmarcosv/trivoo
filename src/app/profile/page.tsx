'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Button from '@/components/Button'
import Avatar from '@/components/Avatar'
import LocationSelector from '@/components/LocationSelector'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import { X, Plus } from 'lucide-react'

interface Sport {
  id: string
  name: string
  category?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, userProfile, loading, fetchUserProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoadingSports, setIsLoadingSports] = useState(false)
  const [allSports, setAllSports] = useState<Sport[]>([])
  const [userSports, setUserSports] = useState<Sport[]>([])
  const [selectedSports, setSelectedSports] = useState<string[]>([])
  const [showSportsModal, setShowSportsModal] = useState(false)
  const [searchSport, setSearchSport] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: ''
  })

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  React.useEffect(() => {
    if (user && userProfile) {
      setFormData({
        name: userProfile.name || user.user_metadata?.name || '',
        email: user.email || '',
        phone: userProfile.phone || user.user_metadata?.phone || '',
        bio: userProfile.bio || ''
      })
    }
  }, [user, userProfile])

  // Buscar todos os esportes disponíveis
  useEffect(() => {
    const fetchSports = async () => {
      const { data, error } = await supabase
        .from('sports')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (data) {
        setAllSports(data)
      }
    }

    fetchSports()
  }, [])

  // Buscar esportes do usuário
  useEffect(() => {
    const fetchUserSports = async () => {
      if (!user?.id) return

      setIsLoadingSports(true)
      const { data, error } = await supabase
        .from('user_sports')
        .select(`
          sport_id,
          sports:sport_id (
            id,
            name,
            category
          )
        `)
        .eq('user_id', user.id)

      if (data) {
        const sports = data
          .filter((item: any) => item.sports)
          .map((item: any) => item.sports as Sport)
        setUserSports(sports)
        setSelectedSports(sports.map(s => s.id))
      }
      setIsLoadingSports(false)
    }

    fetchUserSports()
  }, [user?.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#4C5E18] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) return null

  const handleSave = async () => {
    try {
      // Salvar dados do perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          phone: formData.phone,
          bio: formData.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (profileError) throw profileError

      // Atualizar perfil no contexto
      await fetchUserProfile()

      toast.success('Perfil atualizado com sucesso!')
      setIsEditing(false)
    } catch (error) {
      console.error('Erro ao salvar perfil:', error)
      toast.error('Erro ao salvar alterações')
    }
  }

  const handleSaveSports = async () => {
    try {
      // Remover esportes existentes
      await supabase
        .from('user_sports')
        .delete()
        .eq('user_id', user.id)

      // Adicionar esportes selecionados
      if (selectedSports.length > 0) {
        const sportsToAdd = selectedSports.map(sportId => ({
          user_id: user.id,
          sport_id: sportId
        }))

        const { error } = await supabase
          .from('user_sports')
          .insert(sportsToAdd)

        if (error) throw error
      }

      // Atualizar lista de esportes do usuário
      const updatedSports = allSports.filter(s => selectedSports.includes(s.id))
      setUserSports(updatedSports)

      toast.success('Esportes atualizados com sucesso!')
      setShowSportsModal(false)
    } catch (error) {
      console.error('Erro ao salvar esportes:', error)
      toast.error('Erro ao salvar esportes')
    }
  }

  const toggleSport = (sportId: string) => {
    setSelectedSports(prev => 
      prev.includes(sportId)
        ? prev.filter(id => id !== sportId)
        : [...prev, sportId]
    )
  }

  const filteredSports = allSports.filter(sport =>
    sport.name.toLowerCase().includes(searchSport.toLowerCase())
  )

  // Agrupar esportes por categoria
  const sportsByCategory = filteredSports.reduce((acc, sport) => {
    const category = sport.category || 'Outros'
    if (!acc[category]) acc[category] = []
    acc[category].push(sport)
    return acc
  }, {} as Record<string, Sport[]>)

  return (
    <div className="layout">
      <Sidebar />
      
      <main className="content">
        {/* Header */}
        <div className="toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '30px', fontWeight: 600, color: 'var(--ink-800)' }}>Meu Perfil</h1>
          {!isEditing && (
            <Button 
              onClick={() => setIsEditing(true)}
              className="bg-[#4C5E18] hover:bg-[#3d4d14]"
            >
              Editar perfil
            </Button>
          )}
        </div>

        {/* Profile Content */}
        <section className="greeting-and-promo">
          {/* Left Column - User Info */}
          <div className="greeting" style={{ flex: 1 }}>
            {/* Profile Picture */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
              <Avatar 
                name={formData.name}
                email={user?.email}
                size="xl"
              />
              
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--ink-800)' }}>
                  {formData.name || 'Usuário'}
                </h2>
                <p style={{ color: 'var(--ink-600)', marginBottom: '8px' }}>{formData.email}</p>
                {!isEditing && (
                  <div style={{ marginTop: '12px' }}>
                    <LocationSelector />
                  </div>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ink-700)', fontSize: '14px' }}>
                  Nome completo
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: isEditing ? 'white' : '#F7F7F7',
                    fontSize: '14px',
                    color: 'var(--ink-800)'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ink-700)', fontSize: '14px' }}>
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
                    backgroundColor: '#F7F7F7',
                    fontSize: '14px',
                    color: 'var(--ink-600)',
                    cursor: 'not-allowed'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ink-700)', fontSize: '14px' }}>
                  Telefone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  placeholder="(00) 00000-0000"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: isEditing ? 'white' : '#F7F7F7',
                    fontSize: '14px',
                    color: 'var(--ink-800)'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ink-700)', fontSize: '14px' }}>
                  Biografia
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Conte um pouco sobre você..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: isEditing ? 'white' : '#F7F7F7',
                    fontSize: '14px',
                    color: 'var(--ink-800)',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Seção de Esportes */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ink-700)', fontSize: '14px' }}>
                  Esportes de interesse
                </label>
                <div style={{ 
                  padding: '16px',
                  backgroundColor: '#F7F7F7',
                  borderRadius: '12px'
                }}>
                  {isLoadingSports ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="w-6 h-6 border-3 border-[#4C5E18] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {userSports.length > 0 ? (
                          userSports.map(sport => (
                            <span 
                              key={sport.id} 
                              className="chip"
                              style={{
                                backgroundColor: '#95B02F',
                                color: 'white',
                                padding: '6px 12px',
                                borderRadius: '20px',
                                fontSize: '14px'
                              }}
                            >
                              {sport.name}
                            </span>
                          ))
                        ) : (
                          <span style={{ color: 'var(--ink-600)', fontSize: '14px' }}>
                            Nenhum esporte selecionado
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => setShowSportsModal(true)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 16px',
                          backgroundColor: 'white',
                          border: '1px solid #E5E5E5',
                          borderRadius: '8px',
                          color: 'var(--ink-700)',
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FAFAFA'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
                      >
                        <Plus size={16} />
                        Adicionar esportes
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <Button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} className="flex-1">
                    Salvar alterações
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Stats/Info */}
          <div style={{ width: '400px' }}>
            <aside className="promo-card" style={{ 
              backgroundColor: '#95B02F', 
              height: 'auto',
              padding: '32px'
            }}>
              <h2 style={{ color: 'white', marginBottom: '24px' }}>Suas estatísticas</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '4px' }}>
                    Esportes de interesse
                  </p>
                  <p style={{ color: 'white', fontSize: '32px', fontWeight: 600 }}>
                    {userSports.length}
                  </p>
                </div>
                
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '4px' }}>
                    Aulas realizadas
                  </p>
                  <p style={{ color: 'white', fontSize: '32px', fontWeight: 600 }}>12</p>
                </div>
                
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '4px' }}>
                    Clubes visitados
                  </p>
                  <p style={{ color: 'white', fontSize: '32px', fontWeight: 600 }}>3</p>
                </div>
                
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '4px' }}>
                    Membro desde
                  </p>
                  <p style={{ color: 'white', fontSize: '18px', fontWeight: 500 }}>
                    {new Date(user.created_at).toLocaleDateString('pt-BR', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* Modal de Seleção de Esportes */}
        {showSportsModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '800px',
              width: '90%',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Header do Modal */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--ink-800)' }}>
                  Selecione seus esportes de interesse
                </h2>
                <button
                  onClick={() => {
                    setShowSportsModal(false)
                    setSelectedSports(userSports.map(s => s.id))
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px'
                  }}
                >
                  <X size={24} color="var(--ink-600)" />
                </button>
              </div>

              {/* Campo de busca */}
              <input
                type="text"
                placeholder="Buscar esportes..."
                value={searchSport}
                onChange={(e) => setSearchSport(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid #E5E5E5',
                  fontSize: '14px',
                  marginBottom: '24px'
                }}
              />

              {/* Lista de esportes por categoria */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                marginBottom: '24px'
              }}>
                {Object.entries(sportsByCategory).map(([category, sports]) => (
                  <div key={category} style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--ink-600)',
                      marginBottom: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {category}
                    </h3>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}>
                      {sports.map(sport => (
                        <button
                          key={sport.id}
                          onClick={() => toggleSport(sport.id)}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: selectedSports.includes(sport.id)
                              ? '2px solid #95B02F'
                              : '1px solid #E5E5E5',
                            backgroundColor: selectedSports.includes(sport.id)
                              ? '#95B02F'
                              : 'white',
                            color: selectedSports.includes(sport.id)
                              ? 'white'
                              : 'var(--ink-700)',
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          {sport.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Botões de ação */}
              <div style={{
                display: 'flex',
                gap: '12px',
                paddingTop: '24px',
                borderTop: '1px solid #E5E5E5'
              }}>
                <Button
                  onClick={() => {
                    setShowSportsModal(false)
                    setSelectedSports(userSports.map(s => s.id))
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveSports}
                  className="flex-1 bg-[#4C5E18] hover:bg-[#3d4d14]"
                >
                  Salvar {selectedSports.length > 0 && `(${selectedSports.length})`}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}