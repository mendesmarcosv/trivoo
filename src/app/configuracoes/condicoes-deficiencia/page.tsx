'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import Sidebar from '@/components/Sidebar'
import PrimaryButton from '@/components/PrimaryButton'
import SelectableTag from '@/components/SelectableTag'
import Loading from '@/components/Loading'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

interface DisabilityCondition {
  id: number
  slug: string
  label_pt: string
}

export default function CondicoesDeficienciaPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [allConditions, setAllConditions] = useState<DisabilityCondition[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [otherDescription, setOtherDescription] = useState('')
  const [showOtherInput, setShowOtherInput] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  // Buscar todas as condições disponíveis
  useEffect(() => {
    const fetchConditions = async () => {
      const { data, error } = await supabase
        .from('disability_conditions')
        .select('*')
        .eq('active', true)
        .order('sort_order')

      if (data) {
        setAllConditions(data)
      }
    }

    fetchConditions()
  }, [])

  // Buscar seleções do usuário
  useEffect(() => {
    const fetchUserConditions = async () => {
      if (!user?.id) return

      const { data, error } = await supabase
        .from('user_disability_conditions')
        .select('condition_id, other_description')
        .eq('user_id', user.id)

      if (data) {
        setSelectedIds(data.map(item => item.condition_id))
        const otherItem = data.find(item => {
          const condition = allConditions.find(c => c.id === item.condition_id)
          return condition?.slug === 'outro'
        })
        if (otherItem?.other_description) {
          setOtherDescription(otherItem.other_description)
          setShowOtherInput(true)
        }
      }
    }

    if (allConditions.length > 0) {
      fetchUserConditions()
    }
  }, [user?.id, allConditions])

  const handleToggle = (conditionId: number) => {
    const condition = allConditions.find(c => c.id === conditionId)
    
    setSelectedIds(prev => {
      if (prev.includes(conditionId)) {
        // Se está desmarcando "outro", limpar descrição
        if (condition?.slug === 'outro') {
          setShowOtherInput(false)
          setOtherDescription('')
        }
        return prev.filter(id => id !== conditionId)
      } else {
        // Se está marcando "outro", mostrar input
        if (condition?.slug === 'outro') {
          setShowOtherInput(true)
        }
        return [...prev, conditionId]
      }
    })
  }

  const handleSave = async () => {
    if (!user?.id) return

    setIsSaving(true)
    try {
      // Remover seleções existentes
      await supabase
        .from('user_disability_conditions')
        .delete()
        .eq('user_id', user.id)

      // Inserir novas seleções
      if (selectedIds.length > 0) {
        const itemsToInsert = selectedIds.map(conditionId => {
          const condition = allConditions.find(c => c.id === conditionId)
          return {
            user_id: user.id,
            condition_id: conditionId,
            other_description: condition?.slug === 'outro' ? otherDescription : null
          }
        })

        const { error } = await supabase
          .from('user_disability_conditions')
          .insert(itemsToInsert)

        if (error) throw error
      }

      toast.success('Condições salvas com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar:', error)
      toast.error('Erro ao salvar condições')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return <Loading fullScreen message="Carregando..." />
  }

  if (!user) {
    return <Loading fullScreen message="Redirecionando..." />
  }

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
              Condições de deficiência
            </h1>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: '60%' }}>
          <div className="config-section">
            <p style={{ fontSize: '14px', color: 'var(--ink-600)', marginBottom: '24px' }}>
              Selecione as condições que se aplicam a você. Isso nos ajudará a recomendar locais e professores mais adequados.
            </p>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
              {allConditions.map(condition => (
                <SelectableTag
                  key={condition.id}
                  label={condition.label_pt}
                  selected={selectedIds.includes(condition.id)}
                  onClick={() => handleToggle(condition.id)}
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
                  Descreva sua condição
                </label>
                <textarea
                  value={otherDescription}
                  onChange={(e) => setOtherDescription(e.target.value)}
                  placeholder="Por favor, descreva sua condição..."
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

