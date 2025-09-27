'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'

interface SidebarProps {
  onAuthClick?: () => void
}

export default function Sidebar({ onAuthClick }: SidebarProps) {
  const { user } = useAuth()
  const pathname = usePathname()

  return (
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
            <a className="menu-item" href="#explorar">
              <i className="ph ph-magnifying-glass"></i>
              <span>Explorar</span>
            </a>
            <Link 
              href="/profile" 
              className={`menu-item ${pathname === '/profile' ? 'is-active' : ''}`}
            >
              <i className="ph ph-user-circle"></i>
              <span>Meu Perfil</span>
              {pathname === '/profile' && <span className="active-pill" aria-hidden="true"></span>}
            </Link>
            <a className="menu-item mobile-hidden" href="#assistente">
              <i className="ph ph-sparkle"></i>
              <span>Assistente IA</span>
            </a>
            <a className="menu-item mobile-hidden" href="#configuracoes">
              <i className="ph ph-gear"></i>
              <span>Configurações</span>
            </a>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="divider"></div>
          <div className="user-info">
            <div className="user-avatar">
              <img 
                src={user?.avatar_url || '/images/teachers/profile Ana Bechara.png'} 
                alt={user?.name || 'Usuário'} 
                className="w-8 h-8 rounded-full object-cover"
              />
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name || 'Usuário'}</span>
              <span className="user-location">{user?.location || 'Niterói'}</span>
            </div>
          </div>
        </div>

      </div>
    </aside>
  )
}

