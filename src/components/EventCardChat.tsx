import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

interface EventCardChatProps {
  id?: string
  title: string
  date: string
  location: string
  isFree?: boolean
  image?: string
}

export default function EventCardChat({ 
  id,
  title, 
  date, 
  location,
  isFree = false,
  image 
}: EventCardChatProps) {
  const [imageError, setImageError] = useState(false)
  const router = useRouter()
  
  const handleClick = () => {
    if (id) {
      router.push(`/evento/${id}`)
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
      {/* Imagem do evento */}
      {image && !imageError ? (
        <img
          src={image}
          alt={title}
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
          <i className="ph ph-calendar"></i>
        </div>
      )}

      {/* Título e Badge Gratuito */}
      <div style={{
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        display: 'flex',
        gap: '8px'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 600,
          color: '#3B3B3B',
          margin: 0,
          fontFamily: 'Raleway',
          lineHeight: '24px'
        }}>
          {title}
        </h3>
        
        {isFree && (
          <span style={{
            padding: '4px 12px',
            backgroundColor: '#95B02F',
            color: '#FCFCFC',
            fontSize: '12px',
            fontWeight: 600,
            borderRadius: '6px',
            fontFamily: 'Raleway'
          }}>
            GRATUITO
          </span>
        )}
      </div>

      {/* Data */}
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
        <i className="ph ph-calendar-blank" style={{ fontSize: '17px', color: '#8B8B8B' }}></i>
        <span style={{ flex: '1 1 0' }}>{date}</span>
      </div>

      {/* Localização */}
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
        <span style={{ flex: '1 1 0' }}>{location}</span>
      </div>
    </div>
  )
}

