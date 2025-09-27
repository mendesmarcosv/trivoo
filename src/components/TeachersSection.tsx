import { useSwiper } from '@/lib/hooks/useSwiper'
import data from '../data/teacherData.json'
import TeacherCard from './TeacherCard'

export default function TeachersSection() {
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
        <h3>Professores recomendados</h3>
        <a href="#" className="see-all">Ver todos</a>
      </div>

      <div className="swiper teachers-swiper" ref={swiperRef}>
        <div className="swiper-wrapper">
          {data.map((teacher) => (
            <TeacherCard
              key={teacher.id}
              name={teacher.name}
              sport={teacher.sport}
              rating={teacher.rating}
              location={teacher.location}
              avatar={teacher.avatar}
            />
          ))}
        </div>

        <div className="swiper-button-next"><i className="ph ph-caret-right"></i></div>
        <div className="swiper-button-prev"><i className="ph ph-caret-left"></i></div>
      </div>
    </section>
  )
}

