'use client'

import React, { useMemo, useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import { useAuth } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

interface Question {
  id: string
  text: string
  tags: string[]
  color: string
}

interface ScoredSport {
  name: string
  score: number
  reasons: string[]
}

const QUESTIONS: Question[] = [
  { id: 'q1', text: 'Você curte esportes de aventura ou equilíbrio?', tags: ['Escalada esportiva (indoor)', 'Slackline'], color: '#FFD166' },
  { id: 'q2', text: 'Prefere esportes aquáticos?', tags: ['Polo aquático', 'Biribol'], color: '#06D6A0' },
  { id: 'q3', text: 'Gosta de esportes de precisão?', tags: ['Bocha (versão convencional)', 'Footgolf'], color: '#FCA311' },
  { id: 'q4', text: 'Topa esportes de combate?', tags: ['Esgrima', 'Sumô'], color: '#EF476F' },
  { id: 'q5', text: 'Curte esportes coletivos menos tradicionais?', tags: ['Korfebol', 'Ultimate Frisbee', 'Kinball', 'Floorball'], color: '#43AA8B' },
  { id: 'q6', text: 'Prefere algo com raquete?', tags: ['Squash', 'Tamboréu'], color: '#4CC9F0' },
  { id: 'q7', text: 'Se interessa por tecnologia e drones?', tags: ['Corrida de drones (FPV)'], color: '#FFB703' },
  { id: 'q8', text: 'Gosta de velocidade e patins?', tags: ['Patins street'], color: '#F3722C' },
  { id: 'q9', text: 'Curte orientação na natureza?', tags: ['Orientação', 'Parkour'], color: '#90BE6D' },
  { id: 'q10', text: 'Você curte tacos, bolas e estratégia?', tags: ['Lacrosse', 'Hóquei sobre grama'], color: '#118AB2' },
]

// Descrições curtas dos esportes para justificar recomendações
const SPORT_BLURBS: Record<string, string> = {
  'Escalada esportiva (indoor)': 'Trabalha força, técnica e foco em ambiente controlado; ótima para quem curte desafio e movimento vertical.',
  'Slackline': 'Exige equilíbrio e concentração, com progressão divertida ao ar livre ou indoor.',
  'Polo aquático': 'Coletivo e intenso, mistura natação, força de tronco e estratégia dentro da piscina.',
  'Biribol': 'Vôlei adaptado para a água, baixo impacto nas articulações e dinâmica divertida.',
  'Bocha (versão convencional)': 'Esporte de precisão e estratégia, excelente para trabalhar controle fino e calma.',
  'Footgolf': 'Combina futebol com golfe: precisão de chute, leitura de terreno e estratégia em campo.',
  'Esgrima': 'Combate com alta velocidade de reação, técnica e leitura do oponente.',
  'Sumô': 'Força, explosão e centro de gravidade — duelos curtos e intensos em tatame.',
  'Korfebol': 'Coletivo misto, sem contato brusco e com circulação constante — foco em passe e posicionamento.',
  'Ultimate Frisbee': 'Coletivo, fair play e muita corrida; exige passe preciso e leitura de espaço.',
  'Kinball': 'Jogado com bola gigante, cooperativo e dinâmico, ótimo para integração do grupo.',
  'Floorball': 'Parecido com hóquei indoor, rápido e técnico, excelente para reflexos e coordenação.',
  'Squash': 'Esporte de raquete muito intenso em espaço reduzido; acelera reflexos e explosão.',
  'Tamboréu': 'Raquete brasileira de praia/quadra, contato com sol e ritmo técnico/moderado.',
  'Corrida de drones (FPV)': 'Tecnologia e coordenação fina; pilotagem em primeira pessoa com alta adrenalina.',
  'Patins street': 'Equilíbrio, criatividade e fluidez urbana; evolução com manobras e deslocamentos.',
  'Orientação': 'Navegação com mapa e bússola, une caminhada/corrida e tomada de decisão ao ar livre.',
  'Parkour': 'Deslocamento eficiente e criativo pelo ambiente; força funcional e coordenação.',
  'Lacrosse': 'Coletivo veloz com sticks; trabalha resistência, domínio de bola e estratégia.',
  'Hóquei sobre grama': 'Coletivo técnico e tático, com passes rápidos e ocupação de espaço constante.'
}

function listReasons(reasons: string[]): string {
  const sample = reasons.slice(0, 2).map(r => r.toLowerCase())
  if (sample.length === 0) return ''
  if (sample.length === 1) return sample[0]
  return `${sample[0]} e ${sample[1]}`
}

export default function SwipePage() {
  const { loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [index, setIndex] = useState(0)
  const [likes, setLikes] = useState<string[]>([])
  const [dislikes, setDislikes] = useState<string[]>([])
  const Confetti = useMemo(() => dynamic(() => import('react-confetti'), { ssr: false }), [])
  const [confettiActive, setConfettiActive] = useState(false)
  const [viewport, setViewport] = useState({ width: 0, height: 0 })

  const current = QUESTIONS[index]

  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [loading, isAuthenticated, router])

  const onVote = (liked: boolean) => {
    if (!current) return
    if (liked) setLikes(prev => [...prev, current.id])
    else setDislikes(prev => [...prev, current.id])
    setIndex(prev => prev + 1)
  }

  // Lógica de recomendação: soma +1 para cada esporte presente nas perguntas curtidas
  const recommendations = useMemo(() => {
    if (index < QUESTIONS.length) return [] as ScoredSport[]
    const scoreMap = new Map<string, number>()
    const reasonsMap = new Map<string, Set<string>>()
    for (const q of QUESTIONS) {
      const liked = likes.includes(q.id)
      if (!liked) continue
      for (const sport of q.tags) {
        scoreMap.set(sport, (scoreMap.get(sport) || 0) + 1)
        if (!reasonsMap.has(sport)) reasonsMap.set(sport, new Set())
        reasonsMap.get(sport)!.add(q.text)
      }
    }
    return Array.from(scoreMap.entries())
      .map(([name, score]) => ({ name, score, reasons: Array.from(reasonsMap.get(name) || []) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
  }, [likes, index])

  // Cart interativo com drag (tinder-like) simples
  const [dragStartX, setDragStartX] = useState<number | null>(null)
  const [dragX, setDragX] = useState(0)
  const likeOpacity = Math.min(Math.max(dragX / 120, 0), 1)
  const dislikeOpacity = Math.min(Math.max(-dragX / 120, 0), 1)
  
  // Detectar se é mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
  const centerFeedbackOpacity = Math.max(likeOpacity, dislikeOpacity)
  const centerFeedbackIsLike = likeOpacity >= dislikeOpacity

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    setDragStartX(e.clientX)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragStartX === null) return
    e.preventDefault()
    setDragX(e.clientX - dragStartX)
  }
  const onPointerUp = () => {
    if (dragStartX === null) return
    const threshold = isMobile ? 60 : 80 // Threshold menor para mobile
    if (dragX > threshold) onVote(true)
    else if (dragX < -threshold) onVote(false)
    setDragX(0)
    setDragStartX(null)
  }

  // Eventos de touch para melhor compatibilidade mobile
  const onTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    setDragStartX(touch.clientX)
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (dragStartX === null) return
    e.preventDefault()
    const touch = e.touches[0]
    setDragX(touch.clientX - dragStartX)
  }
  const onTouchEnd = () => {
    if (dragStartX === null) return
    const threshold = isMobile ? 60 : 80
    if (dragX > threshold) onVote(true)
    else if (dragX < -threshold) onVote(false)
    setDragX(0)
    setDragStartX(null)
  }

  // Confetti quando finalizar (infinitamente)
  useEffect(() => {
    if (index >= QUESTIONS.length) {
      setConfettiActive(true)
    } else {
      setConfettiActive(false)
    }
  }, [index])

  useEffect(() => {
    const update = () => setViewport({ width: window.innerWidth, height: window.innerHeight })
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Renderiza até 3 cartas empilhadas (efeito baralho)
  const renderStack = () => {
    const stack = [0, 1, 2]
      .map(offset => ({ q: QUESTIONS[index + offset], offset }))
      .filter(item => !!item.q) as { q: Question; offset: number }[]

    // Tamanhos responsivos para os cards
    const cardWidth = isMobile ? 280 : 320
    const cardHeight = isMobile ? 420 : 480
    
    return (
      <div style={{ position: 'relative', width: cardWidth, height: cardHeight, maxWidth: '90%' }}>
        {stack
          .reverse() // renderiza do fundo para frente
          .map(({ q, offset }) => {
            const isTop = offset === 0
            const baseRotate = isTop ? dragX / 30 : offset === 1 ? 4 : -3
            const baseTranslateY = isTop ? 0 : offset * 10
            const baseScale = isTop ? 0.98 : offset === 1 ? 0.96 : 0.94
            const zIndex = isTop ? 3 : offset === 1 ? 2 : 1

            return (
              <div
                key={q.id}
                onPointerDown={isTop ? onPointerDown : undefined}
                onPointerMove={isTop ? onPointerMove : undefined}
                onPointerUp={isTop ? onPointerUp : undefined}
                onTouchStart={isTop ? onTouchStart : undefined}
                onTouchMove={isTop ? onTouchMove : undefined}
                onTouchEnd={isTop ? onTouchEnd : undefined}
                style={{
                  position: 'absolute',
                  inset: 0,
                  margin: '0 auto',
                  background: q.color,
                  borderRadius: 20,
                  padding: 22,
                  transform: `translateY(${baseTranslateY}px) scale(${baseScale}) rotate(${baseRotate}deg) translateX(${isTop ? dragX : 0}px)`,
                  transition: dragStartX === null ? 'transform 240ms cubic-bezier(.22,.61,.36,1)' : 'none',
                  cursor: isTop ? 'grab' : 'default',
                  userSelect: 'none',
                  zIndex: zIndex + 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}
              >
                {/* Feedback central com blur no CARD (conteúdo) + ícone sólido */}
                {isTop && centerFeedbackOpacity > 0 && (
                  <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) scale(${0.9 + centerFeedbackOpacity * 0.2})`,
                    opacity: centerFeedbackOpacity,
                    width: 120,
                    height: 120,
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    background: centerFeedbackIsLike ? 'rgba(34,197,94,1)' : 'rgba(239,68,68,1)',
                    filter: 'none'
                  }}>
                    <i className={`ph ${centerFeedbackIsLike ? 'ph-thumbs-up' : 'ph-thumbs-down'}`} style={{ fontSize: 44 }}></i>
                  </div>
                )}

                {/* Conteúdo do card (aplicamos blur aqui quando arrastando) */}
                <div style={{ filter: isTop && centerFeedbackOpacity > 0 ? `blur(${8 * centerFeedbackOpacity}px)` : 'none' }}>
                  <div style={{ marginBottom: 10 }}>
                    <span style={{ color: 'var(--ink-900)', fontWeight: 700, fontSize: 13 }}>Pergunta {index + offset + 1} de {QUESTIONS.length}</span>
                  </div>
                  <h2 style={{ fontSize: 22, lineHeight: '30px', color: 'var(--ink-900)' }}>{q.text}</h2>
                </div>
              </div>
            )
          })}
      </div>
    )
  }

  return (
    <div className="layout" style={{ background: '#B5D539', minHeight: '100vh' }}>
      <style jsx global>{`
        .sidebar { background: #B5D539 !important; }
        @media (max-width: 768px) {
          .sidebar { background: white !important; }
        }
        .content { background: transparent !important; }
      `}</style>
      <Sidebar />
      <main className="content" style={{ background: 'transparent' }}>
        <section className="greeting-and-promo" style={{ minHeight: 'calc(100vh - 100px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', width: '100%', position: 'relative', paddingTop: '20px' }}>
          {/* Background centralizado */}
          <div style={{
            position: 'absolute',
            top: isMobile ? '60%' : '50%',
            left: isMobile ? '48%' : '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
            pointerEvents: 'none',
            width: isMobile ? '130vw' : 'auto',
            height: isMobile ? '130vh' : 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src="/images/backgrounds/frame-assets-swipe.webp" 
              alt="Background frame" 
              style={{ 
                width: isMobile ? '130%' : 'auto', 
                height: isMobile ? '130%' : 'auto', 
                maxWidth: 'none',
                maxHeight: 'none',
                objectFit: 'contain',
                opacity: 1 
              }} 
            />
          </div>
          
          <div className="greeting" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, position: 'relative', zIndex: 2 }}>
            {/* Título e subtítulo */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <h2 style={{ fontSize: '32px', fontWeight: 700, color: 'var(--ink-900)', margin: '0 0 8px 0', textTransform: 'none' }}>
                Descubra Seu Esporte
              </h2>
              <p style={{ fontSize: '24px', fontWeight: 500, color: 'var(--ink-700)', margin: 0, textTransform: 'none' }}>
                Responda às perguntas!
              </p>
            </div>
            
            {/* Cards (stack) */}
            {index < QUESTIONS.length && renderStack()}

            {/* Botões redondos fora dos cards */}
            {index < QUESTIONS.length && (
              <div style={{ display: 'flex', gap: 28, marginTop: 24 }}>
                <button
                  onClick={() => onVote(false)}
                  aria-label="dislike"
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    boxShadow: 'none'
                  }}
                >
                  <i className="ph ph-thumbs-down" style={{ fontSize: 24 }}></i>
                </button>
                <button
                  onClick={() => onVote(true)}
                  aria-label="like"
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: '#22c55e',
                    color: 'white',
                    border: 'none',
                    boxShadow: 'none'
                  }}
                >
                  <i className="ph ph-thumbs-up" style={{ fontSize: 24 }}></i>
                </button>
              </div>
            )}

            {index >= QUESTIONS.length && (
              <div style={{ width: '100%', maxWidth: '520px', background: 'white', borderRadius: 24, padding: 24, textAlign: 'center', position: 'relative', zIndex: 5, margin: '0 16px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: 12, 
                  marginBottom: 24,
                  background: '#CCE56A',
                  borderRadius: 16,
                  padding: '16px 20px',
                  width: 'fit-content',
                  margin: '0 auto 24px auto'
                }}>
                  <img 
                    src="/images/badges/result-badge-trofeu.webp" 
                    alt="Troféu" 
                    style={{ width: 32, height: 32 }} 
                  />
                  <h2 style={{ fontSize: 24, color: '#3B3B3B', margin: 0, textAlign: 'center', fontWeight: 700 }}>Recomendamos para você</h2>
                </div>
                <div style={{ marginTop: 20 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
                    {recommendations.length > 0 ? (
                      recommendations.slice(0, 3).map((s, index) => {
                        const colors = ['#B5D539', '#EDC843', '#A0E1E1']
                        return (
                          <div key={s.name} style={{
                            background: colors[index],
                            color: '#111827',
                            borderRadius: 16,
                            padding: '16px 14px',
                            fontWeight: 800,
                            fontSize: 18,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: 64
                          }}>
                            {s.name}
                          </div>
                        )
                      })
                    ) : (
                      <>
                        <div style={{
                          background: '#B5D539',
                          color: '#111827',
                          borderRadius: 16,
                          padding: '16px 14px',
                          fontWeight: 800,
                          fontSize: 18,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minHeight: 64
                        }}>
                          Descubra novos esportes!
                        </div>
                        <div style={{
                          background: '#EDC843',
                          color: '#111827',
                          borderRadius: 16,
                          padding: '16px 14px',
                          fontWeight: 800,
                          fontSize: 18,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minHeight: 64
                        }}>
                          Explore aventuras!
                        </div>
                        <div style={{
                          background: '#A0E1E1',
                          color: '#111827',
                          borderRadius: 16,
                          padding: '16px 14px',
                          fontWeight: 800,
                          fontSize: 18,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minHeight: 64
                        }}>
                          Experimente!
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Justificativas */}
                {recommendations.length > 0 && (
                  <div style={{
                    marginTop: 18,
                    background: '#F3F4F6',
                    borderRadius: 16,
                    padding: 16,
                    textAlign: 'left'
                  }}>
                    <h3 style={{ margin: '0 0 8px 0', color: 'var(--ink-800)', fontSize: 16, fontWeight: 700 }}>Por que esses esportes?</h3>
                    <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 10 }}>
                      {recommendations.map((s) => (
                        <li key={`why-${s.name}`} style={{ color: 'var(--ink-800)', lineHeight: '22px' }}>
                          <strong>{s.name}</strong>: {SPORT_BLURBS[s.name] || 'Boa combinação entre suas preferências e dinâmica do esporte.'}
                          {s.reasons.length > 0 && (
                            <span style={{ color: 'var(--ink-600)' }}> — alinhado com o que você curtiu: {listReasons(s.reasons)}.</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div style={{ marginTop: 20, display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <button
                    onClick={() => { setIndex(0); setLikes([]); setDislikes([]); }}
                    style={{
                      padding: '12px 22px',
                      background: '#CCE56A',
                      color: '#3B3B3B',
                      border: 'none',
                      borderRadius: 10,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}
                  >
                    <i className="ph ph-arrow-counter-clockwise" style={{ fontSize: 18 }}></i>
                    Refazer teste
                  </button>
                </div>
              </div>
            )}

            {/* confetti infinito e por trás dos cards (z-index menor) */}
            {index >= QUESTIONS.length && confettiActive && (
              <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
                <Confetti
                  width={viewport.width}
                  height={viewport.height}
                  numberOfPieces={200}
                  recycle={true}
                  gravity={0.06}
                  wind={0.001}
                  style={{ position: 'fixed', inset: 0 as any, pointerEvents: 'none', zIndex: 1 }}
                />
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}


