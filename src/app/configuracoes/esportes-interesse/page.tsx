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

export default function EsportesInteressePage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [allSports, setAllSports] = useState<Sport[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [returnPath, setReturnPath] = useState('/configuracoes')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  // Detectar de onde veio o usuário
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const from = searchParams.get('from')
    if (from === 'profile') {
      setReturnPath('/profile')
    }
  }, [])

  // Buscar todos os esportes disponíveis
  useEffect(() => {
    const fetchSports = async () => {
      const { data, error } = await supabase
        .from('sports')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (data) {
        // Converter para o formato esperado
        const formattedSports = data.map(sport => ({
          id: sport.id,
          slug: sport.slug || sport.name.toLowerCase().replace(/\s+/g, '-'),
          label_pt: sport.name
        }))
        setAllSports(formattedSports)
      }
    }

    fetchSports()
  }, [])

  // Buscar seleções do usuário
  useEffect(() => {
    const fetchUserSports = async () => {
      if (!user?.id) return

      const { data, error } = await supabase
        .from('user_sports')
        .select('sport_id')
        .eq('user_id', user.id)

      if (data) {
        setSelectedIds(data.map(item => item.sport_id))
      }
    }

    if (allSports.length > 0) {
      fetchUserSports()
    }
  }, [user?.id, allSports])

  const handleToggle = (sportId: number) => {
    setSelectedIds(prev => {
      if (prev.includes(sportId)) {
        return prev.filter(id => id !== sportId)
      } else {
        return [...prev, sportId]
      }
    })
  }

  const handleSave = async () => {
    if (!user?.id) return

    setIsSaving(true)
    try {
      console.log('Iniciando salvamento. User ID:', user.id)
      console.log('Esportes selecionados:', selectedIds)

      // Remover seleções existentes
      const { error: deleteError } = await supabase
        .from('user_sports')
        .delete()
        .eq('user_id', user.id)

      if (deleteError) {
        console.error('Erro ao deletar:', deleteError)
        throw deleteError
      }

      // Inserir novas seleções
      if (selectedIds.length > 0) {
        const itemsToInsert = selectedIds.map(sportId => ({
          user_id: user.id,
          sport_id: sportId
        }))

        console.log('Inserindo itens:', itemsToInsert)

        const { error: insertError } = await supabase
          .from('user_sports')
          .insert(itemsToInsert)

        if (insertError) {
          console.error('Erro ao inserir:', insertError)
          throw insertError
        }
      }

      toast.success('Esportes de interesse salvos com sucesso!')
      router.push(returnPath)
    } catch (error: any) {
      console.error('Erro ao salvar:', error)
      toast.error(`Erro ao salvar esportes: ${error.message || 'Erro desconhecido'}`)
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
              onClick={() => router.push(returnPath)}
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
              Meus esportes de interesse
            </h1>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: '60%' }}>
          <div className="config-section">
            <p style={{ fontSize: '14px', color: 'var(--ink-600)', marginBottom: '24px' }}>
              Selecione os esportes que você tem interesse em praticar ou conhecer mais.
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

