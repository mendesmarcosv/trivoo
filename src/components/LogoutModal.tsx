'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const { signOut } = useAuth()
  const router = useRouter()

  if (!isOpen) return null

  const handleLogout = async () => {
    try {
      const result = await signOut()
      if (result.success) {
        toast.success('Logout realizado com sucesso!')
        router.push('/auth/login')
        onClose()
      } else {
        toast.error('Erro ao fazer logout')
      }
    } catch (error) {
      console.error('Erro no logout:', error)
      toast.error('Erro ao fazer logout')
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 99999 }}>
      <div 
        className="absolute inset-0 bg-black/60" 
        onClick={onClose}
        aria-hidden="true"
        style={{ zIndex: 99998 }}
      ></div>
      
      <div className="relative bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl" style={{ zIndex: 99999 }}>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ph ph-sign-out text-3xl text-red-600"></i>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Sair da conta?
          </h2>
          <p className="text-gray-600">
            Tem certeza que deseja sair? Você precisará fazer login novamente.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  )
}
