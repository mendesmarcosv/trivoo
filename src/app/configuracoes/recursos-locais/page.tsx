'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import Sidebar from '@/components/Sidebar'
import PrimaryButton from '@/components/PrimaryButton'
import SelectableTag from '@/components/SelectableTag'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

interface LocationResource {
  id: number
  slug: string
  label_pt: string
}

export default function RecursosLocaisPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [allResources, setAllResources] = useState<LocationResource[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  // Buscar todos os recursos disponíveis
  useEffect(() => {
    const fetchResources = async () => {
      const { data, error } = await supabase
        .from('accessibility_location_resources')
        .select('*')
        .eq('active', true)
        .order('sort_order')

      if (data) {
        setAllResources(data)
      }
    }

    fetchResources()
  }, [])

  // Buscar seleções do usuário
  useEffect(() => {
    const fetchUserResources = async () => {
      if (!user?.id) return

      const { data, error } = await supabase
        .from('user_desired_location_resources')
        .select('resource_id')
        .eq('user_id', user.id)

      if (data) {
        setSelectedIds(data.map(item => item.resource_id))
      }
    }

    if (allResources.length > 0) {
      fetchUserResources()
    }
  }, [user?.id, allResources])

  const handleToggle = (resourceId: number) => {
    setSelectedIds(prev => {
      if (prev.includes(resourceId)) {
        return prev.filter(id => id !== resourceId)
      } else {
        return [...prev, resourceId]
      }
    })
  }

  const handleSave = async () => {
    if (!user?.id) return

    setIsSaving(true)
    try {
      // Remover seleções existentes
      await supabase
        .from('user_desired_location_resources')
        .delete()
        .eq('user_id', user.id)

      // Inserir novas seleções
      if (selectedIds.length > 0) {
        const itemsToInsert = selectedIds.map(resourceId => ({
          user_id: user.id,
          resource_id: resourceId
        }))

        const { error } = await supabase
          .from('user_desired_location_resources')
          .insert(itemsToInsert)

        if (error) throw error
      }

      toast.success('Recursos salvos com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar:', error)
      toast.error('Erro ao salvar recursos')
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
              Recursos que os locais devem ter
            </h1>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: '60%' }}>
          <div className="config-section">
            <p style={{ fontSize: '14px', color: 'var(--ink-600)', marginBottom: '24px' }}>
              Selecione os recursos de acessibilidade que você considera importantes nos locais de prática esportiva.
            </p>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
              {allResources.map(resource => (
                <SelectableTag
                  key={resource.id}
                  label={resource.label_pt}
                  selected={selectedIds.includes(resource.id)}
                  onClick={() => handleToggle(resource.id)}
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

