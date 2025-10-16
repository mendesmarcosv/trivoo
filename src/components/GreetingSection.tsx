'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import BannerCarousel from './BannerCarousel'
import LocationSelector from './LocationSelector'
import Avatar from './Avatar'
import { useRouter } from 'next/navigation'

export default function GreetingSection() {
  const { user, userProfile, loading: authLoading } = useAuth()
  const router = useRouter()

  const isUserDataLoading = authLoading || !user

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
            {/* Avatar com skeleton */}
            {isUserDataLoading ? (
              <div className="avatar-skeleton" style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--neutral-300)',
                animation: 'pulse 1.5s ease-in-out infinite alternate'
              }}></div>
            ) : (
              <Avatar 
                name={userProfile?.name || user?.user_metadata?.name || 'Usuário'}
                email={user?.email}
                size="lg"
                className="avatar"
                avatarUrl={userProfile?.avatar_url}
              />
            )}

            {/* Nome com skeleton */}
            {isUserDataLoading ? (
              <div style={{
                width: '150px',
                height: '36px',
                backgroundColor: 'var(--neutral-300)',
                borderRadius: '8px',
                animation: 'pulse 1.5s ease-in-out infinite alternate 0.2s'
              }}></div>
            ) : (
              <h1 className="hello-title">Olá, {getFirstName()}!</h1>
            )}
          </div>

          {/* Botão Ver meu perfil - apenas mobile */}
          {!isUserDataLoading && (
            <button
              className="view-profile-btn-mobile"
              onClick={() => router.push('/profile')}
              style={{
                display: 'none',
                padding: '10px 20px',
                background: '#E0E0E0',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'all 0.2s',
                marginTop: '24px',
                marginBottom: '0'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#D0D0D0'}
              onMouseOut={(e) => e.currentTarget.style.background = '#E0E0E0'}
            >
              <span style={{ 
                color: '#5F5F5F', 
                fontSize: '14px', 
                fontFamily: 'Raleway', 
                fontWeight: 500 
              }}>
                Ver meu perfil
              </span>
            </button>
          )}

        </div>

        {/* Banner Carousel */}
        <BannerCarousel />
      </section>
    </>
  )
}

