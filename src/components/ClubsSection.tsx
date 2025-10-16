import { useSwiper } from '@/lib/hooks/useSwiper'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import HomeClubCard from './HomeClubCard'
import HomeSectionSkeleton from './HomeSectionSkeleton'

interface Club {
  id: string
  name: string
  address: string
  image_url: string
  distance_km?: number
  sports?: string[]
}

interface ClubsSectionProps {
  data?: Club[]
}

export default function ClubsSection({ data }: ClubsSectionProps) {
  const [clubs, setClubs] = useState<Club[]>(data || [])
  const [loading, setLoading] = useState(!data)

  const { swiperRef } = useSwiper({
    slidesPerView: 'auto',
    spaceBetween: 16,
    breakpoints: {
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 }
    }
  })

  // Atualizar dados quando receber props
  useEffect(() => {
    if (data) {
      setClubs(data)
      setLoading(false)
      return
    }
  }, [data])

  // Só buscar dados se não foram passados via props
  useEffect(() => {
    if (data) return // Se já tem dados, não buscar

    const fetchClubs = async () => {
      try {
        const { data: fetchedData, error } = await supabase
          .from('clubs')
          .select('*')
          .limit(10)

        if (error) throw error

        if (fetchedData) {
          setClubs(fetchedData)
        }
      } catch (error) {
        console.error('Erro ao buscar clubes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchClubs()
  }, [data])

  // Mostrar skeleton enquanto carrega
  if (loading) {
    return <HomeSectionSkeleton title="Clubes & Centros de Treinamentos" cardType="club" />
  }

  // Não renderizar se não há dados (após carregar)
  if (clubs.length === 0) return null

  return (
    <section className="section">
      <div className="section-header">
        <h3>Clubes & Centros de Treinamentos</h3>
        <a href="/explorar?tab=clubs" className="see-all">Ver todos</a>
      </div>

      <div className="swiper clubs-swiper" ref={swiperRef}>
        <div className="swiper-wrapper">
          {clubs.map((club) => (
            <HomeClubCard
              key={club.id}
              id={club.id}
              title={club.name}
              distance={`${club.distance_km || 0} km`}
              image={club.image_url || '/images/clubs/default.png'}
              chips={club.sports || []}
            />
          ))}
        </div>
        
        <div className="swiper-button-next"><i className="ph ph-caret-right"></i></div>
        <div className="swiper-button-prev"><i className="ph ph-caret-left"></i></div>
      </div>
    </section>
  )
}

