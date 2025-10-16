export default function LoadingSkeleton() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px'
      }}>
        {/* Logo animado */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          border: '4px solid var(--green-200)',
          borderTopColor: 'var(--green-700)',
          animation: 'spin 1s linear infinite'
        }}></div>
        
        <div style={{
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 600,
            color: 'var(--ink-800)',
            marginBottom: '8px',
            fontFamily: 'Raleway'
          }}>
            Carregando...
          </h2>
          <p style={{
            fontSize: '14px',
            color: 'var(--ink-600)',
            fontFamily: 'Raleway'
          }}>
            Preparando tudo para você
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

