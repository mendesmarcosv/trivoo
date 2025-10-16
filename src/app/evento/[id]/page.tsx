'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import ResponsiveProfileStyles from '@/components/ResponsiveProfileStyles'
import { supabase } from '@/lib/supabase'

interface EventProfile {
  id: string
  title: string
  description?: string
  location?: string
  image_url?: string
  date?: string
  time?: string
  price?: number
  max_participants?: number
  current_participants?: number
  organizer?: string
  category?: string
  difficulty_level?: string
  sport?: string
  duration?: string
  registration_deadline?: string
  pcd_spots?: number
}

export default function EventProfilePage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params?.id as string
  
  const [event, setEvent] = useState<EventProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEventData = async () => {
      if (!eventId) return

      setIsLoading(true)
      try {
        // Buscar dados do evento
        const { data: eventData, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single()

        if (error) throw error
        if (eventData) {
          setEvent(eventData)
        }
      } catch (error) {
        console.error('Erro ao buscar dados do evento:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEventData()
  }, [eventId])

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (!event) {
    return (
      <div className="layout">
        <Sidebar />
        <main className="page-content">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h1>Evento não encontrado</h1>
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

  // Formatar data
  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  return (
    <div className="layout">
      <ResponsiveProfileStyles />
      <Sidebar />
      
      <main className="page-content event-page-mobile">
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
            Detalhes do Evento
          </h1>
        </div>

        {/* Profile Card */}
        <div style={{
          backgroundColor: 'var(--neutral-200)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '24px'
        }}>
          {/* Header com Info e Imagem */}
          <div className="profile-header" style={{ 
            width: '100%',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '40px',
            display: 'inline-flex',
            marginBottom: '48px'
          }}>
            {/* Lado Esquerdo: Info */}
            <div style={{ 
              flex: '1 1 0',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              gap: '24px',
              display: 'inline-flex'
            }}>
              {/* Tag de Categoria */}
              <div style={{ 
                alignSelf: 'stretch',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: '24px',
                display: 'inline-flex'
              }}>
                {(event.sport || event.category) && (
                  <div style={{ 
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
                  }}>
                    <div style={{ 
                      color: '#4C5E18',
                      fontSize: '14px',
                      fontFamily: 'Raleway',
                      fontWeight: 500
                    }}>
                      {event.sport || event.category}
                    </div>
                  </div>
                )}
              </div>

              {/* Nome do Evento */}
              <div className="profile-name" style={{ 
                alignSelf: 'stretch',
                color: '#758A25',
                fontSize: '40px',
                fontFamily: 'Raleway',
                fontWeight: 600,
                lineHeight: '52px'
              }}>
                {event.title}
              </div>

              {/* Organizador, Local e Data */}
              <div style={{ 
                alignSelf: 'stretch',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: '16px',
                display: 'flex'
              }}>
                {/* Organizador */}
                {event.organizer && (
                  <div>
                    <span style={{ 
                      color: '#5F5F5F',
                      fontSize: '16px',
                      fontFamily: 'Raleway',
                      fontWeight: 500,
                      lineHeight: '20.8px'
                    }}>
                      Organizado por{' '}
                    </span>
                    <span style={{ 
                      color: '#758A25',
                      fontSize: '16px',
                      fontFamily: 'Raleway',
                      fontWeight: 500,
                      lineHeight: '20.8px'
                    }}>
                      {event.organizer}
                    </span>
                  </div>
                )}

                {/* Local e Data */}
                <div style={{ 
                  alignSelf: 'stretch',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  gap: '12px',
                  display: 'flex'
                }}>
                  {/* Local */}
                  {event.location && (
                    <div style={{ 
                      alignSelf: 'stretch',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      gap: '8px',
                      display: 'inline-flex'
                    }}>
                      <i className="ph ph-map-pin" style={{ fontSize: '20px', color: '#8B8B8B' }}></i>
                      <div style={{ 
                        flex: '1 1 0',
                        color: '#5F5F5F',
                        fontSize: '16px',
                        fontFamily: 'Raleway',
                        fontWeight: 500,
                        lineHeight: '20.8px'
                      }}>
                        {event.location}
                      </div>
                    </div>
                  )}

                  {/* Data e Hora */}
                  {(event.date || event.time) && (
                    <div style={{ 
                      alignSelf: 'stretch',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      gap: '8px',
                      display: 'inline-flex'
                    }}>
                      <i className="ph ph-calendar" style={{ fontSize: '20px', color: '#8B8B8B' }}></i>
                      <div style={{ 
                        flex: '1 1 0',
                        color: '#5F5F5F',
                        fontSize: '16px',
                        fontFamily: 'Raleway',
                        fontWeight: 500,
                        lineHeight: '20.8px'
                      }}>
                        {event.date && new Date(event.date).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' })}
                        {event.time && ` às ${event.time}`}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Badge Gratuito */}
              <div style={{ 
                alignSelf: 'stretch',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: '24px',
                display: 'inline-flex'
              }}>
                {event.price === 0 && (
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
                      Evento gratuito
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Lado Direito: Imagem e Botão Compartilhar */}
            <div className="event-image-share-mobile" style={{ 
              alignSelf: 'stretch',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              display: 'inline-flex'
            }}>
              {/* Imagem */}
              <div className="profile-image-side" style={{ 
                width: '448px',
                height: '252px',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '16px',
                backgroundColor: '#5E5E5E',
                marginBottom: '16px'
              }}>
                {event.image_url ? (
                  <img 
                    style={{ 
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }} 
                    src={event.image_url}
                    alt={event.title}
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

              {/* Botão Compartilhar */}
              <div style={{ 
                paddingLeft: '16px',
                paddingRight: '16px',
                paddingTop: '6px',
                paddingBottom: '6px',
                background: '#E0E0E0',
                borderRadius: '12px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                display: 'inline-flex',
                cursor: 'pointer'
              }}>
                <i className="ph ph-share-network" style={{ fontSize: '16px', color: '#5F5F5F' }}></i>
                <div style={{ 
                  color: '#5F5F5F',
                  fontSize: '16px',
                  fontFamily: 'Raleway',
                  fontWeight: 500,
                  lineHeight: '25.6px'
                }}>
                  Compartilhar
                </div>
              </div>
            </div>
          </div>

          {/* Divisor */}
          <div style={{ 
            width: '100%',
            height: '1px',
            backgroundColor: '#E0E0E0',
            marginBottom: '48px'
          }}></div>

          {/* Descrição e Banner de Inscrição */}
          <div className="profile-description-wrapper" style={{ 
            width: '100%',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '60px',
            display: 'inline-flex',
            marginBottom: '48px'
          }}>
            {/* Descrição do Evento */}
            <div style={{ 
              flex: '1 1 0',
              borderRadius: '16px',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              gap: '16px',
              display: 'inline-flex'
            }}>
              <div style={{ 
                color: '#3B3B3B',
                fontSize: '18px',
                fontFamily: 'Raleway',
                fontWeight: 600,
                lineHeight: '25.2px'
              }}>
                Descrição do evento
              </div>
              {event.description && (
                <div style={{ 
                  alignSelf: 'stretch',
                  color: '#3B3B3B',
                  fontSize: '16px',
                  fontFamily: 'Raleway',
                  fontWeight: 400,
                  lineHeight: '25.6px',
                  whiteSpace: 'pre-line'
                }}>
                  {event.description}
                </div>
              )}
            </div>

            {/* Banner de Inscrição (Sticky) */}
            <div className="profile-sticky-banner" style={{ 
              width: '345px',
              padding: '24px',
              background: '#F7F7F7',
              borderRadius: '16px',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              gap: '16px',
              display: 'inline-flex',
              position: 'sticky',
              top: '100px',
              alignSelf: 'flex-start'
            }}>
              {/* Texto de Inscrição */}
              {event.registration_deadline && (
                <div style={{ 
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: '16px',
                  display: 'inline-flex'
                }}>
                  <div style={{ 
                    color: '#006FCA',
                    fontSize: '16px',
                    fontFamily: 'Raleway',
                    fontWeight: 600,
                    lineHeight: '22.4px'
                  }}>
                    {event.price === 0 ? 'Inscreva-se grátis' : 'Inscreva-se'} até dia {new Date(event.registration_deadline).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                  </div>
                </div>
              )}

              {/* Botão de Inscrição */}
              <button
                style={{
                  width: '100%',
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
                  display: 'inline-flex'
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
                  Fazer inscrição
                </div>
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
