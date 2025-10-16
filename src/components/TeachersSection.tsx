import { useSwiper } from '@/lib/hooks/useSwiper'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import HomeTeacherCard from './HomeTeacherCard'
import HomeSectionSkeleton from './HomeSectionSkeleton'

interface Teacher {
  id: string
  name: string
  sport: string
  rating: number
  location: string
  avatar_url: string
}

interface TeachersSectionProps {
  data?: Teacher[]
}

export default function TeachersSection({ data }: TeachersSectionProps) {
  const [teachers, setTeachers] = useState<Teacher[]>(data || [])
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
      setTeachers(data)
      setLoading(false)
      return
    }
  }, [data])

  // Só buscar dados se não foram passados via props
  useEffect(() => {
    if (data) return // Se já tem dados, não buscar

    const fetchTeachers = async () => {
      try {
        const { data: fetchedData, error } = await supabase
          .from('teachers')
          .select('*')
          .limit(10)

        if (error) throw error

        if (fetchedData) {
          console.log('Dados dos professores do Supabase:', fetchedData)
          setTeachers(fetchedData)
        }
      } catch (error) {
        console.error('Erro ao buscar professores:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeachers()
  }, [data])

  // Mostrar skeleton enquanto carrega
  if (loading) {
    return <HomeSectionSkeleton title="Professores recomendados" cardType="teacher" />
  }

  // Não renderizar se não há dados (após carregar)
  if (teachers.length === 0) return null

  return (
    <section className="section">
      <div className="section-header">
        <h3>Professores recomendados</h3>
        <a href="/explorar?tab=teachers" className="see-all">Ver todos</a>
      </div>

      <div className="swiper teachers-swiper" ref={swiperRef}>
        <div className="swiper-wrapper">
          {teachers.map((teacher) => (
            <HomeTeacherCard
              key={teacher.id}
              id={teacher.id}
              name={teacher.name}
              sport={teacher.sport}
              rating={teacher.rating.toFixed(1)}
              location={teacher.location}
              avatar={teacher.avatar_url}
            />
          ))}
        </div>

        <div className="swiper-button-next"><i className="ph ph-caret-right"></i></div>
        <div className="swiper-button-prev"><i className="ph ph-caret-left"></i></div>
      </div>
    </section>
  )
}

