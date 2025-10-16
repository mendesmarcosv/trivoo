'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

interface Sport {
  id: string
  name: string
  category?: string
}

interface ProfileData {
  interestSports: Sport[]
  practicedSports: Sport[]
  accessibilityModeEnabled: boolean
  disabilityCondition: string
  localResources: string[]
  coachOfferings: string[]
  isLoading: boolean
}

export function useProfileData(userId: string | undefined) {
  const [data, setData] = useState<ProfileData>({
    interestSports: [],
    practicedSports: [],
    accessibilityModeEnabled: false,
    disabilityCondition: '',
    localResources: [],
    coachOfferings: [],
    isLoading: true
  })

  useEffect(() => {
    if (!userId) {
      setData(prev => ({ ...prev, isLoading: false }))
      return
    }

    // Buscar todos os dados em paralelo
    const fetchAllData = async () => {
      setData(prev => ({ ...prev, isLoading: true }))

      try {
        const [
          accessibilityResult,
          interestSportsResult,
          practicedSportsResult,
          conditionResult,
          resourcesResult,
          offeringsResult
        ] = await Promise.all([
          // Modo de acessibilidade
          supabase
            .from('profiles')
            .select('accessibility_mode_enabled')
            .eq('id', userId)
            .maybeSingle(),
          
          // Esportes de interesse
          supabase
            .from('user_sports')
            .select(`
              sport_id,
              sports:sport_id (
                id,
                name,
                category
              )
            `)
            .eq('user_id', userId),
          
          // Esportes praticados
          supabase
            .from('user_sports_practiced')
            .select(`
              sport_id,
              sports_general:sport_id (
                id,
                label_pt
              )
            `)
            .eq('user_id', userId),
          
          // Condição de deficiência
          supabase
            .from('user_disability_conditions')
            .select(`
              condition_id,
              disability_conditions:condition_id (
                label_pt
              )
            `)
            .eq('user_id', userId)
            .maybeSingle(),
          
          // Recursos de locais
          supabase
            .from('user_desired_location_resources')
            .select('resource_id')
            .eq('user_id', userId),
          
          // Ofertas de professores
          supabase
            .from('user_desired_coach_offerings')
            .select('offering_id')
            .eq('user_id', userId)
        ])

        // Processar resultados
        const accessibilityMode = accessibilityResult.data?.accessibility_mode_enabled || false

        const interestSports = (interestSportsResult.data || [])
          .filter((item: any) => item.sports)
          .map((item: any) => item.sports as Sport)

        const practicedSports = (practicedSportsResult.data || [])
          .filter((item: any) => item.sports_general)
          .map((item: any) => ({
            id: item.sports_general.id,
            name: item.sports_general.label_pt
          } as Sport))

        const condition = conditionResult.data?.disability_conditions?.label_pt || ''

        // Buscar labels dos recursos e ofertas se modo de acessibilidade estiver ativo
        let resources: string[] = []
        let offerings: string[] = []

        if (accessibilityMode && resourcesResult.data) {
          const resourceIds = resourcesResult.data.map((item: any) => item.resource_id)
          if (resourceIds.length > 0) {
            const { data: resourcesData } = await supabase
              .from('accessibility_location_resources')
              .select('label_pt')
              .in('id', resourceIds)
            resources = resourcesData?.map((r: any) => r.label_pt) || []
          }
        }

        if (accessibilityMode && offeringsResult.data) {
          const offeringIds = offeringsResult.data.map((item: any) => item.offering_id)
          if (offeringIds.length > 0) {
            const { data: offeringsData } = await supabase
              .from('coach_accessibility_offerings')
              .select('label_pt')
              .in('id', offeringIds)
            offerings = offeringsData?.map((o: any) => o.label_pt) || []
          }
        }

        // Atualizar estado com todos os dados
        setData({
          interestSports,
          practicedSports,
          accessibilityModeEnabled: accessibilityMode,
          disabilityCondition: condition,
          localResources: resources,
          coachOfferings: offerings,
          isLoading: false
        })
      } catch (error) {
        console.error('Erro ao buscar dados do perfil:', error)
        setData(prev => ({ ...prev, isLoading: false }))
      }
    }

    fetchAllData()
  }, [userId])

  return data
}

