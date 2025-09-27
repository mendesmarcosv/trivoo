'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'

interface Banner {
  id: number
  title: string
  subtitle: string
  description: string
  imageUrl: string
  backgroundColor: string
}

const banners: Banner[] = [
  {
    id: 1,
    title: "Seu próximo esporte",
    subtitle: "está a um swipe",
    description: "Faça o teste e descubra um novo esporte que combine com você",
    imageUrl: "/images/banners/banner-1.png",
    backgroundColor: "var(--green-500)"
  },
  {
    id: 2,
    title: "Assistente IA",
    subtitle: "pra ajudar na jornada",
    description: "Sua companhia inteligente para descobrir esportes incríveis",
    imageUrl: "/images/banners/banner-2.png",
    backgroundColor: "var(--green-900)"
  }
]

export default function BannerCarousel() {
  const { user } = useAuth()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuário'

  // Auto-rotation every 6 seconds
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!isDragging) {
        setCurrentIndex((prev) => (prev + 1) % banners.length)
      }
    }, 6000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isDragging])

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true)
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    setDragStartX(clientX)
    setDragOffset(0)
    
    // Pause auto-rotation during drag
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const deltaX = clientX - dragStartX
    setDragOffset(deltaX)
  }

  const handleDragEnd = () => {
    if (!isDragging) return
    
    setIsDragging(false)
    
    // Determine if we should change slide based on drag distance
    const threshold = 50
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        // Drag right - go to previous slide
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
      } else {
        // Drag left - go to next slide
        setCurrentIndex((prev) => (prev + 1) % banners.length)
      }
    }
    
    setDragOffset(0)
    
    // Resume auto-rotation
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 6000)
  }

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

  return (
    <div className="relative w-full">
      {/* Carousel Container */}
      <div className="relative overflow-hidden" style={{ borderRadius: '16px' }}>
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            borderRadius: '16px',
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: isDragging ? 'none' : 'transform 500ms ease-in-out'
          }}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className="w-full flex-shrink-0"
            >
              <aside className="promo-card" style={{ maxWidth: '100%', backgroundColor: banner.backgroundColor, height: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '32px', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
                <div style={{ maxWidth: '60%' }}>
                  <h2 style={{ color: banner.backgroundColor === 'var(--green-500)' ? 'var(--neutral-950)' : '#fff', lineHeight: '1.2', fontSize: '28px' }}>
                    {banner.title}<br />{banner.subtitle}
                  </h2>
                  <p style={{ color: banner.backgroundColor === 'var(--green-500)' ? 'var(--primary-dark-green)' : '#fff', marginTop: '8px' }}>
                    {banner.description}
                  </p>
                </div>
                <img className="promo-figure" src={banner.imageUrl} alt="Ilustração" />
              </aside>
            </div>
          ))}
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center mt-6 gap-2">
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
          />
        ))}
      </div>
    </div>
  )
}
