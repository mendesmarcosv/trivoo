import { useSwiper } from '@/lib/hooks/useSwiper'

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
          <div className="swiper-slide">
            <article className="teacher-card">
              <header className="teacher-head">
                <div className="profile">
                  <img className="avatar-sm" src="https://placehold.co/32x32" alt="Victor" />
                  <div className="rating"><strong>4.9</strong><span>/5</span><i className="ph-fill ph-star"></i></div>
                </div>
                <h4>Victor Nascimento</h4>
                <span className="chip chip-grey">Tamboréu</span>
              </header>
              <footer className="teacher-footer">
                <i className="ph ph-map-pin"></i>
                <span>Praia de Charitas</span>
              </footer>
            </article>
          </div>

          <div className="swiper-slide">
            <article className="teacher-card">
              <header className="teacher-head">
                <div className="profile">
                  <img className="avatar-sm" src="https://placehold.co/32x32" alt="Helena" />
                  <div className="rating"><strong>4.7</strong><span>/5</span><i className="ph-fill ph-star"></i></div>
                </div>
                <h4>Helena Moraes</h4>
                <span className="chip chip-grey">Tamboréu</span>
              </header>
              <footer className="teacher-footer">
                <i className="ph ph-map-pin"></i>
                <span>Sala de Esgrima São Domingos</span>
              </footer>
            </article>
          </div>

          <div className="swiper-slide">
            <article className="teacher-card">
              <header className="teacher-head">
                <div className="profile">
                  <img className="avatar-sm" src="https://placehold.co/32x32" alt="Lucas" />
                  <div className="rating"><strong>4.4</strong><span>/5</span><i className="ph-fill ph-star"></i></div>
                </div>
                <h4>Lucas Prado</h4>
                <span className="chip chip-grey">Tamboréu</span>
              </header>
              <footer className="teacher-footer">
                <i className="ph ph-map-pin"></i>
                <span>Escadarias do Ingá</span>
              </footer>
            </article>
          </div>

          <div className="swiper-slide">
            <article className="teacher-card">
              <header className="teacher-head">
                <div className="profile">
                  <img className="avatar-sm" src="https://placehold.co/32x32" alt="Ana" />
                  <div className="rating"><strong>4.6</strong><span>/5</span><i className="ph-fill ph-star"></i></div>
                </div>
                <h4>Ana Bechara</h4>
                <span className="chip chip-grey">Tamboréu</span>
              </header>
              <footer className="teacher-footer">
                <i className="ph ph-map-pin"></i>
                <span>Orla da Boa Viagem</span>
              </footer>
            </article>
          </div>

          <div className="swiper-slide">
            <article className="teacher-card">
              <header className="teacher-head">
                <div className="profile">
                  <img className="avatar-sm" src="https://placehold.co/32x32" alt="Mateus" />
                  <div className="rating"><strong>4.5</strong><span>/5</span><i className="ph-fill ph-star"></i></div>
                </div>
                <h4>Mateus Furlan</h4>
                <span className="chip chip-grey">Tamboréu</span>
              </header>
              <footer className="teacher-footer">
                <i className="ph ph-map-pin"></i>
                <span>Complexo Aquático Pendotiba</span>
              </footer>
            </article>
          </div>

          <div className="swiper-slide">
            <article className="teacher-card">
              <header className="teacher-head">
                <div className="profile">
                  <img className="avatar-sm" src="https://placehold.co/32x32" alt="Clarice" />
                  <div className="rating"><strong>4.8</strong><span>/5</span><i className="ph-fill ph-star"></i></div>
                </div>
                <h4>Clarice Neri</h4>
                <span className="chip chip-grey">Tamboréu</span>
              </header>
              <footer className="teacher-footer">
                <i className="ph ph-map-pin"></i>
                <span>Arena de Squash Santa Rosa</span>
              </footer>
            </article>
          </div>

          <div className="swiper-slide">
            <article className="teacher-card">
              <header className="teacher-head">
                <div className="profile">
                  <img className="avatar-sm" src="https://placehold.co/32x32" alt="Rogério" />
                  <div className="rating"><strong>4.3</strong><span>/5</span><i className="ph-fill ph-star"></i></div>
                </div>
                <h4>Rogério Saito</h4>
                <span className="chip">Tamboréu</span>
              </header>
              <footer className="teacher-footer">
                <i className="ph ph-map-pin"></i>
                <span>Centro de Treino Várzea das Moças</span>
              </footer>
            </article>
          </div>

          <div className="swiper-slide">
            <article className="teacher-card">
              <header className="teacher-head">
                <div className="profile">
                  <img className="avatar-sm" src="https://placehold.co/32x32" alt="Naomi" />
                  <div className="rating"><strong>4.9</strong><span>/5</span><i className="ph-fill ph-star"></i></div>
                </div>
                <h4>Naomi Tanaka</h4>
                <span className="chip">Tamboréu</span>
              </header>
              <footer className="teacher-footer">
                <i className="ph ph-map-pin"></i>
                <span>Ginásio São Domingos</span>
              </footer>
            </article>
          </div>

          <div className="swiper-slide">
            <article className="teacher-card">
              <header className="teacher-head">
                <div className="profile">
                  <img className="avatar-sm" src="https://placehold.co/32x32" alt="Gabriel" />
                  <div className="rating"><strong>4.2</strong><span>/5</span><i className="ph-fill ph-star"></i></div>
                </div>
                <h4>Gabriel Mitter</h4>
                <span className="chip">Tamboréu</span>
              </header>
              <footer className="teacher-footer">
                <i className="ph ph-map-pin"></i>
                <span>Campo Caio Martins</span>
              </footer>
            </article>
          </div>

          <div className="swiper-slide">
            <article className="teacher-card">
              <header className="teacher-head">
                <div className="profile">
                  <img className="avatar-sm" src="https://placehold.co/32x32" alt="Yara" />
                  <div className="rating"><strong>4.5</strong><span>/5</span><i className="ph-fill ph-star"></i></div>
                </div>
                <h4>Yara Potiguara</h4>
                <span className="chip">Tamboréu</span>
              </header>
              <footer className="teacher-footer">
                <i className="ph ph-map-pin"></i>
                <span>Área Verde Maria Paula</span>
              </footer>
            </article>
          </div>

          <div className="swiper-slide">
            <article className="teacher-card">
              <header className="teacher-head">
                <div className="profile">
                  <img className="avatar-sm" src="https://placehold.co/32x32" alt="Bruno" />
                  <div className="rating"><strong>4.6</strong><span>/5</span><i className="ph-fill ph-star"></i></div>
                </div>
                <h4>Bruno Dantas</h4>
                <span className="chip">Tamboréu</span>
              </header>
              <footer className="teacher-footer">
                <i className="ph ph-map-pin"></i>
                <span>Climb House Pendotiba</span>
              </footer>
            </article>
          </div>
        </div>
        <div className="swiper-button-next"><i className="ph ph-caret-right"></i></div>
        <div className="swiper-button-prev"><i className="ph ph-caret-left"></i></div>
      </div>
    </section>
  )
}

