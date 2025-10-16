import { useSwiper } from '@/lib/hooks/useSwiper'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import HomeEventCard from './HomeEventCard'
import HomeSectionSkeleton from './HomeSectionSkeleton'

interface Event {
  id: string
  title: string
  location: string
  image_url: string
  date: string
}

interface EventsSectionProps {
  data?: Event[]
}

export default function EventsSection({ data }: EventsSectionProps) {
  const [events, setEvents] = useState<Event[]>(data || [])
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
      setEvents(data)
      setLoading(false)
      return
    }
  }, [data])

  // Só buscar dados se não foram passados via props
  useEffect(() => {
    if (data) return // Se já tem dados, não buscar

    const fetchEvents = async () => {
      try {
        const { data: fetchedData, error } = await supabase
          .from('events')
          .select('*')
          .limit(10)

        if (error) throw error

        if (fetchedData) {
          console.log('Dados dos eventos do Supabase:', fetchedData)
          setEvents(fetchedData)
        }
      } catch (error) {
        console.error('Erro ao buscar eventos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [data])

  // Mostrar skeleton enquanto carrega
  if (loading) {
    return <HomeSectionSkeleton title="Eventos por perto" cardType="event" />
  }

  // Não renderizar se não há dados (após carregar)
  if (events.length === 0) return null

  return (
    <section className="section">
      <div className="section-header">
        <h3>Eventos por perto</h3>
        <a href="/explorar?tab=events" className="see-all">Ver todos</a>
      </div>

      <div className="swiper events-swiper" ref={swiperRef}>
        <div className="swiper-wrapper">
          {events.map((event) => (
            <HomeEventCard
              key={event.id}
              id={event.id}
              title={event.title}
              image={event.image_url || '/images/events/default.png'}
              location={event.location}
              date={event.date ? new Date(event.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Data a definir'}
            />
          ))}
        </div>

        <div className="swiper-button-next"><i className="ph ph-caret-right"></i></div>
        <div className="swiper-button-prev"><i className="ph ph-caret-left"></i></div>
      </div>
    </section>
  )
}

