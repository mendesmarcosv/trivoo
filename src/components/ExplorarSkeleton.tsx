export default function ExplorarSkeleton() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '24px',
      animation: 'pulse 2s ease-in-out infinite alternate'
    }}>
      {[...Array(8)].map((_, idx) => (
        <div 
          key={idx}
          style={{
            backgroundColor: 'var(--neutral-200)',
            borderRadius: '16px',
            padding: '16px',
            height: '280px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          {/* Imagem skeleton */}
          <div style={{
            width: '100%',
            height: '120px',
            backgroundColor: 'var(--neutral-300)',
            borderRadius: '12px',
            animation: 'shimmer 2s ease-in-out infinite alternate'
          }}></div>
          
          {/* Título skeleton */}
          <div style={{
            height: '24px',
            backgroundColor: 'var(--neutral-300)',
            borderRadius: '4px',
            width: '80%',
            animation: 'shimmer 2s ease-in-out infinite alternate 0.2s'
          }}></div>
          
          {/* Tags skeleton */}
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              height: '20px',
              backgroundColor: 'var(--neutral-300)',
              borderRadius: '8px',
              width: '60px',
              animation: 'shimmer 2s ease-in-out infinite alternate 0.4s'
            }}></div>
            <div style={{
              height: '20px',
              backgroundColor: 'var(--neutral-300)',
              borderRadius: '8px',
              width: '80px',
              animation: 'shimmer 2s ease-in-out infinite alternate 0.6s'
            }}></div>
          </div>
          
          {/* Localização skeleton */}
          <div style={{
            height: '16px',
            backgroundColor: 'var(--neutral-300)',
            borderRadius: '4px',
            width: '60%',
            marginTop: 'auto',
            animation: 'shimmer 2s ease-in-out infinite alternate 0.8s'
          }}></div>
        </div>
      ))}
      
      <style jsx>{`
        @keyframes shimmer {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}
