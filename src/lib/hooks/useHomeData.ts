import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface HomeData {
  clubs: any[]
  teachers: any[]
  events: any[]
  loading: boolean
  error: string | null
}

export function useHomeData(): HomeData {
  const [clubs, setClubs] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Buscar todos os dados em paralelo para melhor performance
        const [clubsResult, teachersResult, eventsResult] = await Promise.allSettled([
          supabase.from('clubs').select('*').order('name').limit(10),
          supabase.from('teachers').select('*').order('name').limit(10),
          supabase.from('events').select('*').order('date').limit(10)
        ])

        // Processar resultados dos clubes
        if (clubsResult.status === 'fulfilled' && clubsResult.value.data) {
          setClubs(clubsResult.value.data)
          console.log('Clubes carregados:', clubsResult.value.data.length)
        }

        // Processar resultados dos professores
        if (teachersResult.status === 'fulfilled' && teachersResult.value.data) {
          setTeachers(teachersResult.value.data)
          console.log('Professores carregados:', teachersResult.value.data.length)
        }

        // Processar resultados dos eventos
        if (eventsResult.status === 'fulfilled' && eventsResult.value.data) {
          setEvents(eventsResult.value.data)
          console.log('Eventos carregados:', eventsResult.value.data.length)
        }

        // Verificar se houve algum erro
        const errors = [clubsResult, teachersResult, eventsResult]
          .filter(result => result.status === 'rejected')
          .map(result => (result as PromiseRejectedResult).reason)

        if (errors.length > 0) {
          console.error('Erros ao carregar dados da home:', errors)
          setError('Erro ao carregar alguns dados')
        }

      } catch (error) {
        console.error('Erro geral ao carregar dados da home:', error)
        setError('Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [])

  return {
    clubs,
    teachers,
    events,
    loading,
    error
  }
}
