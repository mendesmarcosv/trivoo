'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import LogoutModal from './LogoutModal'

interface SidebarProps {
  onAuthClick?: () => void
}

export default function Sidebar({ onAuthClick }: SidebarProps) {
  const { user, userProfile } = useAuth()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const pathname = usePathname()

  const handleSignOutClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowLogoutModal(true)
  }

  return (
    <>
    <aside className="sidebar">
      <div className="sidebar-inner">
        <div className="sidebar-top">
          <div className="brand">
            <img src="/images/logo-trivoo-dark.svg" alt="Trivoo" className="h-8" />
          </div>

          <nav className="menu">
            <Link 
              href="/" 
              className={`menu-item ${pathname === '/' ? 'is-active' : ''}`}
            >
              <i className="ph ph-house"></i>
              <span>Home</span>
              {pathname === '/' && <span className="active-pill" aria-hidden="true"></span>}
            </Link>
            <Link 
              href="/swipe" 
              className={`menu-item ${pathname === '/swipe' ? 'is-active' : ''}`}
            >
              <i className="ph ph-cards"></i>
              <span>Swipe</span>
              {pathname === '/swipe' && <span className="active-pill" aria-hidden="true"></span>}
            </Link>
            <Link 
              href="/explorar" 
              className={`menu-item ${pathname === '/explorar' ? 'is-active' : ''}`}
            >
              <i className="ph ph-magnifying-glass"></i>
              <span>Explorar</span>
              {pathname === '/explorar' && <span className="active-pill" aria-hidden="true"></span>}
            </Link>
            <Link 
              href="/profile" 
              className={`menu-item ${pathname === '/profile' ? 'is-active' : ''}`}
            >
              <i className="ph ph-user-circle"></i>
              <span>Meu Perfil</span>
              {pathname === '/profile' && <span className="active-pill" aria-hidden="true"></span>}
            </Link>
            <Link 
              href="/assistente" 
              className={`menu-item mobile-hidden ${pathname === '/assistente' ? 'is-active' : ''}`}
            >
              <i className="ph ph-sparkle"></i>
              <span>Assistente IA</span>
              {pathname === '/assistente' && <span className="active-pill" aria-hidden="true"></span>}
            </Link>
            <Link 
              href="/configuracoes" 
              className={`menu-item mobile-hidden ${pathname === '/configuracoes' ? 'is-active' : ''}`}
            >
              <i className="ph ph-gear"></i>
              <span>Configurações</span>
              {pathname === '/configuracoes' && <span className="active-pill" aria-hidden="true"></span>}
            </Link>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="divider"></div>
          <a className="menu-item signout" href="#" onClick={handleSignOutClick}>
            <i className="ph ph-sign-out"></i>
            <span>Sair</span>
          </a>
        </div>

      </div>
    </aside>
    
    <LogoutModal 
      isOpen={showLogoutModal} 
      onClose={() => setShowLogoutModal(false)} 
    />
    </>
  )
}

