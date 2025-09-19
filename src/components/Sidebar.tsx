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
  const { user, isAuthenticated } = useAuth()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const pathname = usePathname()

  const handleSignOutClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowLogoutModal(true)
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
        <div className="sidebar-top">
          <div className="brand">
            <span className="brand-logo">Trivoo</span>
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
            <a className="menu-item" href="#explorar">
              <i className="ph ph-compass"></i>
              <span>Explorar</span>
            </a>
            <a className="menu-item" href="#mapa">
              <i className="ph ph-map-pin"></i>
              <span>Mapa</span>
            </a>
            <Link 
              href="/profile" 
              className={`menu-item ${pathname === '/profile' ? 'is-active' : ''}`}
            >
              <i className="ph ph-user"></i>
              <span>Meu Perfil</span>
              {pathname === '/profile' && <span className="active-pill" aria-hidden="true"></span>}
            </Link>
            <a className="menu-item" href="#assistente">
              <i className="ph ph-robot"></i>
              <span>Assistente IA</span>
            </a>
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
      
      <LogoutModal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)} 
      />
    </aside>
  )
}

