'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'

interface Banner {
  id: number
  title: string
  subtitle: string
  description: string
  imageUrl: string
  backgroundColor: string
  link: string
}

const banners: Banner[] = [
  {
    id: 1,
    title: "Seu próximo esporte",
    subtitle: "está a um swipe",
    description: "Faça o teste e descubra um novo esporte que combine com você",
    imageUrl: "/images/banners/banner-1.png",
    backgroundColor: "var(--green-500)",
    link: "/swipe"
  },
  {
    id: 2,
    title: "Assistente IA",
    subtitle: "pra ajudar na jornada", 
    description: "Sua companhia inteligente para descobrir esportes incríveis",
    imageUrl: "/images/banners/banner-2.png",
    backgroundColor: "var(--green-900)",
    link: "/assistente"
  }
]

export default function BannerCarousel() {
  const router = useRouter()
  const { user } = useAuth()
  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuário'

  // Auto-rotation every 6 seconds
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 6000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    
    // Reset auto-rotation timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 6000)
  }

  const handleBannerClick = (banner: Banner) => {
    router.push(banner.link)
  }

  return (
    <div className="relative w-full banner-carousel" style={{ zIndex: 1 }}>
      {/* Fade Carousel Container */}
      <div className="relative" style={{ 
        borderRadius: '16px', 
        zIndex: 1, 
        height: '220px',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}>
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            onClick={() => handleBannerClick(banner)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: index === currentIndex ? 1 : 0,
              transition: 'opacity 800ms ease-in-out',
              cursor: 'pointer',
              borderRadius: '16px',
              overflow: 'hidden'
            }}
          >
            <aside className="promo-card" style={{ 
              width: '100%',
              height: '100%',
              backgroundColor: banner.backgroundColor, 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between', 
              padding: '32px',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
              borderRadius: '16px',
              transition: 'transform 0.2s ease-in-out',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
            }}
            >
              <div className="banner-content" style={{ maxWidth: '60%', zIndex: 2, position: 'relative' }}>
                <h2 className="banner-title" style={{ 
                  color: banner.backgroundColor === 'var(--green-500)' ? 'var(--neutral-950)' : '#fff', 
                  lineHeight: '1.2', 
                  fontSize: '28px',
                  userSelect: 'none'
                }}>
                  {banner.title}<br />{banner.subtitle}
                </h2>
                <p className="banner-description" style={{ 
                  color: banner.backgroundColor === 'var(--green-500)' ? 'var(--primary-dark-green)' : '#fff', 
                  marginTop: '8px',
                  userSelect: 'none'
                }}>
                  {banner.description}
                </p>
              </div>
              <img 
                className="promo-figure banner-image" 
                src={banner.imageUrl} 
                alt="Ilustração"
                style={{
                  userSelect: 'none',
                  pointerEvents: 'none'
                } as React.CSSProperties}
                draggable={false}
              />
            </aside>
          </div>
        ))}
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center mt-6 gap-2 banner-dots">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-green-900 scale-125' 
                : 'bg-neutral-300 hover:bg-neutral-400'
            }`}
            aria-label={`Ir para banner ${index + 1}`}
            style={{
              userSelect: 'none'
            }}
          />
        ))}
      </div>
    </div>
  )
}
