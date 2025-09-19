'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import Sidebar from '@/components/Sidebar'
import GreetingSection from '@/components/GreetingSection'
import ClubsSection from '@/components/ClubsSection'
import TeachersSection from '@/components/TeachersSection'
import EventsSection from '@/components/EventsSection'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#4C5E18] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const handleAuthClick = () => {
    // Esta função não será mais usada, mas mantemos para compatibilidade
  }

  return (
    <div className="layout">
      <Sidebar onAuthClick={handleAuthClick} />
      <main className="content">
        <GreetingSection />
        <ClubsSection />
        <TeachersSection />
        <EventsSection />
      </main>
    </div>
  )
}

