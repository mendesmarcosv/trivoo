'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface PageTransitionProps {
  children: React.ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayChildren, setDisplayChildren] = useState(children)

  useEffect(() => {
    if (displayChildren !== children) {
      setIsTransitioning(true)
      
      const timeout = setTimeout(() => {
        setDisplayChildren(children)
        setIsTransitioning(false)
      }, 150) // Transição rápida

      return () => clearTimeout(timeout)
    }
  }, [children, displayChildren])

  return (
    <div 
      className={`transition-opacity duration-150 ease-in-out ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {displayChildren}
    </div>
  )
}
