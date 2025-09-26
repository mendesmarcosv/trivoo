import { useSwiper } from '@/lib/hooks/useSwiper'
import data from '../data/eventData.json'
import EventCard from './EventCard'

export default function EventsSection() {
  const { swiperRef } = useSwiper({
    slidesPerView: 'auto',
    spaceBetween: 16,
    breakpoints: {
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 }
    }
  })

  return (
    <section className="section">
      <div className="section-header">
        <h3>Eventos por perto</h3>
        <a href="#" className="see-all">Ver todos</a>
      </div>

      <div className="swiper events-swiper" ref={swiperRef}>
        <div className="swiper-wrapper">
          {data.map((event) => (
            <EventCard
              key={event.id}
              title={event.title}
              image={event.image}
              location={event.location}
              date={event.date}
            />
          ))}
        </div>

        <div className="swiper-button-next"><i className="ph ph-caret-right"></i></div>
        <div className="swiper-button-prev"><i className="ph ph-caret-left"></i></div>
      </div>
    </section>
  )
}

