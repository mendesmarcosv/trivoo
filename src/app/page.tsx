'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { useHomeData } from '@/lib/hooks/useHomeData'
import Sidebar from '@/components/Sidebar'
import GreetingSection from '@/components/GreetingSection'
import ClubsSection from '@/components/ClubsSection'
import TeachersSection from '@/components/TeachersSection'
import EventsSection from '@/components/EventsSection'
import HomeSectionSkeleton from '@/components/HomeSectionSkeleton'

export default function Home() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { clubs, teachers, events, loading: dataLoading } = useHomeData()

  useEffect(() => {
    if (!authLoading && !user) {
      const timer = setTimeout(() => {
        router.push('/auth/login')
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [user, authLoading, router])

  const handleAuthClick = () => {
    // Esta função não será mais usada, mas mantemos para compatibilidade
  }

  return (
    <div className="layout">
      <Sidebar onAuthClick={handleAuthClick} />
      <main className="content">
        {/* Greeting - sempre renderizar, loading interno */}
        <GreetingSection />
        
        {/* Seções com loading inteligente */}
        {dataLoading ? (
          <>
            <HomeSectionSkeleton title="Clubes & Centros de Treinamentos" cardType="club" />
            <HomeSectionSkeleton title="Professores recomendados" cardType="teacher" />
            <HomeSectionSkeleton title="Eventos por perto" cardType="event" />
          </>
        ) : (
          <>
            {clubs.length > 0 && <ClubsSection data={clubs} />}
            {teachers.length > 0 && <TeachersSection data={teachers} />}
            {events.length > 0 && <EventsSection data={events} />}
          </>
        )}
      </main>
    </div>
  )
}

