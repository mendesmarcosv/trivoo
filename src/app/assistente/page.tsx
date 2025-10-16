'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import Sidebar from '@/components/Sidebar'
import ChatInterface from '@/components/ChatInterface'

export default function AssistentePage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      const timer = setTimeout(() => {
        router.push('/auth/login')
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [user, loading, router])

  // Não mostrar loading, renderizar direto
  // O useAuth já tem proteção interna
  return (
    <div className="layout assistente-page">
      {/* Blurs Animados no Fundo de Toda a Página */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden'
      }}>
        {/* Blur Azul - Começa no canto superior esquerdo */}
        <div style={{
          width: '600px',
          height: '600px',
          position: 'absolute',
          top: '-100px',
          left: '-100px',
          background: '#5B8CFF',
          borderRadius: '50%',
          filter: 'blur(180px)',
          opacity: 0.4,
          animation: 'floatBlur1 20s ease-in-out infinite'
        }}></div>
        {/* Blur Verde - Começa no canto inferior direito */}
        <div style={{
          width: '600px',
          height: '600px',
          position: 'absolute',
          bottom: '-100px',
          right: '-100px',
          background: '#C5E535',
          borderRadius: '50%',
          filter: 'blur(180px)',
          opacity: 0.4,
          animation: 'floatBlur2 25s ease-in-out infinite'
        }}></div>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="sidebar-transparent">
          <Sidebar />
        </div>
      </div>
      
      <main className="page-content" style={{ position: 'relative', zIndex: 1 }}>
        {/* Chat Interface */}
        <ChatInterface />
      </main>
    </div>
  )
}

