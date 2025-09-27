'use client'

import React from 'react'
import Sidebar from '@/components/Sidebar'
import GreetingSection from '@/components/GreetingSection'
import ClubsSection from '@/components/ClubsSection'
import TeachersSection from '@/components/TeachersSection'
import EventsSection from '@/components/EventsSection'

export default function Home() {
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

