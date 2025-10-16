import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ClubCardChatProps {
  id?: string
  name: string
  sports: string
  distance: string
  image?: string
}

export default function ClubCardChat({ 
  id,
  name, 
  sports, 
  distance,
  image 
}: ClubCardChatProps) {
  const [imageError, setImageError] = useState(false)
  const router = useRouter()
  
  const handleClick = () => {
    if (id) {
      router.push(`/ct/${id}`)
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
      {/* Imagem do clube */}
      {image && !imageError ? (
        <img
          src={image}
          alt={name}
          style={{
            width: '100%',
            height: '120px',
            borderRadius: '12px',
            objectFit: 'cover',
            backgroundColor: '#D1D5DB'
          }}
          loading="eager"
          onError={() => setImageError(true)}
        />
      ) : (
        <div style={{
          width: '100%',
          height: '120px',
          borderRadius: '12px',
          backgroundColor: '#D1D5DB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px',
          color: '#6B7280'
        }}>
          <i className="ph ph-basketball"></i>
        </div>
      )}

      {/* Nome e Esportes */}
      <div style={{
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        display: 'flex',
        gap: '4px'
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
          {sports}
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

