'use client'

import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '@/lib/hooks/useAuth'
import Button from './Button'
import { useRouter } from 'next/navigation'

interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const { signOut } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await signOut()
      onClose()
      // Redirecionar para a tela de login após logout
      router.push('/auth/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 9999 }}>
      <div className="absolute inset-0 bg-black/60" aria-hidden="true"></div>
      <div className="relative bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ph ph-sign-out text-red-600 text-2xl"></i>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Confirmar saída
          </h2>
          
          <p className="text-gray-600 mb-6">
            Tem certeza que deseja sair da sua conta?
          </p>
          
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Cancelar
            </Button>
            
            <Button
              onClick={handleLogout}
              disabled={isLoading}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {isLoading ? 'Saindo...' : 'Sair'}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
