import { useSwiper } from '@/lib/hooks/useSwiper'

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
          <div className="swiper-slide">
            <article className="club-card">
              <img className="card-bg" src="https://placehold.co/260x260" alt="Centro Horizonte" />
              <div className="overlay"></div>
              <div className="card-top">
                <span className="chip glass">~9 km</span>
              </div>
              <div className="card-body">
                <h4>Centro Horizonte</h4>
                <div className="chips">
                  <span className="chip glass">Goalball</span>
                  <span className="chip glass">Bocha paralímpica</span>
                </div>
              </div>
            </article>
          </div>

          <div className="swiper-slide">
            <article className="club-card">
              <img className="card-bg" src="https://placehold.co/262x262" alt="Boulder Lab" />
              <div className="overlay"></div>
              <div className="card-top">
                <span className="chip glass">~11 km</span>
              </div>
              <div className="card-body">
                <h4>Boulder Lab</h4>
                <div className="chips">
                  <span className="chip glass">Escalada indoor</span>
                  <span className="chip glass">Slackline</span>
                </div>
              </div>
            </article>
          </div>

          <div className="swiper-slide">
            <article className="club-card">
              <img className="card-bg" src="https://placehold.co/286x286" alt="KinBall & Floorball Hub" />
              <div className="overlay"></div>
              <div className="card-top">
                <span className="chip glass">~4 km</span>
              </div>
              <div className="card-body">
                <h4>KinBall & Floorball Hub</h4>
                <div className="chips">
                  <span className="chip glass">Kin-Ball</span>
                  <span className="chip glass">Floorball</span>
                </div>
              </div>
            </article>
          </div>

          <div className="swiper-slide">
            <article className="club-card">
              <img className="card-bg" src="https://placehold.co/260x260" alt="Campo Verde Footgolf" />
              <div className="overlay"></div>
              <div className="card-top">
                <span className="chip glass">~28 km</span>
              </div>
              <div className="card-body">
                <h4>Campo Verde Footgolf</h4>
                <div className="chips">
                  <span className="chip glass">Footgolf</span>
                  <span className="chip glass">Ultimate Frisbee</span>
                </div>
              </div>
            </article>
          </div>

          <div className="swiper-slide">
            <article className="club-card">
              <img className="card-bg" src="https://placehold.co/260x260" alt="Biribol & Natação" />
              <div className="overlay tint"></div>
              <div className="card-top">
                <span className="chip glass">~15 km</span>
              </div>
              <div className="card-body">
                <h4>Biribol & Natação Adaptada São Francisco</h4>
                <div className="chips">
                  <span className="chip glass">Biribol</span>
                  <span className="chip glass">Natação Adaptada</span>
                </div>
              </div>
            </article>
          </div>

          <div className="swiper-slide">
            <article className="club-card">
              <img className="card-bg" src="https://placehold.co/260x260" alt="Tamboréu Praia Clube" />
              <div className="overlay tint"></div>
              <div className="card-top">
                <span className="chip glass">~16 km</span>
              </div>
              <div className="card-body">
                <h4>Tamboréu Praia Clube</h4>
                <div className="chips">
                  <span className="chip glass">Tamboréu</span>
                  <span className="chip glass">Beach Ultimate</span>
                </div>
              </div>
            </article>
          </div>

          <div className="swiper-slide">
            <article className="club-card">
              <img className="card-bg" src="https://placehold.co/260x260" alt="Hangar 101" />
              <div className="overlay tint"></div>
              <div className="card-top">
                <span className="chip glass">~24 km</span>
              </div>
              <div className="card-body">
                <h4>Hangar 101</h4>
                <div className="chips">
                  <span className="chip glass">Corrida de Drone</span>
                </div>
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

