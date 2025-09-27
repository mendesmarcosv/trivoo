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

      // Usar a API do Swiper para verificar se está no fim
      const isEnd = swiper.isEnd
      const isBeginning = swiper.isBeginning
      
      // Verificar também se o último slide está visível
      const slides = containerRef.current?.querySelectorAll('.swiper-slide') as NodeListOf<HTMLElement>
      const lastSlide = slides[slides.length - 1]
      
      if (lastSlide && containerRef.current) {
        const lastSlideRect = lastSlide.getBoundingClientRect()
        const containerRect = containerRef.current.getBoundingClientRect()
        
        // Verificar se o último slide está completamente visível
        const isLastSlideFullyVisible = lastSlideRect.right <= containerRect.right + 10 // pequena margem de tolerância
        
        // Esconder botão next se estiver no fim OU se o último slide estiver visível
        if (nextBtn) {
          nextBtn.style.display = (isEnd || isLastSlideFullyVisible) ? 'none' : 'grid'
        }
        
        // Esconder botão prev se estiver no início
        if (prevBtn) {
          prevBtn.style.display = isBeginning ? 'none' : 'grid'
        }
      } else {
        // Fallback para o comportamento original
        if (nextBtn) nextBtn.style.display = isEnd ? 'none' : 'grid'
        if (prevBtn) prevBtn.style.display = isBeginning ? 'none' : 'grid'
      }
    }

    const defaultOptions = {
      slidesPerView: 'auto',
      spaceBetween: 16,
      slidesPerGroup: 1,
      centeredSlides: false,
      grabCursor: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      on: {
        afterInit: setArrowVisibility,
        slideChange: setArrowVisibility,
        reachBeginning: setArrowVisibility,
        reachEnd: setArrowVisibility,
        resize: setArrowVisibility,
        slidePrevTransitionEnd: setArrowVisibility,
        slideNextTransitionEnd: setArrowVisibility,
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
