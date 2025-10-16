'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import Sidebar from '@/components/Sidebar'
import LogoutModal from '@/components/LogoutModal'

interface ConfigItemProps {
  icon: string
  label: string
  onClick?: () => void
}

const ConfigItem: React.FC<ConfigItemProps> = ({ icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-3 bg-neutral-200 hover:bg-neutral-300 rounded-xl transition-colors group"
    >
      <div className="flex items-center gap-3">
        <i className={`ph ${icon} text-[#6B7A2F]`} style={{ fontSize: '24px', width: '24px', height: '24px' }}></i>
        <span className="text-[#2C2C2C] font-medium" style={{ fontSize: '16px' }}>{label}</span>
      </div>
      <i className="ph ph-caret-right group-hover:text-[#6B7A2F] transition-colors" style={{ fontSize: '24px', width: '24px', height: '24px', color: 'var(--neutral-600)' }}></i>
    </button>
  )
}

export default function ConfiguracoesPage() {
  const router = useRouter()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <div className="layout">
      <Sidebar />
      
      <main className="config-content">
        {/* Header */}
        <div className="config-header" style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '30px', fontWeight: 600, color: 'var(--ink-800)' }}>
            Configurações
          </h1>
        </div>

        {/* Content */}
        <div className="config-content-wrapper" style={{ maxWidth: '60%' }}>
          {/* Preferências */}
          <div className="config-section">
            <h2 style={{ 
              fontSize: '22px', 
              fontWeight: 600, 
              color: 'var(--neutral-700)',
              marginBottom: '24px',
              textTransform: 'none'
            }}>
              Preferências
            </h2>
            <div className="flex flex-col" style={{ gap: '16px' }}>
              <ConfigItem 
                icon="ph-bell" 
                label="Notificações"
                onClick={() => handleNavigation('/configuracoes/notificacoes')}
              />
              <ConfigItem 
                icon="ph-map-pin" 
                label="Localização"
                onClick={() => handleNavigation('/configuracoes/localizacao')}
              />
              <ConfigItem 
                icon="ph-ruler" 
                label="Unidades de medida"
                onClick={() => handleNavigation('/configuracoes/unidades-medida')}
              />
              <ConfigItem 
                icon="ph-globe" 
                label="Idioma e região"
                onClick={() => handleNavigation('/configuracoes/idioma-regiao')}
              />
            </div>
          </div>

          {/* Controle de acessibilidade */}
          <div className="config-section">
            <h2 style={{ 
              fontSize: '22px', 
              fontWeight: 600, 
              color: 'var(--neutral-700)',
              marginBottom: '24px',
              textTransform: 'none'
            }}>
              Controle de acessibilidade
            </h2>
            <div className="flex flex-col" style={{ gap: '16px' }}>
              <ConfigItem 
                icon="ph-chat-circle-text" 
                label="Feedback tátil"
                onClick={() => handleNavigation('/configuracoes/feedback-tatil')}
              />
              <ConfigItem 
                icon="ph-warning" 
                label="Cores e texto"
                onClick={() => handleNavigation('/configuracoes/cores-texto')}
              />
            </div>
          </div>

          {/* Suporte & Legal */}
          <div className="config-section">
            <h2 style={{ 
              fontSize: '22px', 
              fontWeight: 600, 
              color: 'var(--neutral-700)',
              marginBottom: '24px',
              textTransform: 'none'
            }}>
              Suporte & Legal
            </h2>
            <div className="flex flex-col" style={{ gap: '16px' }}>
              <ConfigItem 
                icon="ph-question" 
                label="Ajuda"
                onClick={() => handleNavigation('/configuracoes/ajuda')}
              />
              <ConfigItem 
                icon="ph-warning-diamond" 
                label="Relatar um problema"
                onClick={() => handleNavigation('/configuracoes/relatar-problema')}
              />
              <ConfigItem 
                icon="ph-file-text" 
                label="Políticas e termos"
                onClick={() => handleNavigation('/configuracoes/politicas')}
              />
            </div>
          </div>

          {/* Conta */}
          <div className="config-section">
            <h2 style={{ 
              fontSize: '22px', 
              fontWeight: 600, 
              color: 'var(--neutral-700)',
              marginBottom: '24px',
              textTransform: 'none'
            }}>
              Conta
            </h2>
            <div className="flex flex-col" style={{ gap: '16px' }}>
              <ConfigItem 
                icon="ph-at" 
                label="Trocar e-mail"
                onClick={() => handleNavigation('/configuracoes/trocar-email')}
              />
              <ConfigItem 
                icon="ph-trash" 
                label="Excluir conta"
                onClick={() => handleNavigation('/configuracoes/excluir-conta')}
              />
              <ConfigItem 
                icon="ph-sign-out" 
                label="Sair"
                onClick={() => setShowLogoutModal(true)}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Logout Modal */}
      {showLogoutModal && (
        <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />
      )}
    </div>
  )
}

