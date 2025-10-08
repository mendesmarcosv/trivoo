'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { useState, useEffect } from 'react'
import BannerCarousel from './BannerCarousel'
import LocationSelector from './LocationSelector'
import Avatar from './Avatar'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Sport {
  id: string
  name: string
}

export default function GreetingSection() {
  const { user, userProfile } = useAuth()
  const [userSports, setUserSports] = useState<Sport[]>([])
  const router = useRouter()

  // Obter primeiro nome
  const getFirstName = () => {
    if (userProfile?.name) {
      return userProfile.name.split(' ')[0]
    }
    if (user?.user_metadata?.name) {
      return user.user_metadata.name.split(' ')[0]
    }
    if (user?.email) {
      return user.email.split('@')[0]
    }
    return 'Usuário'
  }

  // Buscar esportes do usuário
  useEffect(() => {
    const fetchUserSports = async () => {
      if (!user?.id) return

      const { data, error } = await supabase
        .from('user_sports')
        .select(`
          sport_id,
          sports:sport_id (
            id,
            name
          )
        `)
        .eq('user_id', user.id)

      if (data) {
        const sports = data
          .filter((item: any) => item.sports)
          .map((item: any) => ({
            id: item.sports.id,
            name: item.sports.name
          }))
        setUserSports(sports)
      }
    }

    fetchUserSports()
  }, [user?.id])

  return (
    <>
      {/* Logo no mobile */}
      <div className="mobile-logo">
        <img src="/images/logo-trivoo-dark.svg" alt="Trivoo" className="logo-mobile" />
      </div>

      {/* Location chip */}
      <div className="toolbar">
        <LocationSelector />
      </div>

      {/* Greeting + Promo */}
      <section className="greeting-and-promo">
        <div className="greeting">
          <div className="hello">
            <Avatar 
              name={userProfile?.name || user?.user_metadata?.name}
              email={user?.email}
              size="md"
              className="avatar"
            />
            <h1 className="hello-title">Olá, {getFirstName()}!</h1>
          </div>

          <div className="interests">
            <div className="interests-title">
              <span>Esportes de interesse</span>
              {userSports.length > 0 && (
                <button 
                  className="icon-btn" 
                  type="button" 
                  aria-label="editar interesses"
                  onClick={() => router.push('/profile')}
                  style={{ color: '#4a4a4a' }}
                >
                  <i className="ph ph-pencil-simple"></i>
                </button>
              )}
            </div>
            <div className="chips">
              {userSports.length > 0 ? (
                <>
                  {userSports.slice(0, 5).map(sport => (
                    <span key={sport.id} className="chip">{sport.name}</span>
                  ))}
                  {userSports.length > 5 && (
                    <span className="chip">+{userSports.length - 5} mais</span>
                  )}
                </>
              ) : (
                <button
                  onClick={() => router.push('/profile')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    backgroundColor: '#F0F0F0',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#555555',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = '#E6E6E6';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = '#F0F0F0';
                  }}
                >
                  <i className="ph ph-plus" style={{ fontSize: '16px' }}></i>
                  <span>Adicionar esportes de interesse</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Banner Carousel */}
        <BannerCarousel />
      </section>
    </>
  )
}

