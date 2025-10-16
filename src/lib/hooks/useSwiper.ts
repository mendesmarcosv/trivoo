'use client'

import { useEffect, useRef } from 'react'

interface SwiperOptions {
  slidesPerView?: number | 'auto'
  spaceBetween?: number
  navigation?: {
    nextEl?: string
    prevEl?: string
  }
  breakpoints?: Record<number, any>
  on?: Record<string, Function>
}

export function useSwiper(options: SwiperOptions = {}) {
  const swiperRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const setArrowVisibility = (swiper: any) => {
      const nextBtn = containerRef.current?.querySelector('.swiper-button-next') as HTMLElement
      const prevBtn = containerRef.current?.querySelector('.swiper-button-prev') as HTMLElement

      if (!nextBtn || !prevBtn || !swiper) return

      const isEnd = swiper.isEnd
      const isBeginning = swiper.isBeginning
      
      // Verificar se o último slide está visível
      const slides = containerRef.current?.querySelectorAll('.swiper-slide') as NodeListOf<HTMLElement>
      const lastSlide = slides[slides.length - 1]
      
      let isLastSlideFullyVisible = false
      
      if (lastSlide && containerRef.current) {
        try {
          const lastSlideRect = lastSlide.getBoundingClientRect()
          const containerRect = containerRef.current.getBoundingClientRect()
          
          // Último slide totalmente visível = borda direita dentro do container (com margem)
          isLastSlideFullyVisible = lastSlideRect.right <= containerRect.right + 10
        } catch (e) {
          // Fallback se der erro no getBoundingClientRect
          isLastSlideFullyVisible = false
        }
      }
      
      // Debug (comentar em produção)
      // console.log('Swiper check:', {
      //   isEnd,
      //   isBeginning,
      //   isLastSlideFullyVisible,
      //   slidesCount: slides?.length || 0
      // })
      
      // Seta direita: esconder se fim OU último slide visível
      if (isEnd || isLastSlideFullyVisible) {
        nextBtn.style.display = 'none'
      } else {
        nextBtn.style.display = 'grid'
      }
      
      // Seta esquerda: esconder se no início
      if (isBeginning) {
        prevBtn.style.display = 'none'
      } else {
        prevBtn.style.display = 'grid'
      }
    }

    const defaultOptions = {
      slidesPerView: 'auto',
      spaceBetween: 16,
      slidesPerGroup: 1,
      centeredSlides: false,
      grabCursor: true,
      resistanceRatio: 0, // Impede drag além dos limites
      watchSlidesProgress: true,
      touchReleaseOnEdges: true, // Libera touch nos limites
      touchEventsTarget: 'container',
      simulateTouch: true,
      allowTouchMove: true,
      edgeSwipeDetection: false, // Desabilita detecção de swipe na borda
      preventInteractionOnTransition: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      on: {
        afterInit: (swiper: any) => {
          // Aguardar o DOM estabilizar antes de calcular
          setTimeout(() => {
            // Primeiro: configurar visibilidade das setas
            setArrowVisibility(swiper)
            
            // Segundo: equalizar altura
            const slides = swiper.slides
            if (slides && slides.length > 0) {
              let maxHeight = 0
              
              // Resetar e encontrar altura máxima
              slides.forEach((slide: HTMLElement) => {
                const article = slide.querySelector('article')
                if (article) {
                  article.style.height = 'auto'
                  const height = article.offsetHeight
                  if (height > maxHeight) maxHeight = height
                }
              })
              
              // Aplicar altura máxima
              slides.forEach((slide: HTMLElement) => {
                const article = slide.querySelector('article')
                if (article) {
                  article.style.height = `${maxHeight}px`
                }
              })
              
              // Verificar novamente as setas após ajustar altura
              setTimeout(() => setArrowVisibility(swiper), 10)
            }
          }, 100) // Delay maior para estabilizar
        },
        slideChange: setArrowVisibility,
        reachBeginning: setArrowVisibility,
        reachEnd: (swiper: any) => {
          setArrowVisibility(swiper)
          swiper.allowSlideNext = false
        },
        fromEdge: (swiper: any) => {
          swiper.allowSlideNext = true
          swiper.allowSlidePrev = true
        },
        touchStart: (swiper: any) => {
          const slides = containerRef.current?.querySelectorAll('.swiper-slide') as NodeListOf<HTMLElement>
          const lastSlide = slides[slides.length - 1]
          
          if (lastSlide && containerRef.current) {
            const lastSlideRect = lastSlide.getBoundingClientRect()
            const containerRect = containerRef.current.getBoundingClientRect()
            const isLastSlideVisible = lastSlideRect.right <= containerRect.right + 10
            
            if (isLastSlideVisible) {
              swiper.allowSlideNext = false
            }
          }
          
          if (swiper.isBeginning) {
            swiper.allowSlidePrev = false
          }
        },
        touchEnd: (swiper: any) => {
          setTimeout(() => {
            if (!swiper.isEnd) swiper.allowSlideNext = true
            if (!swiper.isBeginning) swiper.allowSlidePrev = true
          }, 100)
        },
        touchMove: (swiper: any) => {
          const slides = containerRef.current?.querySelectorAll('.swiper-slide') as NodeListOf<HTMLElement>
          const lastSlide = slides[slides.length - 1]
          
          if (lastSlide && containerRef.current) {
            const lastSlideRect = lastSlide.getBoundingClientRect()
            const containerRect = containerRef.current.getBoundingClientRect()
            const isLastSlideVisible = lastSlideRect.right <= containerRect.right + 10
            
            if (isLastSlideVisible && swiper.touches.diff < 0) {
              return false
            }
          }
          
          if (swiper.isBeginning && swiper.touches.diff > 0) {
            return false
          }
        },
        transitionEnd: (swiper: any) => {
          // Verificar setas após qualquer transição
          setTimeout(() => setArrowVisibility(swiper), 10)
        },
        resize: setArrowVisibility,
        update: setArrowVisibility,
      },
      ...options
    }

    // Aguardar um pouco para garantir que o DOM esteja pronto
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).Swiper && containerRef.current) {
        swiperRef.current = new (window as any).Swiper(containerRef.current, defaultOptions)
      }
    }, 200)

    return () => {
      clearTimeout(timer)
      if (swiperRef.current) {
        swiperRef.current.destroy()
      }
    }
  }, [options])

  return {
    swiperRef: containerRef,
    swiper: swiperRef.current
  }
}
