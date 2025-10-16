'use client'

import React, { useEffect } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useProfileData } from '@/lib/hooks/useProfileData'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Avatar from '@/components/Avatar'
import LoadingSkeleton from '@/components/LoadingSkeleton'

export default function ProfilePage() {
  const router = useRouter()
  const { user, userProfile, loading } = useAuth()
  
  // Buscar todos os dados do perfil em paralelo
  const {
    interestSports: userInterestSports,
    practicedSports: userPracticedSports,
    accessibilityModeEnabled,
    disabilityCondition,
    localResources,
    coachOfferings,
    isLoading: isLoadingProfileData
  } = useProfileData(user?.id)

  useEffect(() => {
    if (!loading && !user) {
      const timer = setTimeout(() => {
      router.push('/auth/login')
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [user, loading, router])

  // Mostrar loading enquanto auth ou dados do perfil estão carregando
  if (loading || isLoadingProfileData) {
    return <LoadingSkeleton />
  }

  // Redirect se não estiver autenticado
  if (!user) {
    return null
  }

  // Agora renderiza tudo de uma vez com os dados já carregados
  return (
    <div className="layout">
      <Sidebar />
      
      <main className="page-content profile-page-mobile">
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <h1 style={{ 
            fontSize: '30px', 
            fontWeight: 600, 
            color: 'var(--ink-800)',
            fontFamily: 'Raleway'
          }}>
            Meu Perfil
          </h1>
        </div>

        {/* Profile Card */}
        <div style={{
          backgroundColor: 'var(--neutral-200)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '24px'
        }}>
          {/* Header com Avatar e Nome */}
          <div className="profile-header-mobile" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
            <div className="profile-top-section" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div className="profile-avatar-mobile">
                <Avatar 
                  avatarUrl={userProfile?.avatar_url} 
                  name={userProfile?.name || 'Usuário'} 
                  size="xxl" 
                />
              </div>
              
              <div className="profile-name-mobile">
                <h2 style={{ 
                  fontSize: '32px', 
                  fontWeight: 700, 
                  color: 'var(--green-800)',
                  marginBottom: '8px',
                  fontFamily: 'Raleway'
                }}>
                  {userProfile?.name || 'Usuário'}
                </h2>
                
                {/* Botão Editar Perfil */}
                <button
                  className="edit-profile-btn-mobile"
                  onClick={() => router.push('/configuracoes/editar-perfil')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '6px 16px',
                    background: '#E0E0E0',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#D0D0D0'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#E0E0E0'}
                >
                  <i className="ph ph-pencil-simple" style={{ fontSize: '16px', color: '#5F5F5F' }}></i>
                  <span style={{ 
                    color: '#5F5F5F', 
                    fontSize: '16px', 
                    fontFamily: 'Raleway', 
                    fontWeight: 500, 
                    lineHeight: '25.6px' 
                  }}>
                    Editar Perfil
                  </span>
                </button>
              </div>

              {/* Badge de Acessibilidade Ativa */}
              {accessibilityModeEnabled && (
                <div className="accessibility-badge-mobile" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  background: '#B2E8FF',
                  borderRadius: '12px'
                }}>
                  <i className="ph ph-seal-check" style={{ fontSize: '28px', color: '#1D1D1D' }}></i>
                  <span style={{ 
                    color: '#1D1D1D', 
                    fontSize: '18px', 
                    fontFamily: 'Raleway', 
                    fontWeight: 600, 
                    lineHeight: '34px' 
                  }}>
                    Acessibilidade Ativa
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Info Grid */}
          <div className="profile-info-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '24px',
            marginBottom: '48px'
          }}>
            {/* Condicionamento físico */}
            <div style={{
              background: '#F7F7F7',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                background: '#ECECEC',
                borderRadius: '85.71px',
                padding: '10.29px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="ph ph-heartbeat" style={{ fontSize: '28px', color: '#758A25' }}></i>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  color: '#5F5F5F', 
                  fontSize: '16px', 
                  fontFamily: 'Raleway', 
                  fontWeight: 500, 
                  lineHeight: '22.4px',
                  marginBottom: '8px'
                }}>
                  Condicionamento físico
                </div>
                <div style={{ 
                  color: '#3B3B3B', 
                  fontSize: '20px', 
                  fontFamily: 'Raleway', 
                  fontWeight: 500, 
                  lineHeight: '24px' 
                }}>
                  {userProfile?.fitness_level || 'Não informado'}
                </div>
              </div>
            </div>

            {/* Mora em */}
            <div style={{
              background: '#F7F7F7',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                background: '#ECECEC',
                borderRadius: '85.71px',
                padding: '10.29px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="ph ph-map-pin" style={{ fontSize: '28px', color: '#758A25' }}></i>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  color: '#5F5F5F', 
                  fontSize: '16px', 
                  fontFamily: 'Raleway', 
                  fontWeight: 500, 
                  lineHeight: '22.4px',
                  marginBottom: '8px'
                }}>
                  Mora em
                </div>
                <div style={{ 
                  color: '#3B3B3B', 
                  fontSize: '20px', 
                  fontFamily: 'Raleway', 
                  fontWeight: 500, 
                  lineHeight: '24px' 
                }}>
                  {userProfile?.city || 'Não informado'}
                </div>
              </div>
            </div>

            {/* Data de nascimento */}
            <div style={{
              background: '#F7F7F7',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                background: '#ECECEC',
                borderRadius: '85.71px',
                padding: '10.29px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="ph ph-calendar" style={{ fontSize: '28px', color: '#758A25' }}></i>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  color: '#5F5F5F', 
                  fontSize: '16px', 
                  fontFamily: 'Raleway', 
                  fontWeight: 500, 
                  lineHeight: '22.4px',
                  marginBottom: '8px'
                }}>
                  Data de nascimento
                </div>
                <div style={{ 
                  color: '#3B3B3B', 
                  fontSize: '20px', 
                  fontFamily: 'Raleway', 
                  fontWeight: 500, 
                  lineHeight: '24px' 
                }}>
                  {userProfile?.birth_date ? new Date(userProfile.birth_date).toLocaleDateString('pt-BR') : 'Não informado'}
                </div>
              </div>
            </div>
          </div>

          {/* Esportes Grid */}
          <div className="profile-sports-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '24px',
            marginBottom: '48px'
          }}>
            {/* Esportes de interesse */}
            <div>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: 600, 
                color: '#3B3B3B',
                marginBottom: '16px',
                fontFamily: 'Raleway'
              }}>
                Esportes de interesse
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {userInterestSports.length > 0 ? (
                  userInterestSports.map((sport) => (
                    <div 
                      key={sport.id}
                      style={{
                        padding: '8px 12px',
                        background: '#758A25',
                        borderRadius: '8px',
                        color: '#FCFCFC',
                        fontSize: '14px',
                        fontFamily: 'Raleway',
                        fontWeight: 500
                      }}
                    >
                      {sport.name}
                    </div>
                  ))
                ) : (
                  <span style={{ 
                    color: '#5F5F5F', 
                    fontSize: '14px',
                    fontFamily: 'Raleway'
                  }}>
                    Nenhum esporte selecionado
                  </span>
                )}
              </div>
            </div>

            {/* Esportes praticados anteriormente */}
            <div>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: 600, 
                color: '#3B3B3B',
                marginBottom: '16px',
                fontFamily: 'Raleway'
              }}>
                Esportes praticados anteriormente
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {userPracticedSports.length > 0 ? (
                  userPracticedSports.map((sport) => (
                    <div 
                      key={sport.id}
                      style={{
                        padding: '8px 12px',
                        background: '#E0E0E0',
                        borderRadius: '8px',
                        color: '#4C5E18',
                        fontSize: '14px',
                        fontFamily: 'Raleway',
                        fontWeight: 500
                      }}
                    >
                      {sport.name}
                    </div>
                  ))
                ) : (
                  <span style={{ 
                    color: '#5F5F5F', 
                    fontSize: '14px',
                    fontFamily: 'Raleway'
                  }}>
                    Nenhum esporte praticado anteriormente
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Card de Informações de Acessibilidade */}
          {accessibilityModeEnabled && disabilityCondition && (
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '32px',
              marginBottom: '48px'
            }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{
                  background: '#ECECEC',
                  borderRadius: '85.71px',
                  padding: '10.29px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className="ph ph-info" style={{ fontSize: '28px', color: '#006FCA' }}></i>
                </div>
                <h3 style={{ 
                  color: '#006FCA', 
                  fontSize: '18px', 
                  fontFamily: 'Raleway', 
                  fontWeight: 600, 
                  lineHeight: '25.2px' 
                }}>
                  Informações de Acessibilidade
                </h3>
              </div>

              {/* Condição e informação adicional */}
              <div style={{
                display: 'flex',
                gap: '40px'
              }}>
                <div>
                  <h4 style={{ 
                    color: '#3B3B3B', 
                    fontSize: '14px', 
                    fontFamily: 'Raleway', 
                    fontWeight: 600, 
                    lineHeight: '19.6px',
                    marginBottom: '4px'
                  }}>
                    Condição de Deficiência
                  </h4>
                  <div style={{ opacity: 0.8 }}>
                    <span style={{ 
                      color: 'black', 
                      fontSize: '16px', 
                      fontFamily: 'Raleway', 
                      fontWeight: 400, 
                      lineHeight: '22.4px' 
                    }}>
                      {disabilityCondition}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recursos desejados nos locais */}
              {localResources.length > 0 && (
                <div>
                  <h4 style={{ 
                    color: '#3B3B3B', 
                    fontSize: '14px', 
                    fontFamily: 'Raleway', 
                    fontWeight: 600, 
                    lineHeight: '19.6px',
                    marginBottom: '16px'
                  }}>
                    Recursos desejados nos locais
                  </h4>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '12px' 
                  }}>
                    {localResources.map((resource, idx) => (
                      <div 
                        key={idx}
                        style={{
                          padding: '8px 12px',
                          background: '#ECECEC',
                          borderRadius: '8px',
                          color: '#5F5F5F',
                          fontSize: '14px',
                          fontFamily: 'Raleway',
                          fontWeight: 500
                        }}
                      >
                        {resource}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* O que os professores devem oferecer */}
              {coachOfferings.length > 0 && (
                <div>
                  <h4 style={{ 
                    color: '#3B3B3B', 
                    fontSize: '14px', 
                    fontFamily: 'Raleway', 
                    fontWeight: 600, 
                    lineHeight: '19.6px',
                    marginBottom: '16px'
                  }}>
                    O que os professores devem oferecer
                  </h4>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '12px' 
                  }}>
                    {coachOfferings.map((offering, idx) => (
                      <div 
                        key={idx}
                        style={{
                          padding: '8px 12px',
                          background: '#ECECEC',
                          borderRadius: '8px',
                          color: '#5F5F5F',
                          fontSize: '14px',
                          fontFamily: 'Raleway',
                          fontWeight: 500
                        }}
                      >
                        {offering}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Divisória */}
          <div style={{
            width: '100%',
            height: '1px',
            backgroundColor: '#E0E0E0',
            marginTop: '16px',
            marginBottom: '32px'
          }}></div>

          {/* Restrição de saúde */}
          <div className="health-restriction-section">
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: 600, 
              color: '#000',
              marginBottom: '16px',
              fontFamily: 'Raleway'
            }}>
              Possui alguma restrição de saúde ou lesão?
            </h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: 0.8
            }}>
              <i className="ph ph-x-square" style={{ fontSize: '24px', color: '#5F5F5F' }}></i>
              <span style={{ 
                color: '#758A25', 
                fontSize: '16px', 
                fontFamily: 'Raleway', 
                fontWeight: 400, 
                lineHeight: '22.4px' 
              }}>
                Não
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
