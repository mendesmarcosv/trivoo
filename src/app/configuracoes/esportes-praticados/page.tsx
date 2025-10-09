'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import Sidebar from '@/components/Sidebar'
import PrimaryButton from '@/components/PrimaryButton'
import SelectableTag from '@/components/SelectableTag'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

interface Sport {
  id: number
  slug: string
  label_pt: string
}

export default function EsportesPraticadosPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [allSports, setAllSports] = useState<Sport[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [otherDescription, setOtherDescription] = useState('')
  const [showOtherInput, setShowOtherInput] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  // Buscar todos os esportes disponíveis
  useEffect(() => {
    const fetchSports = async () => {
      const { data, error } = await supabase
        .from('sports_general')
        .select('*')
        .eq('active', true)
        .order('sort_order')

      if (data) {
        setAllSports(data)
      }
    }

    fetchSports()
  }, [])

  // Buscar seleções do usuário
  useEffect(() => {
    const fetchUserSports = async () => {
      if (!user?.id) return

      const { data, error } = await supabase
        .from('user_sports_practiced')
        .select('sport_id, other_description')
        .eq('user_id', user.id)

      if (data) {
        setSelectedIds(data.map(item => item.sport_id))
        const otherItem = data.find(item => {
          const sport = allSports.find(s => s.id === item.sport_id)
          return sport?.slug === 'outro'
        })
        if (otherItem?.other_description) {
          setOtherDescription(otherItem.other_description)
          setShowOtherInput(true)
        }
      }
    }

    if (allSports.length > 0) {
      fetchUserSports()
    }
  }, [user?.id, allSports])

  const handleToggle = (sportId: number) => {
    const sport = allSports.find(s => s.id === sportId)
    
    setSelectedIds(prev => {
      if (prev.includes(sportId)) {
        // Se está desmarcando "outro", limpar descrição
        if (sport?.slug === 'outro') {
          setShowOtherInput(false)
          setOtherDescription('')
        }
        return prev.filter(id => id !== sportId)
      } else {
        // Se está marcando "outro", mostrar input
        if (sport?.slug === 'outro') {
          setShowOtherInput(true)
        }
        return [...prev, sportId]
      }
    })
  }

  const handleSave = async () => {
    if (!user?.id) return

    setIsSaving(true)
    try {
      // Remover seleções existentes
      await supabase
        .from('user_sports_practiced')
        .delete()
        .eq('user_id', user.id)

      // Inserir novas seleções
      if (selectedIds.length > 0) {
        const itemsToInsert = selectedIds.map(sportId => {
          const sport = allSports.find(s => s.id === sportId)
          return {
            user_id: user.id,
            sport_id: sportId,
            other_description: sport?.slug === 'outro' ? otherDescription : null
          }
        })

        const { error } = await supabase
          .from('user_sports_practiced')
          .insert(itemsToInsert)

        if (error) throw error
      }

      toast.success('Esportes salvos com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar:', error)
      toast.error('Erro ao salvar esportes')
    } finally {
      setIsSaving(false)
    }
  }

  // Filtrar esportes por busca
  const filteredSports = allSports.filter(sport =>
    sport.label_pt.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
              Esportes que já pratiquei
            </h1>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: '60%' }}>
          <div className="config-section">
            <p style={{ fontSize: '14px', color: 'var(--ink-600)', marginBottom: '24px' }}>
              Selecione todos os esportes que você já praticou, mesmo que tenha sido apenas uma vez.
            </p>

            {/* Campo de busca */}
            <input
              type="text"
              placeholder="Buscar esportes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: 'var(--neutral-200)',
                fontSize: '14px',
                marginBottom: '24px'
              }}
            />

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
              {filteredSports.map(sport => (
                <SelectableTag
                  key={sport.id}
                  label={sport.label_pt}
                  selected={selectedIds.includes(sport.id)}
                  onClick={() => handleToggle(sport.id)}
                />
              ))}
            </div>

            {/* Campo "Outro" */}
            {showOtherInput && (
              <div style={{ marginTop: '24px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'var(--ink-700)', 
                  fontSize: '14px',
                  fontWeight: 500
                }}>
                  Descreva o esporte
                </label>
                <textarea
                  value={otherDescription}
                  onChange={(e) => setOtherDescription(e.target.value)}
                  placeholder="Por favor, descreva o esporte..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: 'var(--neutral-200)',
                    fontSize: '14px',
                    color: 'var(--ink-800)',
                    resize: 'vertical'
                  }}
                />
              </div>
            )}

            {/* Contador de seleções */}
            {selectedIds.length > 0 && (
              <p style={{ fontSize: '14px', color: 'var(--ink-600)', marginTop: '16px' }}>
                {selectedIds.length} {selectedIds.length === 1 ? 'esporte selecionado' : 'esportes selecionados'}
              </p>
            )}

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

