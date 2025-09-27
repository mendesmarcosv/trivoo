import { useSwiper } from '@/lib/hooks/useSwiper'
import data from '../data/clubData.json'
import ClubCard from './ClubCard'

export default function ClubsSection() {
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
        <h3>Clubes & Centros de Treinamentos</h3>
        <a href="#" className="see-all">Ver todos</a>
      </div>

      <div className="swiper clubs-swiper" ref={swiperRef}>
        <div className="swiper-wrapper">
          {data.map((club) => (
            <ClubCard
              key={club.id}
              title={club.title}
              distance={club.distance}
              image={club.image}
              chips={club.chips}
            />
          ))}
        </div>
        
        <div className="swiper-button-next"><i className="ph ph-caret-right"></i></div>
        <div className="swiper-button-prev"><i className="ph ph-caret-left"></i></div>
      </div>
    </section>
  )
}

