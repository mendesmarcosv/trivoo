'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import Sidebar from '@/components/Sidebar'
import PrimaryButton from '@/components/PrimaryButton'
import SelectableTag from '@/components/SelectableTag'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

interface CoachOffering {
  id: number
  slug: string
  label_pt: string
}

export default function OfertasProfessoresPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [allOfferings, setAllOfferings] = useState<CoachOffering[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  // Buscar todas as ofertas disponíveis
  useEffect(() => {
    const fetchOfferings = async () => {
      const { data, error } = await supabase
        .from('coach_accessibility_offerings')
        .select('*')
        .eq('active', true)
        .order('sort_order')

      if (data) {
        setAllOfferings(data)
      }
    }

    fetchOfferings()
  }, [])

  // Buscar seleções do usuário
  useEffect(() => {
    const fetchUserOfferings = async () => {
      if (!user?.id) return

      const { data, error } = await supabase
        .from('user_desired_coach_offerings')
        .select('offering_id')
        .eq('user_id', user.id)

      if (data) {
        setSelectedIds(data.map(item => item.offering_id))
      }
    }

    if (allOfferings.length > 0) {
      fetchUserOfferings()
    }
  }, [user?.id, allOfferings])

  const handleToggle = (offeringId: number) => {
    setSelectedIds(prev => {
      if (prev.includes(offeringId)) {
        return prev.filter(id => id !== offeringId)
      } else {
        return [...prev, offeringId]
      }
    })
  }

  const handleSave = async () => {
    if (!user?.id) return

    setIsSaving(true)
    try {
      // Remover seleções existentes
      await supabase
        .from('user_desired_coach_offerings')
        .delete()
        .eq('user_id', user.id)

      // Inserir novas seleções
      if (selectedIds.length > 0) {
        const itemsToInsert = selectedIds.map(offeringId => ({
          user_id: user.id,
          offering_id: offeringId
        }))

        const { error } = await supabase
          .from('user_desired_coach_offerings')
          .insert(itemsToInsert)

        if (error) throw error
      }

      toast.success('Preferências salvas com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar:', error)
      toast.error('Erro ao salvar preferências')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="layout">
      <Sidebar />
      
      <main className="config-content">
        {/* Header */}
        <div className="config-header" style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => router.push('/configuracoes/recursos-acessibilidade')}
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
              O que os professores devem oferecer
            </h1>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: '60%' }}>
          <div className="config-section">
            <p style={{ fontSize: '14px', color: 'var(--ink-600)', marginBottom: '24px' }}>
              Selecione as características e ofertas que você considera importantes nos professores e instrutores.
            </p>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
              {allOfferings.map(offering => (
                <SelectableTag
                  key={offering.id}
                  label={offering.label_pt}
                  selected={selectedIds.includes(offering.id)}
                  onClick={() => handleToggle(offering.id)}
                />
              ))}
            </div>

            {/* Botão Salvar */}
            <div style={{ marginTop: '32px' }}>
              <PrimaryButton onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Salvando...' : 'Salvar'}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

