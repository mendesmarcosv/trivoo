'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import ExplorarClubCard from '@/components/ExplorarClubCard'
import ExplorarTeacherCard from '@/components/ExplorarTeacherCard'
import ExplorarEventCard from '@/components/ExplorarEventCard'
import ExplorarSkeleton from '@/components/ExplorarSkeleton'
import { supabase } from '@/lib/supabase'

function ExplorarContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()
  
  // Definir aba inicial baseada no parâmetro da URL
  const getInitialTab = (): 'clubs' | 'teachers' | 'events' => {
    const tab = searchParams?.get('tab')
    if (tab === 'teachers' || tab === 'clubs' || tab === 'events') {
      return tab
    }
    return 'clubs' // padrão
  }
  
  const [activeTab, setActiveTab] = useState<'clubs' | 'teachers' | 'events'>(getInitialTab())
  const [clubs, setClubs] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [loadingClubs, setLoadingClubs] = useState(true)
  const [loadingTeachers, setLoadingTeachers] = useState(true)
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [sortBy, setSortBy] = useState('distance')

  // Reativo aos parâmetros da URL
  useEffect(() => {
    const tab = searchParams?.get('tab')
    if (tab === 'teachers' || tab === 'clubs' || tab === 'events') {
      setActiveTab(tab)
    }
  }, [searchParams])

  useEffect(() => {
    if (!loading && !user) {
      const timer = setTimeout(() => {
        router.push('/auth/login')
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [user, loading, router])

  // Buscar clubes
  useEffect(() => {
    const fetchClubs = async () => {
      setLoadingClubs(true)
      try {
        console.log('Buscando clubes...')
        const { data, error } = await supabase
          .from('clubs')
          .select('*')
          .order('name')
        
        if (error) throw error
        
        console.log('Clubes encontrados:', data?.length || 0, 'dados:', data)
        if (data) {
          setClubs(data)
          console.log('Clubes setados no estado:', data.length)
        }
      } catch (error) {
        console.error('Erro ao buscar clubes:', error)
      } finally {
        setLoadingClubs(false)
      }
    }

    fetchClubs()
  }, [])

  // Buscar professores
  useEffect(() => {
    const fetchTeachers = async () => {
      setLoadingTeachers(true)
      try {
        console.log('Buscando professores...')
        const { data, error } = await supabase
          .from('teachers')
          .select('*')
          .order('name')
        
        if (error) throw error
        
        console.log('Professores encontrados:', data?.length || 0, 'dados:', data)
        if (data) {
          setTeachers(data)
          console.log('Professores setados no estado:', data.length)
        }
      } catch (error) {
        console.error('Erro ao buscar professores:', error)
      } finally {
        setLoadingTeachers(false)
      }
    }

    fetchTeachers()
  }, [])

  // Buscar eventos
  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true)
      try {
        console.log('Buscando eventos...')
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('date')
        
        if (error) throw error
        
        console.log('Eventos encontrados:', data?.length || 0, 'dados:', data)
        if (data) {
          setEvents(data)
          console.log('Eventos setados no estado:', data.length)
        }
      } catch (error) {
        console.error('Erro ao buscar eventos:', error)
      } finally {
        setLoadingEvents(false)
      }
    }

    fetchEvents()
  }, [])

  // Resetar sortBy quando trocar de tab
  useEffect(() => {
    if (activeTab === 'clubs') setSortBy('distance')
    if (activeTab === 'teachers') setSortBy('rating')
    if (activeTab === 'events') setSortBy('date')
  }, [activeTab])

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = () => setShowSortDropdown(false)
    if (showSortDropdown) {
      document.addEventListener('click', handleClickOutside)
    }
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showSortDropdown])

  // Opções de ordenação baseadas na tab ativa
  const getSortOptions = () => {
    switch (activeTab) {
      case 'clubs':
        return [
          { value: 'distance', label: 'Distância' },
          { value: 'name', label: 'Nome A-Z' },
          { value: 'relevance', label: 'Relevância' }
        ]
      case 'teachers':
        return [
          { value: 'rating', label: 'Melhor avaliação' },
          { value: 'name', label: 'Nome A-Z' },
          { value: 'distance', label: 'Distância' }
        ]
      case 'events':
        return [
          { value: 'date', label: 'Data mais próxima' },
          { value: 'name', label: 'Nome A-Z' },
          { value: 'distance', label: 'Distância' }
        ]
      default:
        return []
    }
  }

  const currentSortLabel = getSortOptions().find(opt => opt.value === sortBy)?.label || 'Ordenar'

  // Função para ordenar os dados
  const sortData = (data: any[], sortType: string) => {
    const sorted = [...data]
    switch (sortType) {
      case 'distance':
        return sorted.sort((a, b) => (a.distance_km || 0) - (b.distance_km || 0))
      case 'name':
        return sorted.sort((a, b) => (a.name || a.title || '').localeCompare(b.name || b.title || ''))
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      case 'date':
        return sorted.sort((a, b) => new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime())
      case 'relevance':
      default:
        return sorted
    }
  }

  return (
    <div className="layout">
      <Sidebar />
      
      <main className="page-content explorar-page-mobile">
        {/* Header */}
        <div className="page-header" style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '30px', fontWeight: 600, color: 'var(--ink-800)' }}>
            Descubra perto de você
          </h1>
        </div>

        {/* Tabs e Filtros na mesma linha */}
        <div className="explorar-header-controls" style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          {/* Switch Bar (Tabs) */}
          {/* Tabs - Desktop */}
          <div className="explorar-tabs-desktop" style={{
            display: 'flex',
            backgroundColor: 'var(--neutral-200)',
            borderRadius: '32px',
            padding: '8px',
            gap: '4px'
          }}>
            <button
              onClick={() => setActiveTab('clubs')}
              style={{
                padding: '10px 20px',
                borderRadius: '24px',
                border: 'none',
                backgroundColor: activeTab === 'clubs' ? 'var(--green-800)' : 'transparent',
                color: activeTab === 'clubs' ? 'white' : 'var(--neutral-800)',
                fontSize: '18px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              Clubes & Centros de Treinamentos
            </button>
            <button
              onClick={() => setActiveTab('teachers')}
              style={{
                padding: '10px 20px',
                borderRadius: '24px',
                border: 'none',
                backgroundColor: activeTab === 'teachers' ? 'var(--green-800)' : 'transparent',
                color: activeTab === 'teachers' ? 'white' : 'var(--neutral-800)',
                fontSize: '18px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              Professores
            </button>
            <button
              onClick={() => setActiveTab('events')}
              style={{
                padding: '10px 20px',
                borderRadius: '24px',
                border: 'none',
                backgroundColor: activeTab === 'events' ? 'var(--green-800)' : 'transparent',
                color: activeTab === 'events' ? 'white' : 'var(--neutral-800)',
                fontSize: '18px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              Eventos
            </button>
          </div>

          {/* Dropdown - Mobile */}
          <select 
            className="explorar-dropdown-mobile"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as 'clubs' | 'teachers' | 'events')}
            style={{
              display: 'none',
              width: '100%',
              padding: '12px 16px',
              backgroundColor: 'var(--green-800)',
              color: 'white',
              fontSize: '16px',
              fontWeight: 500,
              fontFamily: 'Raleway',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '20px',
              paddingRight: '40px'
            }}
          >
            <option value="clubs">Clubes & Centros de Treinamentos</option>
            <option value="teachers">Professores</option>
            <option value="events">Eventos</option>
          </select>

          {/* Filtros */}
          <div style={{ 
            display: 'flex', 
            gap: '16px',
            alignItems: 'center',
            position: 'relative'
          }}>
            {/* Filtro: Ordenar por */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              position: 'relative'
            }}>
              <span style={{
                color: 'var(--neutral-900)',
                fontSize: '16px',
                fontWeight: 500
              }}>
                Ordenar por
              </span>
              <button 
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'var(--neutral-200)',
                  color: 'var(--neutral-900)',
                  fontSize: '16px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--neutral-300)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--neutral-200)'}
              >
                {currentSortLabel}
                <i className="ph ph-caret-down" style={{ fontSize: '16px', color: 'var(--neutral-600)' }}></i>
              </button>

              {/* Dropdown */}
              {showSortDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  zIndex: 1000,
                  minWidth: '180px',
                  overflow: 'hidden'
                }}>
                  {getSortOptions().map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value)
                        setShowSortDropdown(false)
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: 'none',
                        backgroundColor: sortBy === option.value ? 'var(--neutral-100)' : 'white',
                        color: 'var(--neutral-900)',
                        fontSize: '16px',
                        fontWeight: sortBy === option.value ? 600 : 500,
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (sortBy !== option.value) {
                          e.currentTarget.style.backgroundColor = 'var(--neutral-50)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (sortBy !== option.value) {
                          e.currentTarget.style.backgroundColor = 'white'
                        }
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Grid de conteúdo */}
        <div className="page-section">
          {/* Loading Skeleton */}
          {((activeTab === 'clubs' && loadingClubs) ||
            (activeTab === 'teachers' && loadingTeachers) ||
            (activeTab === 'events' && loadingEvents)) && (
            <ExplorarSkeleton />
          )}

          {/* Conteúdo Real */}
          {!(activeTab === 'clubs' && loadingClubs) &&
           !(activeTab === 'teachers' && loadingTeachers) &&
           !(activeTab === 'events' && loadingEvents) && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {activeTab === 'clubs' && (
                <>
                  {console.log('Renderizando clubs - total:', clubs.length, 'dados:', clubs)}
                  {sortData(clubs, sortBy).map(club => (
                    <ExplorarClubCard 
                      key={club.id}
                      id={club.id}
                      title={club.name}
                      distance={`${club.distance_km || 0}km`}
                      image={club.image_url || '/images/clubs/default.png'}
                      chips={club.sports || []}
                    />
                  ))}
                </>
              )}
              {activeTab === 'teachers' && (
                <>
                  {console.log('Renderizando teachers - total:', teachers.length, 'dados:', teachers)}
                  {sortData(teachers, sortBy).map(teacher => (
                    <ExplorarTeacherCard 
                      key={teacher.id}
                      id={teacher.id}
                      name={teacher.name}
                      sport={teacher.sport}
                      rating={teacher.rating || 0}
                      reviews={teacher.total_reviews || 0}
                      image={teacher.avatar_url || '/images/teachers/default.png'}
                      location={teacher.location}
                    />
                  ))}
                </>
              )}
              {activeTab === 'events' && (
                <>
                  {console.log('Renderizando events - total:', events.length, 'dados:', events)}
                  {sortData(events, sortBy).map(event => (
                    <ExplorarEventCard 
                      key={event.id}
                      id={event.id}
                      title={event.title}
                      date={event.date}
                      time={event.time}
                      location={event.location}
                      sport={event.sport}
                      image={event.image_url || '/images/events/default.png'}
                    />
                  ))}
                </>
              )}
            </div>
          )}

          {/* Mensagem se vazio (só após carregar) */}
          {activeTab === 'clubs' && !loadingClubs && clubs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--ink-600)' }}>
              Nenhum clube disponível no momento
            </div>
          )}
          {activeTab === 'teachers' && !loadingTeachers && teachers.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--ink-600)' }}>
              Nenhum professor disponível no momento
            </div>
          )}
          {activeTab === 'events' && !loadingEvents && events.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--ink-600)' }}>
              Nenhum evento disponível no momento
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function ExplorarPage() {
  return (
    <Suspense fallback={<ExplorarSkeleton />}>
      <ExplorarContent />
    </Suspense>
  )
}

