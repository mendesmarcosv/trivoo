'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import ResponsiveProfileStyles from '@/components/ResponsiveProfileStyles'
import { supabase } from '@/lib/supabase'

interface ClubProfile {
  id: string
  name: string
  description?: string
  address?: string
  location?: string
  image_url?: string
  rating?: number
  total_reviews?: number
  sports?: string[]
  opening_hours?: string
  contact_phone?: string
  contact_email?: string
  website?: string
  distance_km?: number
  offers_trial_class?: boolean
  accessibility_friendly?: boolean
  accessibility_features?: string[]
  review_tags?: string[]
  accessibility_review_tags?: string[]
}

export default function ClubProfilePage() {
  const params = useParams()
  const router = useRouter()
  const clubId = params?.id as string
  
  const [club, setClub] = useState<ClubProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchClubData = async () => {
      if (!clubId) return

      setIsLoading(true)
      try {
        // Buscar dados do clube
        const { data: clubData, error } = await supabase
          .from('clubs')
          .select('*')
          .eq('id', clubId)
          .single()

        if (error) throw error
        if (clubData) {
          setClub(clubData)
        }
      } catch (error) {
        console.error('Erro ao buscar dados do clube:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchClubData()
  }, [clubId])

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (!club) {
    return (
      <div className="layout">
        <Sidebar />
        <main className="page-content">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h1>Centro de Treinamento não encontrado</h1>
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
            Conheça o Centro de Treinamento
          </h1>
        </div>

        {/* Profile Card */}
        <div className="club-profile-card-mobile" style={{
          backgroundColor: 'var(--neutral-200)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '24px'
        }}>
          {/* Header com Info e Imagem */}
          <div className="profile-header club-header-mobile" style={{ 
            width: '100%',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '40px',
            display: 'inline-flex',
            marginBottom: '48px'
          }}>
            {/* Lado Esquerdo: Info */}
            <div className="club-info-wrapper-mobile" style={{ 
              flex: '1 1 0',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              gap: '24px',
              display: 'inline-flex'
            }}>
              {/* Rating */}
              {club.rating && (
                <div style={{ 
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
                      {club.rating.toFixed(1)}
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
              )}

              {/* Nome */}
              <div className="profile-name" style={{ 
                alignSelf: 'stretch',
                color: '#758A25',
                fontSize: '40px',
                fontFamily: 'Raleway',
                fontWeight: 600,
                lineHeight: '52px'
              }}>
                {club.name}
              </div>

              {/* Descrição */}
              {club.description && (
                <div style={{ 
                  alignSelf: 'stretch',
                  color: '#3B3B3B',
                  fontSize: '16px',
                  fontFamily: 'Raleway',
                  fontWeight: 500,
                  lineHeight: '25.6px'
                }}>
                  {club.description}
                </div>
              )}

              {/* Badges */}
              <div style={{ 
                alignSelf: 'stretch',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: '12px',
                display: 'inline-flex',
                flexWrap: 'wrap',
                alignContent: 'flex-start'
              }}>
                {/* Badge: Oferece aula experimental */}
                {club.offers_trial_class && (
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

                {/* Badge: Acessibilidade */}
                {club.accessibility_friendly && (
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
            </div>

            {/* Lado Direito: Imagem */}
            <div className="club-image-wrapper-mobile" style={{ 
              alignSelf: 'stretch',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-end',
              gap: '16px',
              display: 'inline-flex'
            }}>
              <div className="profile-image-side club-image-mobile" style={{ 
                width: '448px',
                height: '252px',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '16px',
                backgroundColor: '#5E5E5E'
              }}>
                {club.image_url ? (
                  <img 
                    style={{ 
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }} 
                    src={club.image_url}
                    alt={club.name}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '64px',
                    color: '#9CA3AF'
                  }}>
                    <i className="ph ph-image"></i>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Seção de Esportes e Ações */}
          <div style={{ 
            width: '100%',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '32px',
            display: 'inline-flex',
            marginBottom: '48px'
          }}>
            {/* Divisor Superior */}
            <div style={{ 
              alignSelf: 'stretch',
              height: '1px',
              backgroundColor: '#E0E0E0'
            }}></div>

            {/* Esportes e Botões */}
            <div className="club-sports-actions-wrapper" style={{ 
              alignSelf: 'stretch',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: '16px',
              display: 'inline-flex'
            }}>
              {/* Lado Esquerdo: Esportes oferecidos */}
              <div className="club-sports-section-mobile" style={{ 
                flex: '1 1 0',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: '12px',
                display: 'inline-flex'
              }}>
                <div style={{ 
                  alignSelf: 'stretch',
                  color: '#758A25',
                  fontSize: '24px',
                  fontFamily: 'Raleway',
                  fontWeight: 600,
                  lineHeight: '33.6px'
                }}>
                  Esportes oferecidos
                </div>
                <div className="club-sports-tags-mobile" style={{ 
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  gap: '10px',
                  display: 'inline-flex',
                  flexWrap: 'wrap',
                  alignContent: 'flex-start'
                }}>
                  {club.sports && club.sports.map((sport, idx) => (
                    <div 
                      key={idx}
                      style={{ 
                        paddingLeft: '12px',
                        paddingRight: '12px',
                        paddingTop: '8px',
                        paddingBottom: '8px',
                        background: '#758A25',
                        borderRadius: '8px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '10px',
                        display: 'flex'
                      }}
                    >
                      <div style={{ 
                        color: '#FCFCFC',
                        fontSize: '16px',
                        fontFamily: 'Raleway',
                        fontWeight: 500
                      }}>
                        {sport}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lado Direito: Botões de Ação */}
              <div className="profile-actions" style={{ 
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

            {/* Divisor Inferior */}
            <div style={{ 
              alignSelf: 'stretch',
              height: '1px',
              backgroundColor: '#E0E0E0'
            }}></div>
          </div>

          {/* Seção de Informações */}
          <div style={{ 
            width: '100%',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '32px',
            display: 'inline-flex',
            marginBottom: '48px'
          }}>
            {/* Localização */}
            <div className="club-info-card-mobile" style={{ 
              alignSelf: 'stretch',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: '16px',
              display: 'inline-flex'
            }}>
              <div style={{ 
                padding: '10.29px',
                background: '#F7F7F7',
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
                    Localização
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
                      {club.address || club.location || 'Niterói, RJ'}
                    </div>
                    <button
                      onClick={() => {
                        const address = encodeURIComponent(club.address || club.location || 'Niterói, RJ')
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

            {/* Horário de funcionamento */}
            {club.opening_hours && (
              <div className="club-info-card-mobile" style={{ 
                alignSelf: 'stretch',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '16px',
                display: 'inline-flex'
              }}>
                <div style={{ 
                  padding: '10.29px',
                  background: '#F7F7F7',
                  borderRadius: '85.71px',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: '8.57px',
                  display: 'flex'
                }}>
                  <i className="ph ph-clock" style={{ fontSize: '28px', color: '#758A25' }}></i>
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
                      Horário de funcionamento
                    </div>
                    <div style={{ 
                      alignSelf: 'stretch',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      gap: '12px',
                      display: 'inline-flex',
                      flexWrap: 'wrap'
                    }}>
                      {club.opening_hours.split('|').map((schedule, idx, arr) => (
                        <React.Fragment key={idx}>
                          <div style={{ 
                            color: '#3B3B3B',
                            fontSize: '20px',
                            fontFamily: 'Raleway',
                            fontWeight: 500,
                            lineHeight: '24px'
                          }}>
                            {schedule.trim()}
                          </div>
                          {idx < arr.length - 1 && (
                            <div style={{ 
                              width: '5px',
                              height: '5px',
                              background: '#95B02F',
                              borderRadius: '9999px'
                            }}></div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Telefone */}
            {club.contact_phone && (
              <div className="club-info-card-mobile" style={{ 
                alignSelf: 'stretch',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '16px',
                display: 'inline-flex'
              }}>
                <div style={{ 
                  padding: '10.29px',
                  background: '#F7F7F7',
                  borderRadius: '85.71px',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: '8.57px',
                  display: 'flex'
                }}>
                  <i className="ph ph-phone" style={{ fontSize: '28px', color: '#758A25' }}></i>
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
                        flex: '1 1 0',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '12px',
                        display: 'flex'
                      }}>
                        <div style={{ 
                          color: '#3B3B3B',
                          fontSize: '20px',
                          fontFamily: 'Raleway',
                          fontWeight: 500,
                          lineHeight: '24px'
                        }}>
                          {club.contact_phone}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Card de Acessibilidade */}
          {(club.accessibility_friendly || (club.accessibility_features && club.accessibility_features.length > 0)) && (
            <div className="club-section-card-mobile" style={{ 
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

              {/* Infraestrutura acessível */}
              {club.accessibility_features && club.accessibility_features.length > 0 && (
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
                    Infraestrutura acessível
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
                    {club.accessibility_features.map((feature, idx) => (
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
                          {feature}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Card de Avaliações */}
          <div className="club-section-card-mobile club-last-card-mobile" style={{ 
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
                        {club.rating?.toFixed(1) || '0.0'}
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
                    | {club.total_reviews || 0} avaliações
                  </div>
                </div>
              </div>
            </div>

            {/* Divisor */}
            <div style={{ 
              alignSelf: 'stretch',
              height: '1px',
              backgroundColor: '#E0E0E0'
            }}></div>

            {/* Opinões sobre a aula e atendimento */}
            {club.review_tags && club.review_tags.length > 0 && (
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
                  {club.review_tags.map((tag, idx) => (
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

            {/* Opinões sobre aulas inclusivas */}
            {club.accessibility_friendly && club.accessibility_review_tags && club.accessibility_review_tags.length > 0 && (
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
                  {club.accessibility_review_tags.map((tag, idx) => (
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

        </div>
      </main>
    </div>
  )
}

