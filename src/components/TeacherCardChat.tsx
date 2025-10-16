import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface TeacherCardChatProps {
  id?: string
  name: string
  specialty: string
  rating: number
  distance: string
  profileImage?: string
}

export default function TeacherCardChat({ 
  id,
  name, 
  specialty, 
  rating, 
  distance,
  profileImage 
}: TeacherCardChatProps) {
  const [imageError, setImageError] = useState(false)
  const router = useRouter()
  
  const handleClick = () => {
    if (id) {
      router.push(`/professor/${id}`)
    }
  }

  return (
    <div 
      onClick={handleClick}
      style={{
        backgroundColor: '#ECECEC',
        borderRadius: '16px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        border: 'none',
        width: '100%',
        cursor: id ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s'
      }}
      onMouseEnter={(e) => {
        if (id) {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
        }
      }}
      onMouseLeave={(e) => {
        if (id) {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }
      }}
    >
      {/* Header com foto e avaliação */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {profileImage && !imageError ? (
          <img
            src={profileImage}
            alt={name}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              objectFit: 'cover',
              backgroundColor: '#D1D5DB',
              imageRendering: '-webkit-optimize-contrast',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)'
            }}
            loading="eager"
            onError={() => setImageError(true)}
          />
        ) : (
          <div style={{
            display: 'flex',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#D1D5DB',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: 600,
            color: '#6B7280'
          }}>
            {name.charAt(0)}
          </div>
        )}
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '16px',
          fontWeight: 600,
          color: '#3B3B3B',
          lineHeight: '16px'
        }}>
          {rating.toFixed(1)}
          <i className="ph-fill ph-star" style={{ color: '#FFD400', fontSize: '16px' }}></i>
        </div>
      </div>

      {/* Nome e Especialidade */}
      <div style={{
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        display: 'flex'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 600,
          color: '#3B3B3B',
          margin: 0,
          fontFamily: 'Raleway',
          lineHeight: '24px'
        }}>
          {name}
        </h3>
        <p style={{
          fontSize: '14px',
          color: '#3B3B3B',
          margin: 0,
          fontFamily: 'Raleway',
          lineHeight: '24px'
        }}>
          {specialty}
        </p>
      </div>

      {/* Distância */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '4px',
        color: '#5F5F5F',
        fontSize: '14px',
        fontFamily: 'Raleway',
        fontWeight: 400,
        lineHeight: '18.2px'
      }}>
        <i className="ph ph-map-pin" style={{ fontSize: '17px', color: '#8B8B8B' }}></i>
        <span style={{ flex: '1 1 0' }}>{distance}</span>
      </div>
    </div>
  )
}

