import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Conversation {
  id: string
  title: string
  created_at: string
  updated_at: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function useChatHistory(userId: string | undefined) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(false)
  
  // Sugestões padrão
  const defaultSuggestions = [
    'Me recomenda um professor de slackline perto de mim?',
    'Tem evento gratuito hoje?',
    'O que é korfebol?',
    'Quero um centro de treinamento acessível em Niterói'
  ]
  
  const [suggestions, setSuggestions] = useState<string[]>(defaultSuggestions)
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false)

  // Carregar histórico de conversas (últimos 7 dias)
  useEffect(() => {
    if (!userId || hasLoadedOnce) {
      return
    }

    loadConversations()
    setHasLoadedOnce(true)
  }, [userId])

  const loadConversations = async () => {
    if (!userId) {
      setLoading(false)
      setSuggestions(defaultSuggestions)
      return
    }

    // Timeout de 3 segundos para não travar a UI
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 3000)
    )

    try {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const queryPromise = supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('updated_at', { ascending: false })
        .limit(10)

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any

      if (error) {
        console.warn('Tabela chat_conversations não encontrada (normal se ainda não configurou):', error)
        setConversations([])
        setSuggestions(defaultSuggestions)
        return
      }

      setConversations(data || [])
      
      // Carregar sugestões em background (sem bloquear)
      loadSmartSuggestions(userId).catch(() => {
        setSuggestions(defaultSuggestions)
      })
    } catch (error: any) {
      if (error.message === 'Timeout') {
        console.warn('Timeout ao carregar conversas - usando valores padrão')
      } else {
        console.error('Erro ao carregar conversas:', error)
      }
      setConversations([])
      setSuggestions(defaultSuggestions)
    } finally {
      setLoading(false)
    }
  }

  // Gerar sugestões inteligentes baseadas no histórico
  const loadSmartSuggestions = async (userId: string) => {
    try {
      // Buscar últimas mensagens do usuário
      const { data: recentMessages, error } = await supabase
        .from('chat_messages')
        .select(`
          content,
          conversation_id,
          chat_conversations!inner(user_id)
        `)
        .eq('role', 'user')
        .eq('chat_conversations.user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) {
        console.warn('Tabela chat_messages não encontrada (normal se ainda não configurou):', error)
        setSuggestions(defaultSuggestions)
        return
      }

      if (recentMessages && recentMessages.length > 0) {
        // Analisar temas das mensagens anteriores
        const topics = analyzeTopics(recentMessages.map((m: any) => m.content))
        const smartSuggestions = generateSmartSuggestions(topics)
        setSuggestions(smartSuggestions)
      } else {
        setSuggestions(defaultSuggestions)
      }
    } catch (error) {
      console.warn('Erro ao gerar sugestões (usando padrão):', error)
      setSuggestions(defaultSuggestions)
    }
  }

  // Analisar tópicos das mensagens anteriores
  const analyzeTopics = (messages: string[]): string[] => {
    const topics = new Set<string>()
    const keywords = {
      professor: ['professor', 'aula', 'ensinar', 'instrutor'],
      evento: ['evento', 'competição', 'campeonato', 'festival'],
      local: ['centro', 'clube', 'quadra', 'espaço', 'ginásio'],
      esporte: ['slackline', 'footgolf', 'parkour', 'korfebol', 'lacrosse'],
      acessibilidade: ['acessível', 'deficiência', 'cadeirante', 'inclusivo']
    }

    messages.forEach(msg => {
      const msgLower = msg.toLowerCase()
      Object.entries(keywords).forEach(([topic, words]) => {
        if (words.some(word => msgLower.includes(word))) {
          topics.add(topic)
        }
      })
    })

    return Array.from(topics)
  }

  // Gerar sugestões baseadas nos tópicos
  const generateSmartSuggestions = (topics: string[]): string[] => {
    const suggestionPool: { [key: string]: string[] } = {
      professor: [
        'Quais são os melhores professores de parkour?',
        'Me recomenda um instrutor certificado perto de mim',
        'Tem professores com experiência em competições?'
      ],
      evento: [
        'Quais eventos esportivos estão acontecendo este fim de semana?',
        'Tem campeonato de esportes alternativos este mês?',
        'Me avise sobre eventos gratuitos perto de mim'
      ],
      local: [
        'Onde posso praticar esportes radicais em Niterói?',
        'Quais clubes oferecem aulas para iniciantes?',
        'Tem algum centro de treinamento aberto aos domingos?'
      ],
      esporte: [
        'Como começar a praticar um esporte alternativo?',
        'Qual é a diferença entre kinball e floorball?',
        'Me explica as regras do footgolf'
      ],
      acessibilidade: [
        'Quais locais têm infraestrutura acessível?',
        'Tem professores especializados em adaptação esportiva?',
        'Eventos inclusivos para pessoas com deficiência'
      ]
    }

    const selected: string[] = []
    
    // Selecionar sugestões baseadas nos tópicos
    topics.forEach(topic => {
      if (suggestionPool[topic] && selected.length < 3) {
        const randomIndex = Math.floor(Math.random() * suggestionPool[topic].length)
        selected.push(suggestionPool[topic][randomIndex])
      }
    })

    // Completar com sugestões padrão se necessário
    while (selected.length < 4) {
      const remaining = defaultSuggestions.filter(s => !selected.includes(s))
      if (remaining.length > 0) {
        const randomIndex = Math.floor(Math.random() * remaining.length)
        selected.push(remaining[randomIndex])
      } else {
        break
      }
    }

    return selected.slice(0, 4)
  }

  // Criar nova conversa
  const createConversation = async (firstMessage: string): Promise<string | null> => {
    if (!userId) return null

    try {
      // Criar título baseado na primeira mensagem
      const title = firstMessage.slice(0, 50) + (firstMessage.length > 50 ? '...' : '')

      const { data: conversation, error: convError } = await supabase
        .from('chat_conversations')
        .insert({
          user_id: userId,
          title
        })
        .select()
        .single()

      if (convError) throw convError

      return conversation.id
    } catch (error) {
      console.error('Erro ao criar conversa:', error)
      return null
    }
  }

  // Salvar mensagem
  const saveMessage = async (
    conversationId: string,
    role: 'user' | 'assistant',
    content: string
  ) => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          role,
          content
        })

      if (error) throw error

      // Atualizar updated_at da conversa
      await supabase
        .from('chat_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId)

    } catch (error) {
      console.error('Erro ao salvar mensagem:', error)
    }
  }

  // Carregar mensagens de uma conversa
  const loadConversationMessages = async (conversationId: string): Promise<Message[]> => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error

      return (data || []).map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: new Date(msg.created_at)
      }))
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error)
      return []
    }
  }

  // Deletar conversa
  const deleteConversation = async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from('chat_conversations')
        .delete()
        .eq('id', conversationId)

      if (error) throw error

      // Atualizar lista local
      setConversations(prev => prev.filter(c => c.id !== conversationId))
    } catch (error) {
      console.error('Erro ao deletar conversa:', error)
    }
  }

  return {
    conversations,
    loading,
    suggestions: suggestions.length > 0 ? suggestions : defaultSuggestions,
    createConversation,
    saveMessage,
    loadConversationMessages,
    deleteConversation,
    refreshConversations: loadConversations
  }
}

