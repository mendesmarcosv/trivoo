'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import BannerCarousel from './BannerCarousel'
import LocationSelector from './LocationSelector'
import Avatar from './Avatar'
import { useRouter } from 'next/navigation'

export default function GreetingSection() {
  const { user } = useAuth()
  const router = useRouter()

  // Obter primeiro nome
  const getFirstName = () => {
    if (user?.name) {
      return user.name.split(' ')[0]
    }
    return 'Usuário'
  }

  // Esportes fictícios para demonstração
  const mockSports = [
    { id: '1', name: 'Escalada esportiva (indoor)' },
    { id: '2', name: 'Parkour' },
    { id: '3', name: 'Slackline' },
    { id: '4', name: 'Esgrima' }
  ]

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
              name={user?.name}
              email={user?.email}
              size="md"
              className="avatar"
            />
            <h1 className="hello-title">Olá, {getFirstName()}!</h1>
          </div>

          <div className="interests">
            <div className="interests-title">
              <span>Esportes de interesse</span>
              <button 
                className="icon-btn" 
                type="button" 
                aria-label="editar interesses"
                onClick={() => router.push('/profile')}
                style={{ color: '#4a4a4a' }}
              >
                <i className="ph ph-pencil-simple"></i>
              </button>
            </div>
            <div className="chips">
              {mockSports.slice(0, 4).map(sport => (
                <span key={sport.id} className="chip">{sport.name}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Banner Carousel */}
        <BannerCarousel />
      </section>
    </>
  )
}

