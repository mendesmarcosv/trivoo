'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Avatar from '@/components/Avatar'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import ResponsiveProfileStyles from '@/components/ResponsiveProfileStyles'
import { supabase } from '@/lib/supabase'

interface TeacherProfile {
  id: string
  name: string
  sport: string
  rating: number
  total_reviews?: number
  location: string
  avatar_url: string
  bio?: string
  phone?: string
  experience_years?: number
  certifications?: string[]
  other_sports?: string[]
  offers_trial_class?: boolean
  accessibility_friendly?: boolean
  accessibility_offerings?: string[]
  review_tags?: string[]
  accessibility_review_tags?: string[]
}

export default function TeacherProfilePage() {
  const params = useParams()
  const router = useRouter()
  const teacherId = params?.id as string
  
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!teacherId) return

      setIsLoading(true)
      
      try {
        // Buscar professor no Supabase
        const { data, error } = await supabase
          .from('teachers')
          .select('*')
          .eq('id', teacherId)
          .single()

        if (error) {
          console.error('Erro ao buscar professor:', error)
          throw error
        }
        
        if (data) {
          console.log('Dados do professor do Supabase:', data)
          setTeacher(data)
        }
      } catch (error) {
        console.error('Erro ao buscar professor:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeacherData()
  }, [teacherId])

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (!teacher) {
    return (
      <div className="layout">
        <Sidebar />
        <main className="page-content">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h1>Professor não encontrado</h1>
            <button
              onClick={() => router.push('/explorar')}
              style={{
                marginTop: '20px',
                padding: '12px 24px',
                background: 'var(--green-700)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '16px',
                fontFamily: 'Raleway'
              }}
            >
              Voltar para Explorar
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="layout">
      <ResponsiveProfileStyles />
      <Sidebar />
      
      <main className="page-content">
        {/* Header com botão voltar */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <button
            onClick={() => router.back()}
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
          <h1 style={{ 
            fontSize: '30px', 
            fontWeight: 600, 
            color: 'var(--ink-800)',
            fontFamily: 'Raleway'
          }}>
            Conheça o Professor
          </h1>
        </div>

        {/* Profile Card */}
        <div className="teacher-profile-card-mobile" style={{
          backgroundColor: 'var(--neutral-200)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '24px'
        }}>
          {/* Header com Avatar e Nome */}
          <div className="profile-header teacher-header-mobile" style={{ 
            width: '100%',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: '32px',
            display: 'inline-flex',
            marginBottom: '48px'
          }}>
            {/* Avatar */}
            <div className="teacher-avatar-mobile" style={{ 
              justifyContent: 'flex-start', 
              alignItems: 'center', 
              gap: '32px', 
              display: 'flex' 
            }}>
              <div className="profile-avatar-container teacher-avatar-container-mobile" style={{ 
                width: '144px', 
                height: '144px', 
                position: 'relative', 
                overflow: 'hidden', 
                borderRadius: '600px',
                backgroundColor: '#D1D5DB'
              }}>
                {teacher.avatar_url ? (
                  <img 
                    className="teacher-avatar-image-mobile"
                    style={{ 
                      width: '144px', 
                      height: '144px', 
                      position: 'absolute',
                      objectFit: 'cover'
                    }} 
                    src={teacher.avatar_url}
                    alt={teacher.name}
                  />
                ) : (
                  <div className="teacher-avatar-initial-mobile" style={{
                    width: '144px',
                    height: '144px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    fontWeight: 600,
                    color: '#6B7280',
                    fontFamily: 'Raleway'
                  }}>
                    {teacher.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* Info e Ações */}
            <div style={{ 
              flex: '1 1 0', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'flex-start', 
              gap: '16px', 
              display: 'inline-flex' 
            }}>
              <div className="teacher-info-actions-wrapper" style={{ 
                alignSelf: 'stretch', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start', 
                display: 'inline-flex' 
              }}>
                <div style={{ 
                  flexDirection: 'column', 
                  justifyContent: 'flex-start', 
                  alignItems: 'flex-start', 
                  gap: '24px', 
                  display: 'inline-flex' 
                }}>
                  {/* Rating */}
                  <div className="teacher-rating-mobile" style={{ 
                    justifyContent: 'flex-start', 
                    alignItems: 'center', 
                    gap: '4px', 
                    display: 'inline-flex' 
                  }}>
                    <div>
                      <span style={{ 
                        color: '#3B3B3B', 
                        fontSize: '20px', 
                        fontFamily: 'Raleway', 
                        fontWeight: 600, 
                        lineHeight: '20px' 
                      }}>
                        {teacher.rating.toFixed(1)}
                      </span>
                      <span style={{ 
                        color: '#8B8B8B', 
                        fontSize: '20px', 
                        fontFamily: 'Raleway', 
                        fontWeight: 600, 
                        lineHeight: '20px' 
                      }}>
                        /5
                      </span>
                    </div>
                    <i className="ph-fill ph-star" style={{ fontSize: '24px', color: '#F1AD00' }}></i>
                  </div>

                  {/* Nome */}
                  <div style={{ 
                    flexDirection: 'column', 
                    justifyContent: 'flex-start', 
                    alignItems: 'flex-start', 
                    gap: '24px', 
                    display: 'flex' 
                  }}>
                    <div className="profile-name teacher-name-mobile" style={{ 
                      color: '#758A25', 
                      fontSize: '40px', 
                      fontFamily: 'Raleway', 
                      fontWeight: 600, 
                      lineHeight: '34px' 
                    }}>
                      {teacher.name}
                    </div>
                  </div>

                  {/* Badges */}
                  {(teacher.offers_trial_class || teacher.accessibility_friendly) && (
                    <div className="profile-badges teacher-badges-mobile" style={{ 
                      justifyContent: 'flex-start', 
                      alignItems: 'flex-start', 
                      gap: '12px', 
                      display: 'inline-flex',
                      flexWrap: 'wrap'
                    }}>
                      {/* Badge: Oferece aula experimental */}
                      {teacher.offers_trial_class && (
                        <div style={{ 
                          paddingLeft: '16px', 
                          paddingRight: '16px', 
                          paddingTop: '6px', 
                          paddingBottom: '6px', 
                          background: '#FFE097', 
                          borderRadius: '12px', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          gap: '10px', 
                          display: 'flex' 
                        }}>
                          <i className="ph ph-hand-coins" style={{ fontSize: '20px', color: '#1D1D1D' }}></i>
                          <div style={{ 
                            color: '#1D1D1D', 
                            fontSize: '16px', 
                            fontFamily: 'Raleway', 
                            fontWeight: 500, 
                            lineHeight: '25.6px' 
                          }}>
                            Oferece aula experimental
                          </div>
                        </div>
                      )}

                      {/* Badge: Aulas Inclusivas */}
                      {teacher.accessibility_friendly && (
                        <div style={{ 
                          paddingLeft: '16px', 
                          paddingRight: '16px', 
                          paddingTop: '6px', 
                          paddingBottom: '6px', 
                          background: '#B2E8FF', 
                          borderRadius: '12px', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          gap: '10px', 
                          display: 'flex' 
                        }}>
                          <i className="ph ph-wheelchair" style={{ fontSize: '20px', color: '#1D1D1D' }}></i>
                          <div style={{ 
                            color: '#1D1D1D', 
                            fontSize: '16px', 
                            fontFamily: 'Raleway', 
                            fontWeight: 500, 
                            lineHeight: '25.6px' 
                          }}>
                            Aulas Inclusivas / Acessibilidade
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Botões de Ação */}
                <div className="profile-actions teacher-action-buttons-mobile" style={{ 
                  justifyContent: 'flex-start', 
                  alignItems: 'center', 
                  gap: '16px', 
                  display: 'flex' 
                }}>
                  {/* Botão: Agendar aula */}
                  <button
                    style={{
                      paddingLeft: '24px',
                      paddingRight: '24px',
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      background: '#B5D539',
                      borderRadius: '100px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '4px',
                      display: 'flex'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#A0C020'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#B5D539'}
                  >
                    <div style={{ 
                      textAlign: 'center', 
                      color: '#0D1F00', 
                      fontSize: '16px', 
                      fontFamily: 'Raleway', 
                      fontWeight: 500, 
                      lineHeight: '24px', 
                      letterSpacing: '0.08px' 
                    }}>
                      Agendar aula
                    </div>
                  </button>

                  {/* Botão: Entrar em contato */}
                  <button
                    style={{
                      paddingLeft: '24px',
                      paddingRight: '24px',
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      background: '#E0E0E0',
                      borderRadius: '100px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '8px',
                      display: 'flex'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#D0D0D0'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#E0E0E0'}
                  >
                    <i className="ph ph-chat-circle-dots" style={{ fontSize: '24px', color: '#3B3B3B' }}></i>
                    <div style={{ 
                      textAlign: 'center', 
                      color: '#3B3B3B', 
                      fontSize: '16px', 
                      fontFamily: 'Raleway', 
                      fontWeight: 500, 
                      lineHeight: '24px', 
                      letterSpacing: '0.08px' 
                    }}>
                      Entrar em contato
                    </div>
                  </button>

                  {/* Botão: Compartilhar */}
                  <button
                    style={{
                      width: '48px',
                      height: '48px',
                      paddingLeft: '24px',
                      paddingRight: '24px',
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      background: '#E0E0E0',
                      borderRadius: '100px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '4px',
                      display: 'flex'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#D0D0D0'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#E0E0E0'}
                  >
                    <i className="ph ph-share-network" style={{ fontSize: '24px', color: '#3B3B3B' }}></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Seção de Esportes */}
          <div className="teacher-section-card-mobile" style={{ 
            width: '100%', 
            padding: '24px', 
            background: '#F7F7F7', 
            borderRadius: '16px', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'flex-start', 
            gap: '24px', 
            display: 'inline-flex',
            marginBottom: '48px'
          }}>
            {/* Principal Esporte */}
            <div style={{ 
              alignSelf: 'stretch', 
              justifyContent: 'flex-start', 
              alignItems: 'center', 
              gap: '16px', 
              display: 'inline-flex' 
            }}>
              <div style={{ 
                padding: '10.29px', 
                background: '#ECECEC', 
                borderRadius: '85.71px', 
                justifyContent: 'flex-start', 
                alignItems: 'center', 
                gap: '8.57px', 
                display: 'flex' 
              }}>
                <i className="ph ph-graduation-cap" style={{ fontSize: '28px', color: '#758A25' }}></i>
              </div>
              <div style={{ 
                flex: '1 1 0', 
                flexDirection: 'column', 
                justifyContent: 'flex-start', 
                alignItems: 'flex-start', 
                gap: '8px', 
                display: 'inline-flex' 
              }}>
                <div style={{ 
                  alignSelf: 'stretch', 
                  color: '#758A25', 
                  fontSize: '16px', 
                  fontFamily: 'Raleway', 
                  fontWeight: 800, 
                  lineHeight: '22.4px' 
                }}>
                  Principal esporte
                </div>
                <div style={{ 
                  alignSelf: 'stretch', 
                  color: '#3B3B3B', 
                  fontSize: '20px', 
                  fontFamily: 'Raleway', 
                  fontWeight: 500, 
                  lineHeight: '24px' 
                }}>
                  {teacher.sport}
                </div>
              </div>
            </div>

            {/* Outros Esportes */}
            {teacher.other_sports && teacher.other_sports.length > 0 && (
              <div style={{ 
                alignSelf: 'stretch', 
                flexDirection: 'column', 
                justifyContent: 'flex-start', 
                alignItems: 'flex-start', 
                gap: '16px', 
                display: 'flex' 
              }}>
                <div style={{ 
                  alignSelf: 'stretch', 
                  color: '#5F5F5F', 
                  fontSize: '16px', 
                  fontFamily: 'Raleway', 
                  fontWeight: 500, 
                  lineHeight: '22.4px' 
                }}>
                  Outros esportes oferecidos
                </div>
                <div style={{ 
                  justifyContent: 'flex-start', 
                  alignItems: 'flex-start', 
                  gap: '10px', 
                  display: 'inline-flex', 
                  flexWrap: 'wrap', 
                  alignContent: 'flex-start' 
                }}>
                  {teacher.other_sports.map((sport, idx) => (
                    <div 
                      key={idx}
                      style={{ 
                        paddingLeft: '12px', 
                        paddingRight: '12px', 
                        paddingTop: '8px', 
                        paddingBottom: '8px', 
                        background: '#E0E0E0', 
                        borderRadius: '8px', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        gap: '10px', 
                        display: 'flex' 
                      }}
                    >
                      <div style={{ 
                        color: '#4C5E18', 
                        fontSize: '14px', 
                        fontFamily: 'Raleway', 
                        fontWeight: 500 
                      }}>
                        {sport}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Informações de Contato e Sobre */}
          <div className="teacher-section-card-mobile" style={{ 
            width: '100%', 
            padding: '24px', 
            background: '#F7F7F7', 
            borderRadius: '16px', 
            flexDirection: 'column', 
            justifyContent: 'flex-start', 
            alignItems: 'flex-start', 
            gap: '32px', 
            display: 'inline-flex',
            marginBottom: '48px'
          }}>
            <div style={{ 
              alignSelf: 'stretch', 
              flexDirection: 'column', 
              justifyContent: 'flex-start', 
              alignItems: 'flex-start', 
              gap: '32px', 
              display: 'flex' 
            }}>
              {/* Linha 1: Local principal e Telefone */}
              <div className="teacher-location-phone" style={{ 
                alignSelf: 'stretch', 
                justifyContent: 'flex-start', 
                alignItems: 'flex-start', 
                gap: '32px', 
                display: 'inline-flex' 
              }}>
                {/* Local principal */}
                <div className="teacher-info-card-mobile" style={{ 
                  flex: '1 1 0', 
                  justifyContent: 'flex-start', 
                  alignItems: 'center', 
                  gap: '16px', 
                  display: 'flex' 
                }}>
                  <div style={{ 
                    padding: '10.29px', 
                    background: '#ECECEC', 
                    borderRadius: '85.71px', 
                    justifyContent: 'flex-start', 
                    alignItems: 'center', 
                    gap: '8.57px', 
                    display: 'flex' 
                  }}>
                    <i className="ph ph-map-pin" style={{ fontSize: '28px', color: '#758A25' }}></i>
                  </div>
                  <div style={{ 
                    flex: '1 1 0', 
                    justifyContent: 'flex-start', 
                    alignItems: 'center', 
                    gap: '8px', 
                    display: 'flex' 
                  }}>
                    <div style={{ 
                      flex: '1 1 0', 
                      flexDirection: 'column', 
                      justifyContent: 'flex-start', 
                      alignItems: 'flex-start', 
                      gap: '8px', 
                      display: 'inline-flex' 
                    }}>
                      <div style={{ 
                        alignSelf: 'stretch', 
                        color: '#5F5F5F', 
                        fontSize: '16px', 
                        fontFamily: 'Raleway', 
                        fontWeight: 500, 
                        lineHeight: '22.4px' 
                      }}>
                        Local principal
                      </div>
                      <div style={{ 
                        alignSelf: 'stretch',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        gap: '8px',
                        display: 'inline-flex'
                      }}>
                        <div style={{ 
                          color: '#3B3B3B',
                          fontSize: '20px',
                          fontFamily: 'Raleway',
                          fontWeight: 500,
                          lineHeight: '24px'
                        }}>
                          {teacher.location || 'Niterói - RJ'}
                        </div>
                        <button
                          onClick={() => {
                            const address = encodeURIComponent(teacher.location || 'Niterói - RJ')
                            window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank')
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <i className="ph ph-arrow-square-out" style={{ fontSize: '24px', color: '#8B8B8B' }}></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Telefone */}
                {teacher.phone && (
                  <div className="teacher-info-card-mobile" style={{ 
                    flex: '1 1 0', 
                    justifyContent: 'flex-start', 
                    alignItems: 'center', 
                    gap: '16px', 
                    display: 'flex' 
                  }}>
                    <div style={{ 
                      padding: '10.29px', 
                      background: '#ECECEC', 
                      borderRadius: '85.71px', 
                      justifyContent: 'flex-start', 
                      alignItems: 'center', 
                      gap: '8.57px', 
                      display: 'flex' 
                    }}>
                      <i className="ph ph-phone" style={{ fontSize: '32px', color: '#758A25' }}></i>
                    </div>
                    <div style={{ 
                      justifyContent: 'flex-start', 
                      alignItems: 'center', 
                      gap: '8px', 
                      display: 'flex' 
                    }}>
                      <div style={{ 
                        flexDirection: 'column', 
                        justifyContent: 'flex-start', 
                        alignItems: 'flex-start', 
                        gap: '8px', 
                        display: 'inline-flex' 
                      }}>
                        <div style={{ 
                          alignSelf: 'stretch', 
                          color: '#5F5F5F', 
                          fontSize: '16px', 
                          fontFamily: 'Raleway', 
                          fontWeight: 500, 
                          lineHeight: '22.4px' 
                        }}>
                          Telefone
                        </div>
                        <div style={{ 
                          alignSelf: 'stretch', 
                          justifyContent: 'flex-start', 
                          alignItems: 'flex-start', 
                          gap: '8px', 
                          display: 'inline-flex' 
                        }}>
                          <div style={{ 
                            color: '#3B3B3B', 
                            fontSize: '20px', 
                            fontFamily: 'Raleway', 
                            fontWeight: 500, 
                            lineHeight: '24px' 
                          }}>
                            {teacher.phone}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Linha 2: Sobre mim */}
              {teacher.bio && (
                <div className="teacher-bio-card-mobile" style={{ 
                  alignSelf: 'stretch', 
                  justifyContent: 'flex-start', 
                  alignItems: 'flex-start', 
                  gap: '16px', 
                  display: 'inline-flex' 
                }}>
                  <div style={{ 
                    padding: '10.29px', 
                    background: '#ECECEC', 
                    borderRadius: '85.71px', 
                    justifyContent: 'flex-start', 
                    alignItems: 'center', 
                    gap: '8.57px', 
                    display: 'flex' 
                  }}>
                    <i className="ph ph-user-circle" style={{ fontSize: '32px', color: '#758A25' }}></i>
                  </div>
                  <div style={{ 
                    flex: '1 1 0', 
                    flexDirection: 'column', 
                    justifyContent: 'flex-start', 
                    alignItems: 'flex-start', 
                    gap: '8px', 
                    display: 'inline-flex' 
                  }}>
                    <div style={{ 
                      alignSelf: 'stretch', 
                      color: '#5F5F5F', 
                      fontSize: '16px', 
                      fontFamily: 'Raleway', 
                      fontWeight: 500, 
                      lineHeight: '22.4px' 
                    }}>
                      Sobre mim
                    </div>
                    <div style={{ 
                      alignSelf: 'stretch', 
                      padding: '16px', 
                      background: '#ECECEC', 
                      borderRadius: '8px', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      gap: '10px', 
                      display: 'inline-flex' 
                    }}>
                      <div style={{ 
                        flex: '1 1 0', 
                        color: '#3B3B3B', 
                        fontSize: '16px', 
                        fontFamily: 'Raleway', 
                        fontWeight: 400, 
                        lineHeight: '24px',
                        whiteSpace: 'pre-line'
                      }}>
                        {teacher.bio}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card de Acessibilidade */}
          {(teacher.accessibility_friendly || (teacher.accessibility_offerings && teacher.accessibility_offerings.length > 0)) && (
            <div className="teacher-section-card-mobile" style={{ 
              width: '100%', 
              padding: '24px', 
              background: '#F7F7F7', 
              borderRadius: '16px', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'flex-start', 
              gap: '32px', 
              display: 'inline-flex',
              marginBottom: '48px'
            }}>
              {/* Header */}
              <div style={{ 
                justifyContent: 'flex-start', 
                alignItems: 'center', 
                gap: '16px', 
                display: 'inline-flex' 
              }}>
                <div style={{ 
                  padding: '10.29px', 
                  background: '#ECECEC', 
                  borderRadius: '85.71px', 
                  justifyContent: 'flex-start', 
                  alignItems: 'center', 
                  gap: '8.57px', 
                  display: 'flex' 
                }}>
                  <i className="ph ph-info" style={{ fontSize: '28px', color: '#006FCA' }}></i>
                </div>
                <div style={{ 
                  color: '#006FCA', 
                  fontSize: '18px', 
                  fontFamily: 'Raleway', 
                  fontWeight: 600, 
                  lineHeight: '25.2px' 
                }}>
                  Informações de Acessibilidade
                </div>
              </div>

              {/* O que o professor oferece */}
              {teacher.accessibility_offerings && teacher.accessibility_offerings.length > 0 && (
                <div style={{ 
                  alignSelf: 'stretch', 
                  borderRadius: '16px', 
                  flexDirection: 'column', 
                  justifyContent: 'flex-start', 
                  alignItems: 'flex-start', 
                  gap: '16px', 
                  display: 'flex' 
                }}>
                  <div style={{ 
                    color: '#3B3B3B', 
                    fontSize: '14px', 
                    fontFamily: 'Raleway', 
                    fontWeight: 600, 
                    lineHeight: '19.6px' 
                  }}>
                    O que o professor oferece
                  </div>
                  <div style={{ 
                    alignSelf: 'stretch', 
                    justifyContent: 'flex-start', 
                    alignItems: 'flex-start', 
                    gap: '12px', 
                    display: 'inline-flex', 
                    flexWrap: 'wrap', 
                    alignContent: 'flex-start' 
                  }}>
                    {teacher.accessibility_offerings.map((offering, idx) => (
                      <div 
                        key={idx}
                        style={{ 
                          paddingLeft: '12px', 
                          paddingRight: '12px', 
                          paddingTop: '8px', 
                          paddingBottom: '8px', 
                          background: '#ECECEC', 
                          borderRadius: '8px', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          gap: '10px', 
                          display: 'flex' 
                        }}
                      >
                        <div style={{ 
                          color: '#006FCA', 
                          fontSize: '14px', 
                          fontFamily: 'Raleway', 
                          fontWeight: 500 
                        }}>
                          {offering}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Card de Avaliações */}
          <div className="teacher-last-card-mobile" style={{ 
            width: '100%', 
            padding: '24px', 
            background: '#F7F7F7', 
            borderRadius: '16px', 
            flexDirection: 'column', 
            justifyContent: 'flex-start', 
            alignItems: 'flex-start', 
            gap: '32px', 
            display: 'inline-flex',
            marginBottom: '48px'
          }}>
            {/* Header com Rating */}
            <div style={{ 
              justifyContent: 'flex-start', 
              alignItems: 'center', 
              gap: '16px', 
              display: 'inline-flex' 
            }}>
              <div style={{ 
                padding: '10.29px', 
                background: '#ECECEC', 
                borderRadius: '85.71px', 
                justifyContent: 'flex-start', 
                alignItems: 'center', 
                gap: '8.57px', 
                display: 'flex' 
              }}>
                <i className="ph-fill ph-star" style={{ fontSize: '28px', color: '#F1AD00' }}></i>
              </div>
              <div style={{ 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'flex-start', 
                gap: '6px', 
                display: 'inline-flex' 
              }}>
                <div style={{ 
                  color: '#1D1D1D', 
                  fontSize: '18px', 
                  fontFamily: 'Raleway', 
                  fontWeight: 600, 
                  lineHeight: '25.2px' 
                }}>
                  Avaliações
                </div>
                <div style={{ 
                  justifyContent: 'flex-start', 
                  alignItems: 'center', 
                  gap: '8px', 
                  display: 'inline-flex' 
                }}>
                  <div style={{ 
                    justifyContent: 'flex-start', 
                    alignItems: 'center', 
                    gap: '4px', 
                    display: 'flex' 
                  }}>
                    <div>
                      <span style={{ 
                        color: '#3B3B3B', 
                        fontSize: '20px', 
                        fontFamily: 'Raleway', 
                        fontWeight: 600, 
                        lineHeight: '20px' 
                      }}>
                        {teacher.rating.toFixed(1)}
                      </span>
                      <span style={{ 
                        color: '#8B8B8B', 
                        fontSize: '20px', 
                        fontFamily: 'Raleway', 
                        fontWeight: 600, 
                        lineHeight: '20px' 
                      }}>
                        /5
                      </span>
                    </div>
                    <i className="ph-fill ph-star" style={{ fontSize: '24px', color: '#F1AD00' }}></i>
                  </div>
                  <div style={{ 
                    color: '#8B8B8B', 
                    fontSize: '16px', 
                    fontFamily: 'Raleway', 
                    fontWeight: 500, 
                    lineHeight: '16px' 
                  }}>
                    | {teacher.total_reviews || 5} avaliações
                  </div>
                </div>
              </div>
            </div>

            {/* Divisor */}
            <div style={{ 
              alignSelf: 'stretch', 
              height: '0px', 
              outline: '1px #E0E0E0 solid', 
              outlineOffset: '-0.5px' 
            }}></div>

            {/* Opinões sobre a aula e atendimento */}
            {teacher.review_tags && teacher.review_tags.length > 0 && (
              <div style={{ 
                alignSelf: 'stretch', 
                borderRadius: '16px', 
                flexDirection: 'column', 
                justifyContent: 'flex-start', 
                alignItems: 'flex-start', 
                gap: '16px', 
                display: 'flex' 
              }}>
                <div style={{ 
                  color: '#3B3B3B', 
                  fontSize: '14px', 
                  fontFamily: 'Raleway', 
                  fontWeight: 600, 
                  lineHeight: '19.6px' 
                }}>
                  Opinões sobre a aula e atendimento
                </div>
                <div style={{ 
                  alignSelf: 'stretch', 
                  justifyContent: 'flex-start', 
                  alignItems: 'flex-start', 
                  gap: '12px', 
                  display: 'inline-flex', 
                  flexWrap: 'wrap', 
                  alignContent: 'flex-start' 
                }}>
                  {teacher.review_tags.map((tag, idx) => (
                    <div 
                      key={idx}
                      style={{ 
                        paddingLeft: '12px', 
                        paddingRight: '12px', 
                        paddingTop: '8px', 
                        paddingBottom: '8px', 
                        background: '#ECECEC', 
                        borderRadius: '8px', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        gap: '10px', 
                        display: 'flex' 
                      }}
                    >
                      <div style={{ 
                        color: '#5F5F5F', 
                        fontSize: '14px', 
                        fontFamily: 'Raleway', 
                        fontWeight: 500 
                      }}>
                        {tag}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Opinões sobre aulas inclusivas (condicional) */}
            {teacher.accessibility_friendly && teacher.accessibility_review_tags && teacher.accessibility_review_tags.length > 0 && (
              <div style={{ 
                alignSelf: 'stretch', 
                borderRadius: '16px', 
                flexDirection: 'column', 
                justifyContent: 'flex-start', 
                alignItems: 'flex-start', 
                gap: '16px', 
                display: 'flex' 
              }}>
                <div style={{ 
                  color: '#3B3B3B', 
                  fontSize: '14px', 
                  fontFamily: 'Raleway', 
                  fontWeight: 600, 
                  lineHeight: '19.6px' 
                }}>
                  Opinões sobre aulas inclusivas e acessíveis
                </div>
                <div style={{ 
                  alignSelf: 'stretch', 
                  justifyContent: 'flex-start', 
                  alignItems: 'flex-start', 
                  gap: '12px', 
                  display: 'inline-flex', 
                  flexWrap: 'wrap', 
                  alignContent: 'flex-start' 
                }}>
                  {teacher.accessibility_review_tags.map((tag, idx) => (
                    <div 
                      key={idx}
                      style={{ 
                        paddingLeft: '12px', 
                        paddingRight: '12px', 
                        paddingTop: '8px', 
                        paddingBottom: '8px', 
                        background: '#ECECEC', 
                        borderRadius: '8px', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        gap: '10px', 
                        display: 'flex' 
                      }}
                    >
                      <div style={{ 
                        color: '#5F5F5F', 
                        fontSize: '14px', 
                        fontFamily: 'Raleway', 
                        fontWeight: 500 
                      }}>
                        {tag}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Experiência */}
          {teacher.experience_years && (
            <div style={{ marginBottom: '48px' }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: 600, 
                color: 'var(--ink-800)',
                marginBottom: '16px',
                fontFamily: 'Raleway'
              }}>
                Experiência
              </h3>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                background: '#F7F7F7',
                borderRadius: '12px'
              }}>
                <i className="ph ph-medal" style={{ fontSize: '32px', color: 'var(--green-700)' }}></i>
                <span style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: 'var(--ink-800)',
                  fontFamily: 'Raleway'
                }}>
                  {teacher.experience_years} anos de experiência
                </span>
              </div>
            </div>
          )}

          {/* Certificações */}
          {teacher.certifications && teacher.certifications.length > 0 && (
            <div style={{ marginBottom: '48px' }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: 600, 
                color: 'var(--ink-800)',
                marginBottom: '16px',
                fontFamily: 'Raleway'
              }}>
                Certificações
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {teacher.certifications.map((cert, idx) => (
                  <div 
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      background: '#F7F7F7',
                      borderRadius: '8px'
                    }}
                  >
                    <i className="ph ph-certificate" style={{ fontSize: '24px', color: 'var(--green-700)' }}></i>
                    <span style={{
                      fontSize: '16px',
                      color: 'var(--ink-700)',
                      fontFamily: 'Raleway'
                    }}>
                      {cert}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

