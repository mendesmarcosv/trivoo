'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'

export default function BottomBar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading } = useAuth()

  // Não mostrar bottom bar em páginas de auth ou se não estiver logado
  if (loading) return null
  if (!user) return null
  if (pathname.startsWith('/auth')) return null

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  const navItems = [
    { path: '/', icon: 'ph-house', label: 'Home' },
    { path: '/swipe', icon: 'ph-cards', label: 'Swipe' },
    { path: '/assistente', icon: 'orb', label: 'IA', highlight: true },
    { path: '/explorar', icon: 'ph-magnifying-glass', label: 'Explorar' },
    { path: '/configuracoes', icon: 'ph-gear', label: 'Config' }
  ]

  return (
    <>
      <div className="bottom-bar-mobile" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.08)',
        padding: '16px 12px 30px 12px',
        zIndex: 1000,
        display: 'none'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'flex-end',
          gap: '4px'
        }}>
          {navItems.map((item) => {
            const active = isActive(item.path)
            
            // Assistente IA destacado
            if (item.highlight) {
              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  style={{
                    flex: '1 1 0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    paddingBottom: '18px',
                    position: 'relative'
                  }}
                >
                  <div 
                    className="orb-float-animation"
                    style={{
                      width: '52px',
                      height: '52px',
                      background: 'white',
                      borderRadius: '100px',
                      border: '2px solid #E0E0E0',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      transition: 'all 0.2s',
                      boxShadow: active ? '0 4px 16px rgba(76, 94, 24, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    <img 
                      src="/images/ia-orb-trivoo.webp" 
                      alt="IA" 
                      style={{
                        width: '40px',
                        height: '40px',
                        objectFit: 'contain'
                      }}
                    />
                  </div>
                </button>
              )
            }

            // Outros itens
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                style={{
                  flex: '1 1 0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <i 
                  className={`ph ${item.icon}`}
                  style={{
                    fontSize: '24px',
                    color: active ? 'var(--green-800)' : '#484C52'
                  }}
                ></i>
                <div style={{
                  color: active ? 'var(--green-800)' : '#484C52',
                  fontSize: '12px',
                  fontFamily: 'Raleway',
                  fontWeight: active ? 600 : 400,
                  lineHeight: '16px'
                }}>
                  {item.label}
                </div>
              </button>
            )
          })}
        </div>
      </div>

    </>
  )
}
