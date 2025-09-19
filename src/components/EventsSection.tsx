import { useSwiper } from '@/lib/hooks/useSwiper'

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
          <div className="swiper-slide">
            <article className="event-card">
              <div className="thumb"><img src="https://placehold.co/239x135" alt="Evento" /></div>
              <div className="event-body">
                <h4>Trilha de Orientação Camboinhas</h4>
                <div className="event-meta"><i className="ph ph-map-pin"></i><span>Parque Estadual da Serra da Tiririca (acesso Camboinhas)</span></div>
                <div className="event-meta"><i className="ph ph-calendar"></i><span>Sábado, 14 de Out às 08:30</span></div>
              </div>
            </article>
          </div>

          <div className="swiper-slide">
            <article className="event-card">
              <div className="thumb"><img src="https://placehold.co/239x135" alt="Evento" /></div>
              <div className="event-body">
                <h4>Night Parkour Meetup</h4>
                <div className="event-meta"><i className="ph ph-map-pin"></i><span>Esplanada do Caminho Niemeyer</span></div>
                <div className="event-meta"><i className="ph ph-calendar"></i><span>Quinta, 09 de Out às 19:00</span></div>
              </div>
            </article>
          </div>

          <div className="swiper-slide">
            <article className="event-card">
              <div className="thumb"><img src="https://placehold.co/239x135" alt="Evento" /></div>
              <div className="event-body">
                <h4>Korfebol Aberto da Baía</h4>
                <div className="event-meta"><i className="ph ph-map-pin"></i><span>Quadra Poliesportiva São Lourenço</span></div>
                <div className="event-meta"><i className="ph ph-calendar"></i><span>Sábado, 18 de Out às 09:00</span></div>
              </div>
            </article>
          </div>

          <div className="swiper-slide">
            <article className="event-card">
              <div className="thumb"><img src="https://placehold.co/239x135" alt="Evento" /></div>
              <div className="event-body">
                <h4>Circuito Inclusivo - Bocha na Praça</h4>
                <div className="event-meta"><i className="ph ph-map-pin"></i><span>Praça Estephânia de Carvalho</span></div>
                <div className="event-meta"><i className="ph ph-calendar"></i><span>Terça, 25 de Out às 15:00</span></div>
              </div>
            </article>
          </div>

          <div className="swiper-slide">
            <article className="event-card">
              <div className="thumb"><img src="https://placehold.co/239x135" alt="Evento" /></div>
              <div className="event-body">
                <h4>Open de Esgrima — Iniciação & Amistoso</h4>
                <div className="event-meta"><i className="ph ph-map-pin"></i><span>Sala de Esgrima São Domingos</span></div>
                <div className="event-meta"><i className="ph ph-calendar"></i><span>Sábado, 01 de Nov às 20:00</span></div>
              </div>
            </article>
          </div>

          <div className="swiper-slide">
            <article className="event-card">
              <div className="thumb"><img src="https://placehold.co/239x135" alt="Evento" /></div>
              <div className="event-body">
                <h4>Slackline Festival - Lagoa de Piratininga</h4>
                <div className="event-meta"><i className="ph ph-map-pin"></i><span>Gramado central da Lagoa de Piratininga</span></div>
                <div className="event-meta"><i className="ph ph-calendar"></i><span>Sábado, 08 de Nov às 08:30</span></div>
              </div>
            </article>
          </div>

          <div className="swiper-slide">
            <article className="event-card">
              <div className="thumb"><img src="https://placehold.co/239x135" alt="Evento" /></div>
              <div className="event-body">
                <h4>Patins Street Jam — Neves</h4>
                <div className="event-meta"><i className="ph ph-map-pin"></i><span>Praça do Skate em Neves</span></div>
                <div className="event-meta"><i className="ph ph-calendar"></i><span>Domingo, 16 de Nov às 09:30</span></div>
              </div>
            </article>
          </div>

          <div className="swiper-slide">
            <article className="event-card">
              <div className="thumb"><img src="https://placehold.co/239x135" alt="Evento" /></div>
              <div className="event-body">
                <h4>Clínica de Polo Aquático — Iniciantes</h4>
                <div className="event-meta"><i className="ph ph-map-pin"></i><span>Parque Aquático Santa Rosa</span></div>
                <div className="event-meta"><i className="ph ph-calendar"></i><span>Sábado, 22 de Nov às 09:30</span></div>
              </div>
            </article>
          </div>

          <div className="swiper-slide">
            <article className="event-card">
              <div className="thumb"><img src="https://placehold.co/239x135" alt="Evento" /></div>
              <div className="event-body">
                <h4>Lacrosse Day &mdash; Amistoso Misto</h4>
                <div className="event-meta"><i className="ph ph-map-pin"></i><span>Campo do Clube Ponta D&apos;Areia</span></div>
                <div className="event-meta"><i className="ph ph-calendar"></i><span>Sábado, 29 de Nov às 09:30</span></div>
              </div>
            </article>
          </div>

          <div className="swiper-slide">
            <article className="event-card">
              <div className="thumb"><img src="https://placehold.co/239x135" alt="Evento" /></div>
              <div className="event-body">
                <h4>Footgolf Aberto da Restinga</h4>
                <div className="event-meta"><i className="ph ph-map-pin"></i><span>Área de Lazer de Itaipuaçu</span></div>
                <div className="event-meta"><i className="ph ph-calendar"></i><span>Sábado, 06 de Dez às 08:00</span></div>
              </div>
            </article>
          </div>
        </div>
        <div className="swiper-button-next"><i className="ph ph-caret-right"></i></div>
        <div className="swiper-button-prev"><i className="ph ph-caret-left"></i></div>
      </div>
    </section>
  )
}

