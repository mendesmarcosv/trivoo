'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

interface ConfigItemProps {
  icon: string
  label: string
  description: string
  onClick?: () => void
}

const ConfigItem: React.FC<ConfigItemProps> = ({ icon, label, description, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-4 bg-neutral-200 hover:bg-neutral-300 rounded-xl transition-colors group"
    >
      <div className="flex items-center gap-3">
        <i className={`ph ${icon} text-[#6B7A2F]`} style={{ fontSize: '24px', width: '24px', height: '24px' }}></i>
        <div style={{ textAlign: 'left' }}>
          <div className="text-[#2C2C2C] font-medium" style={{ fontSize: '16px' }}>{label}</div>
          <div className="text-[#666666]" style={{ fontSize: '13px', marginTop: '2px' }}>{description}</div>
        </div>
      </div>
      <i className="ph ph-caret-right group-hover:text-[#6B7A2F] transition-colors" style={{ fontSize: '24px', width: '24px', height: '24px', color: 'var(--neutral-600)' }}></i>
    </button>
  )
}

export default function RecursosAcessibilidadePage() {
  const router = useRouter()

  return (
    <div className="layout">
      <Sidebar />
      
      <main className="config-content">
        {/* Header */}
        <div className="config-header" style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => router.push('/configuracoes')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <i className="ph ph-caret-left" style={{ fontSize: '24px', color: 'var(--ink-600)' }}></i>
            </button>
            <h1 style={{ fontSize: '30px', fontWeight: 600, color: 'var(--ink-800)' }}>
              Recursos de acessibilidade
            </h1>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: '60%' }}>
          <div className="config-section">
            <p style={{ fontSize: '14px', color: 'var(--ink-600)', marginBottom: '24px' }}>
              Configure suas preferências de acessibilidade para uma experiência personalizada.
            </p>

            <div className="flex flex-col" style={{ gap: '16px' }}>
              <ConfigItem 
                icon="ph-identification-badge" 
                label="Minhas condições de deficiência"
                description="Informe suas necessidades específicas"
                onClick={() => router.push('/configuracoes/condicoes-deficiencia')}
              />
              <ConfigItem 
                icon="ph-buildings" 
                label="Recursos que os locais devem ter"
                description="Selecione recursos de acessibilidade desejados"
                onClick={() => router.push('/configuracoes/recursos-locais')}
              />
              <ConfigItem 
                icon="ph-chalkboard-teacher" 
                label="O que os professores devem oferecer"
                description="Defina suas expectativas para instrutores"
                onClick={() => router.push('/configuracoes/ofertas-professores')}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
