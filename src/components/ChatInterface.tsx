'use client'

import React, { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import TeacherCardChat from './TeacherCardChat'
import ClubCardChat from './ClubCardChat'
import EventCardChat from './EventCardChat'
import { useAuth } from '@/lib/hooks/useAuth'
import { useChatHistory } from '@/lib/hooks/useChatHistory'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatInterface() {
  const { user } = useAuth()
  
  // Só carrega histórico quando user estiver disponível
  const chatHistory = useChatHistory(user?.id)
  const {
    conversations = [],
    suggestions = [],
    createConversation,
    saveMessage,
    loadConversationMessages,
    deleteConversation
  } = chatHistory || {}

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSlowResponse, setIsSlowResponse] = useState(false)
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = (smooth = false) => {
    if (messagesContainerRef.current) {
      if (smooth) {
        messagesContainerRef.current.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: 'smooth'
        })
      } else {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
      }
    }
  }

  useEffect(() => {
    // Scroll ao fundo quando há mensagens novas
    if (messages.length > 0 && messagesContainerRef.current) {
      const container = messagesContainerRef.current
      const { scrollTop, scrollHeight, clientHeight } = container
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 200
      
      // Se estiver próximo ao bottom ou for a primeira mensagem, faz scroll
      if (isNearBottom || messages.length === 1) {
        setTimeout(() => {
          if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
          }
        }, 100)
      }
    }
  }, [messages])

  // Função para processar mensagem e extrair cards
  const processMessageContent = (content: string) => {
    let textContent = content
    const teachers: any[] = []
    const clubs: any[] = []
    const events: any[] = []
    let isLoadingCard = false

    // Procura por cards de professores
    const teacherCardRegex = /\[TEACHER_CARD\](.*?)\[\/TEACHER_CARD\]/gs
    const teacherMatches = content.match(teacherCardRegex)
    
    if (teacherMatches) {
      teacherMatches.forEach(match => {
        const jsonStr = match.replace('[TEACHER_CARD]', '').replace('[/TEACHER_CARD]', '')
        try {
          const teacherData = JSON.parse(jsonStr)
          teachers.push(teacherData)
          textContent = textContent.replace(match, '')
        } catch (e) {
          console.error('Erro ao parsear teacher card:', e)
        }
      })
    }

    // Procura por cards de clubes
    const clubCardRegex = /\[CLUB_CARD\](.*?)\[\/CLUB_CARD\]/gs
    const clubMatches = content.match(clubCardRegex)
    
    if (clubMatches) {
      clubMatches.forEach(match => {
        const jsonStr = match.replace('[CLUB_CARD]', '').replace('[/CLUB_CARD]', '')
        try {
          const clubData = JSON.parse(jsonStr)
          clubs.push(clubData)
          textContent = textContent.replace(match, '')
        } catch (e) {
          console.error('Erro ao parsear club card:', e)
        }
      })
    }

    // Procura por cards de eventos
    const eventCardRegex = /\[EVENT_CARD\](.*?)\[\/EVENT_CARD\]/gs
    const eventMatches = content.match(eventCardRegex)
    
    if (eventMatches) {
      eventMatches.forEach(match => {
        const jsonStr = match.replace('[EVENT_CARD]', '').replace('[/EVENT_CARD]', '')
        try {
          const eventData = JSON.parse(jsonStr)
          events.push(eventData)
          textContent = textContent.replace(match, '')
        } catch (e) {
          console.error('Erro ao parsear event card:', e)
        }
      })
    }

    // Detecta se há um card sendo carregado (tag aberta mas não fechada)
    const incompleteRegex = /\[(TEACHER_CARD|CLUB_CARD|EVENT_CARD)\](?!.*\[\/\1\])/s
    const hasIncompleteCard = incompleteRegex.test(content)
    
    if (hasIncompleteCard) {
      textContent = textContent.replace(/\[(TEACHER_CARD|CLUB_CARD|EVENT_CARD)\].*$/s, '')
      isLoadingCard = true
    }

    return { 
      text: textContent.trim(), 
      teachers, 
      clubs, 
      events, 
      isLoadingCard 
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    // Simula o submit depois de um pequeno delay
    setTimeout(() => {
      const form = document.querySelector('form')
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
      }
    }, 100)
  }

  // Carregar conversa anterior
  const loadConversation = async (conversationId: string) => {
    if (!loadConversationMessages) return
    const msgs = await loadConversationMessages(conversationId)
    setMessages(msgs)
    setCurrentConversationId(conversationId)
  }

  // Iniciar nova conversa
  const startNewConversation = () => {
    setMessages([])
    setCurrentConversationId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    const userInput = input
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    
    // Scroll suave para o bottom ao enviar mensagem
    setTimeout(() => scrollToBottom(true), 100)

    // Indicador de resposta lenta (após 10s)
    const slowResponseTimeout = setTimeout(() => {
      setIsSlowResponse(true)
    }, 10000)

    // Timeout para detectar resposta travada
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setMessages(prev => {
          const filtered = prev.filter(m => m.content !== '')
          return [...filtered, {
            role: 'assistant',
            content: 'Desculpe, a resposta está demorando mais que o esperado. Por favor, tente novamente ou reformule sua pergunta. 😅',
            timestamp: new Date()
          }]
        })
        setIsLoading(false)
        setIsSlowResponse(false)
      }
    }, 35000) // 35 segundos

    try {
      // Criar nova conversa se necessário
      let conversationId = currentConversationId
      if (!conversationId && createConversation) {
        conversationId = await createConversation(userInput)
        if (conversationId) {
          setCurrentConversationId(conversationId)
        }
      }

      // Salvar mensagem do usuário
      if (conversationId && saveMessage) {
        await saveMessage(conversationId, 'user', userInput)
      }

      const controller = new AbortController()
      const fetchTimeoutId = setTimeout(() => controller.abort(), 32000) // 32 segundos

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userInput }
          ]
        }),
        signal: controller.signal
      })

      clearTimeout(fetchTimeoutId)

      if (!response.ok) throw new Error('Erro na resposta')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''
      let hasReceivedData = false

      // Criar mensagem inicial do assistente
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '',
        timestamp: new Date()
      }])

      while (true) {
        const { done, value } = await reader!.read()
        if (done) break

        hasReceivedData = true
        const chunk = decoder.decode(value)
        assistantMessage += chunk

        // Atualizar a última mensagem
        setMessages(prev => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: assistantMessage,
            timestamp: new Date()
          }
          return newMessages
        })
      }

      clearTimeout(timeoutId)
      clearTimeout(slowResponseTimeout)
      setIsSlowResponse(false)

      // Se não recebeu nada, mostrar erro
      if (!hasReceivedData || !assistantMessage) {
        throw new Error('Resposta vazia')
      }

      // Salvar resposta do assistente
      if (conversationId && assistantMessage && saveMessage) {
        await saveMessage(conversationId, 'assistant', assistantMessage)
      }
    } catch (error: any) {
      clearTimeout(timeoutId)
      clearTimeout(slowResponseTimeout)
      setIsSlowResponse(false)
      console.error('Erro ao enviar mensagem:', error)
      
      let errorMessage = 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.'
      
      if (error.name === 'AbortError') {
        errorMessage = 'A resposta está demorando demais. Tente novamente com uma pergunta mais simples. ⏱️'
      } else if (error.message === 'Timeout') {
        errorMessage = 'O servidor não respondeu a tempo. Por favor, tente novamente. 🔄'
      }
      
      setMessages(prev => {
        // Remover mensagem vazia se existir
        const filtered = prev.filter(m => m.content !== '')
        return [...filtered, {
          role: 'assistant',
          content: errorMessage,
          timestamp: new Date()
        }]
      })
    } finally {
      clearTimeout(slowResponseTimeout)
      setIsLoading(false)
      setIsSlowResponse(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  return (
    <div 
      className="chat-interface-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 140px)',
        position: 'relative',
        minHeight: 0,
        overflow: 'hidden'
      }}>
        {/* Header - Só aparece quando há mensagens */}
        {messages.length > 0 && (
          <div className="config-header" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={startNewConversation}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <i className="ph ph-caret-left" style={{ fontSize: '24px', color: 'var(--ink-600)' }}></i>
              </button>
              <h1 style={{ fontSize: '30px', fontWeight: 600, color: 'var(--ink-800)' }}>
                Assistente IA
              </h1>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div 
          ref={messagesContainerRef}
          className="chat-messages-area"
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '24px',
            paddingBottom: '120px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            minHeight: 0,
            justifyContent: messages.length === 0 ? 'center' : 'flex-start',
            alignItems: messages.length === 0 ? 'center' : 'stretch',
            position: 'relative',
            WebkitOverflowScrolling: 'touch',
            ...(messages.length > 0 && {
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 40px, black 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 40px, black 100%)'
            })
          }}
        >
        {/* Tela Inicial - Empty State */}
        {messages.length === 0 && !isLoading && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            maxWidth: '700px',
            margin: '0 auto',
            marginTop: '40px',
            gap: '32px',
            width: '100%'
          }}>
            {/* Orb Animada */}
            <div style={{ position: 'relative' }}>
              <img
                src="/images/ia-orb-trivoo.webp"
                alt="Assistente IA"
                style={{
                  width: '140px',
                  height: 'auto',
                  animation: 'float 3s ease-in-out infinite',
                  display: 'block'
                }}
              />
            </div>

            {/* Título e Subtítulo */}
            <div>
              <h2 style={{
                fontSize: '28px',
                fontWeight: 600,
                color: '#758A25',
                marginBottom: '12px',
                fontFamily: 'Raleway'
              }}>
                Como posso te ajudar hoje?
              </h2>
              <p style={{
                fontSize: '17px',
                color: '#5F5F5F',
                fontFamily: 'Raleway',
                lineHeight: '1.5'
              }}>
                Peça recomendações de professores, centros e eventos perto de você. Tire qualquer dúvida sobre os esportes.
              </p>
            </div>

            {/* Conversas Recentes - Mostrar até 3 últimas */}
            {conversations.length > 0 && (
              <div style={{
                width: '100%',
                maxWidth: '700px',
                marginBottom: '16px'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#5F5F5F',
                  fontFamily: 'Raleway',
                  marginBottom: '12px',
                  textAlign: 'left'
                }}>
                  Conversas recentes
                </h3>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  {conversations.slice(0, 3).map(conv => (
                    <button
                      key={conv.id}
                      onClick={() => loadConversation(conv.id)}
                      style={{
                        padding: '12px 16px',
                        background: '#ECECEC',
                        borderRadius: '12px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '10px',
                        transition: 'all 0.2s',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#E0E0E0'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#ECECEC'
                      }}
                    >
                      <div style={{
                        flex: '1 1 0',
                        color: 'black',
                        fontSize: '16px',
                        fontFamily: 'Raleway',
                        fontWeight: 400,
                        lineHeight: '22.4px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {conv.title}
                      </div>
                      <i className="ph ph-clock-clockwise" style={{
                        fontSize: '20px',
                        color: '#A8A8A8',
                        flexShrink: 0
                      }}></i>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sugestões de Prompt */}
            <div style={{
              width: '100%',
              maxWidth: '700px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {conversations.length > 0 && (
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#5F5F5F',
                  fontFamily: 'Raleway',
                  margin: 0,
                  textAlign: 'left'
                }}>
                  Sugestões
                </h3>
              )}
              
              {/* Primeira linha - 2 cards */}
              <div style={{
                display: 'flex',
                gap: '16px',
                width: '100%'
              }}>
                {suggestions.slice(0, 2).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    style={{
                      flex: '1 1 0',
                      padding: '12px 16px',
                      background: '#ECECEC',
                      borderRadius: '12px',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#E0E0E0'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#ECECEC'
                    }}
                  >
                    <div style={{
                      flex: '1 1 0',
                      color: 'black',
                      fontSize: '16px',
                      fontFamily: 'Raleway',
                      fontWeight: 400,
                      lineHeight: '22.4px',
                      textAlign: 'left',
                      wordWrap: 'break-word'
                    }}>
                      {suggestion}
                    </div>
                    <i className="ph ph-arrow-circle-up-right" style={{
                      fontSize: '20px',
                      color: '#A8A8A8',
                      flexShrink: 0
                    }}></i>
                  </button>
                ))}
              </div>
              
              {/* Segunda linha - 2 cards */}
              <div style={{
                display: 'flex',
                gap: '16px',
                width: '100%'
              }}>
                {suggestions.slice(2, 4).map((suggestion, index) => (
                  <button
                    key={index + 2}
                    onClick={() => handleSuggestionClick(suggestion)}
                    style={{
                      flex: '1 1 0',
                      padding: '12px 16px',
                      background: '#ECECEC',
                      borderRadius: '12px',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#E0E0E0'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#ECECEC'
                    }}
                  >
                    <div style={{
                      flex: '1 1 0',
                      color: 'black',
                      fontSize: '16px',
                      fontFamily: 'Raleway',
                      fontWeight: 400,
                      lineHeight: '22.4px',
                      textAlign: 'left',
                      wordWrap: 'break-word'
                    }}>
                      {suggestion}
                    </div>
                    <i className="ph ph-arrow-circle-up-right" style={{
                      fontSize: '20px',
                      color: '#A8A8A8',
                      flexShrink: 0
                    }}></i>
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Mensagens do Chat */}
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
              flexDirection: message.role === 'user' ? 'row-reverse' : 'row'
            }}
          >
            {/* Avatar - Somente para IA */}
            {message.role === 'assistant' && (
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                overflow: 'hidden'
              }}>
                <img 
                  src="/images/ia-orb-trivoo.webp" 
                  alt="IA"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
            )}

            {/* Message Bubble */}
            <div 
              className="message-bubble"
              style={{
                maxWidth: '60%',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              {(() => {
                const { text, teachers, clubs, events, isLoadingCard } = processMessageContent(message.content)
                
                return (
                  <>
                    {text && (
                      <div style={{
                        padding: '16px 24px',
                        borderTopLeftRadius: message.role === 'user' ? '24px' : '0',
                        borderTopRightRadius: '24px',
                        borderBottomLeftRadius: '24px',
                        borderBottomRightRadius: message.role === 'user' ? '0' : '24px',
                        backgroundColor: message.role === 'user' ? '#4C5E18' : '#ECECEC',
                        color: message.role === 'user' ? '#FCFCFC' : '#3B3B3B',
                        fontSize: '16px',
                        lineHeight: message.role === 'user' ? '24px' : '25.6px',
                        fontFamily: 'Raleway',
                        fontWeight: message.role === 'user' ? 500 : 400,
                        wordBreak: 'break-word'
                      }}>
                        <ReactMarkdown
                          components={{
                            // Componentes customizados para cada elemento Markdown
                            p: ({node, ...props}) => <p style={{ margin: '0 0 8px 0' }} {...props} />,
                            strong: ({node, ...props}) => <strong style={{ fontWeight: 700, color: message.role === 'user' ? '#FCFCFC' : '#3B3B3B' }} {...props} />,
                            em: ({node, ...props}) => <em style={{ fontStyle: 'italic' }} {...props} />,
                            ul: ({node, ...props}) => <ul style={{ margin: '8px 0', paddingLeft: '20px', listStyleType: 'disc' }} {...props} />,
                            ol: ({node, ...props}) => <ol style={{ margin: '8px 0', paddingLeft: '20px' }} {...props} />,
                            li: ({node, ...props}) => <li style={{ margin: '4px 0' }} {...props} />,
                            code: ({node, ...props}) => <code style={{ 
                              backgroundColor: message.role === 'user' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)', 
                              padding: '2px 6px', 
                              borderRadius: '4px',
                              fontSize: '13px',
                              fontFamily: 'monospace'
                            }} {...props} />,
                            blockquote: ({node, ...props}) => <blockquote style={{ 
                              borderLeft: '3px solid ' + (message.role === 'user' ? '#fff' : '#10B981'),
                              paddingLeft: '12px',
                              margin: '8px 0',
                              fontStyle: 'italic'
                            }} {...props} />
                          }}
                        >
                          {text}
                        </ReactMarkdown>
                      </div>
                    )}
                    
                    {/* Loader enquanto o card está sendo carregado */}
                    {isLoadingCard && (
                      <div style={{
                        padding: '16px 24px',
                        borderTopRightRadius: '24px',
                        borderBottomRightRadius: '24px',
                        borderBottomLeftRadius: '24px',
                        backgroundColor: '#ECECEC',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <div style={{
                          display: 'flex',
                          gap: '4px',
                          alignItems: 'center'
                        }}>
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: '#758A25',
                            animation: 'bounce 1.4s infinite ease-in-out both',
                            animationDelay: '0s'
                          }}></div>
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: '#758A25',
                            animation: 'bounce 1.4s infinite ease-in-out both',
                            animationDelay: '0.16s'
                          }}></div>
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: '#758A25',
                            animation: 'bounce 1.4s infinite ease-in-out both',
                            animationDelay: '0.32s'
                          }}></div>
                        </div>
                        <span style={{ 
                          fontSize: '14px', 
                          color: '#5F5F5F', 
                          fontFamily: 'Raleway',
                          fontStyle: 'italic'
                        }}>
                          Preparando recomendações...
                        </span>
                      </div>
                    )}
                    
                    {teachers.length > 0 && (
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '12px',
                        width: '100%',
                        maxWidth: teachers.length === 1 ? '320px' : '100%'
                      }}>
                        {teachers.map((teacher, idx) => (
                          <TeacherCardChat
                            key={idx}
                            id={teacher.id}
                            name={teacher.name}
                            specialty={teacher.specialty}
                            rating={teacher.rating}
                            distance={teacher.distance}
                            profileImage={teacher.profileImage}
                          />
                        ))}
                      </div>
                    )}
                    
                    {clubs.length > 0 && (
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '12px',
                        width: '100%',
                        maxWidth: clubs.length === 1 ? '320px' : '100%'
                      }}>
                        {clubs.map((club, idx) => (
                          <ClubCardChat
                            key={idx}
                            id={club.id}
                            name={club.name}
                            sports={club.sports}
                            distance={club.distance}
                            image={club.image}
                          />
                        ))}
                      </div>
                    )}
                    
                    {events.length > 0 && (
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '12px',
                        width: '100%',
                        maxWidth: events.length === 1 ? '320px' : '100%'
                      }}>
                        {events.map((event, idx) => (
                          <EventCardChat
                            key={idx}
                            id={event.id}
                            title={event.title}
                            date={event.date}
                            location={event.location}
                            isFree={event.isFree}
                            image={event.image}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )
              })()}
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
            flexDirection: 'column'
          }}>
            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <img 
                  src="/images/ia-orb-trivoo.webp" 
                  alt="IA"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
              <div style={{
                padding: '16px 24px',
                borderTopRightRadius: '24px',
                borderBottomRightRadius: '24px',
                borderBottomLeftRadius: '24px',
                backgroundColor: '#ECECEC',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#95B02F',
                  animation: 'bounce 1.4s infinite ease-in-out both',
                  animationDelay: '0s'
                }}></div>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#95B02F',
                  animation: 'bounce 1.4s infinite ease-in-out both',
                  animationDelay: '0.16s'
                }}></div>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#95B02F',
                  animation: 'bounce 1.4s infinite ease-in-out both',
                  animationDelay: '0.32s'
                }}></div>
              </div>
            </div>
            
            {/* Aviso de resposta lenta */}
            {isSlowResponse && (
              <div style={{
                marginLeft: '52px',
                padding: '8px 16px',
                backgroundColor: '#FEF3C7',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#92400E',
                fontFamily: 'Raleway',
                fontStyle: 'italic'
              }}>
                ⏱️ Analisando sua pergunta com mais cuidado...
              </div>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        position: 'fixed',
        bottom: '56px',
        left: 'calc(50% + 120px)',
        transform: 'translateX(-50%)',
        width: '60%',
        maxWidth: 'calc(100vw - 240px - 80px)',
        padding: '0',
        zIndex: 100
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{
            width: '100%',
            paddingTop: '8px',
            paddingBottom: '8px',
            paddingLeft: '24px',
            paddingRight: '8px',
            background: '#ECECEC',
            borderRadius: '100px',
            outline: '2px #E0E0E0 solid',
            outlineOffset: '-2px',
            justifyContent: 'space-between',
            alignItems: 'center',
            display: 'inline-flex'
          }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pergunte alguma coisa..."
              disabled={isLoading}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#5F5F5F',
                fontSize: '16px',
                fontFamily: 'Raleway',
                fontWeight: 400,
                lineHeight: '25.6px'
              }}
            />
            <div style={{
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: '8px',
              display: 'flex'
            }}>
              {/* Ícone de microfone (futuro) */}
              <button
                type="button"
                style={{
                  width: '24px',
                  height: '24px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Comando de voz (em breve)"
              >
                <i className="ph ph-microphone" style={{ fontSize: '24px', color: '#A8A8A8' }}></i>
              </button>

              {/* Botão de enviar */}
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                style={{
                  width: '40px',
                  height: '40px',
                  background: input.trim() && !isLoading ? '#758A25' : '#A8A8A8',
                  borderRadius: '68.97px',
                  border: 'none',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '6.9px',
                  display: 'flex',
                  cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (input.trim() && !isLoading) {
                    e.currentTarget.style.background = '#4C5E18'
                    e.currentTarget.style.transform = 'scale(1.05)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (input.trim() && !isLoading) {
                    e.currentTarget.style.background = '#758A25'
                    e.currentTarget.style.transform = 'scale(1)'
                  }
                }}
              >
                <i className="ph ph-paper-plane-tilt" style={{ 
                  fontSize: '20px', 
                  color: '#FCFCFC'
                }}></i>
              </button>
            </div>
          </div>
        </form>
      </div>

    </div>
  )
}

