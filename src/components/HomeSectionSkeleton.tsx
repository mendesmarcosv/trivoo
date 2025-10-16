interface HomeSectionSkeletonProps {
  title: string
  cardType?: 'teacher' | 'club' | 'event'
}

export default function HomeSectionSkeleton({ title, cardType = 'teacher' }: HomeSectionSkeletonProps) {
  const getCardHeight = () => {
    switch (cardType) {
      case 'teacher': return '200px'
      case 'club': return '280px'
      case 'event': return '320px'
      default: return '200px'
    }
  }

  const getCardWidth = () => {
    switch (cardType) {
      case 'teacher': return '280px'
      case 'club': return '300px'
      case 'event': return '320px'
      default: return '280px'
    }
  }

  return (
    <section className="section" style={{
      opacity: 1,
      animation: 'fadeIn 0.3s ease-in-out'
    }}>
      {/* Header */}
      <div className="section-header">
        <h3>{title}</h3>
        <div style={{
          width: '80px',
          height: '20px',
          backgroundColor: 'var(--neutral-300)',
          borderRadius: '4px',
          animation: 'pulse 1.5s ease-in-out infinite alternate'
        }}></div>
      </div>

      {/* Cards Skeleton */}
      <div style={{
        display: 'flex',
        gap: '16px',
        overflowX: 'hidden',
        paddingLeft: '40px' // Mesma margin que o swiper real
      }}>
        {[...Array(4)].map((_, idx) => (
          <div 
            key={idx}
            style={{
              width: getCardWidth(),
              height: getCardHeight(),
              backgroundColor: 'var(--neutral-200)',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              flexShrink: 0,
              animation: `pulse 1.5s ease-in-out infinite alternate ${idx * 0.1}s`
            }}
          >
            {/* Imagem/Avatar skeleton */}
            {cardType === 'teacher' ? (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: 'var(--neutral-300)',
                  borderRadius: '50%'
                }}></div>
                <div style={{
                  width: '60px',
                  height: '20px',
                  backgroundColor: 'var(--neutral-300)',
                  borderRadius: '4px'
                }}></div>
              </div>
            ) : (
              <div style={{
                width: '100%',
                height: cardType === 'club' ? '120px' : '140px',
                backgroundColor: 'var(--neutral-300)',
                borderRadius: '12px'
              }}></div>
            )}
            
            {/* Nome skeleton */}
            <div style={{
              height: '24px',
              backgroundColor: 'var(--neutral-300)',
              borderRadius: '4px',
              width: '80%'
            }}></div>
            
            {/* Tag skeleton */}
            <div style={{
              height: '20px',
              backgroundColor: 'var(--neutral-300)',
              borderRadius: '8px',
              width: '50%'
            }}></div>
            
            {/* Localização skeleton */}
            <div style={{
              height: '16px',
              backgroundColor: 'var(--neutral-300)',
              borderRadius: '4px',
              width: '70%',
              marginTop: 'auto'
            }}></div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0.6;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  )
}
