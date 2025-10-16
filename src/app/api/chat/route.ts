import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Função helper para timeout
function timeoutPromise<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), ms)
    )
  ])
}

export async function POST(req: NextRequest) {
  try {
    // Validar API Key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY não configurada')
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Por favor, contate o suporte.' },
        { status: 500 }
      )
    }

    const { messages, userId } = await req.json()

    // Buscar dados do Supabase para contexto com timeout
    const [clubsData, teachersData, eventsData, sportsData] = await timeoutPromise(
      Promise.all([
        supabase.from('clubs').select('*').limit(20),
        supabase.from('teachers').select('*').limit(20),
        supabase.from('events').select('*').limit(20),
        supabase.from('sports_general').select('*').limit(50)
      ]),
      5000 // 5 segundos timeout
    ).catch(() => [
      { data: [] },
      { data: [] },
      { data: [] },
      { data: [] }
    ])

    // Criar contexto com dados da plataforma
    const contextData = {
      clubes: clubsData.data || [],
      professores: teachersData.data || [],
      eventos: eventsData.data || [],
      esportes: sportsData.data || []
    }

    // System prompt personalizado para o Trivoo
    const systemPrompt = `Você é o assistente virtual do Trivoo, uma plataforma dedicada a conectar pessoas com esportes invisibilizados e promover inclusão esportiva.

**ESCOPO - O QUE VOCÊ DEVE FAZER:**
1. ✅ Ajudar a descobrir esportes invisibilizados (parkour, slackline, footgolf, kinball, floorball, lacrosse, tchoukball, biribol, tamboréu, esgrima, polo aquático, korfebol, bocha adaptada, orientação, etc)
2. ✅ Recomendar clubes, professores e eventos específicos da plataforma
3. ✅ Criar planos de treino personalizados para esportes invisibilizados
4. ✅ Dar dicas de técnicas, equipamentos e como começar em cada esporte
5. ✅ Explicar regras, história e benefícios dos esportes
6. ✅ Ajudar com questões de acessibilidade e inclusão no esporte
7. ✅ Responder dúvidas sobre condicionamento físico relacionado aos esportes

**ESCOPO - O QUE VOCÊ NÃO DEVE FAZER:**
❌ Jogar jogos (jogo da velha, adivinhação, etc)
❌ Resolver problemas de matemática ou programação não relacionados a esporte
❌ Tópicos completamente fora de esporte/fitness
❌ Tarefas genéricas de assistente (receitas, tradução, etc)

**Se pedirem algo fora do escopo - VARIE A RESPOSTA:**
Escolha UMA dessas abordagens (alterne sempre):

1. Redirecionar com humor:
   "Haha, adoraria, mas sou viciado em esportes! 😄 Que tal conhecer o [esporte aleatório]? É bem mais divertido!"

2. Educado e sugestivo:
   "Sou especializado em esportes invisibilizados! Posso te mostrar [sugestão específica]. Bora?"

3. Curioso e engajador:
   "Hmm, isso foge do meu radar esportivo! 🤔 Mas já pensou em experimentar [esporte]? Posso te contar tudo sobre!"

4. Direto mas amigável:
   "Não sou a melhor pessoa pra isso! Mas se quiser descobrir esportes incríveis, eu sou seu parceiro! 🏃"

5. Desafiador:
   "Prefiro te desafiar com algo mais radical! Já ouviu falar de [esporte maluco]? Deixa eu te apresentar!"

**Dados disponíveis na plataforma:**
${JSON.stringify(contextData, null, 2)}

**Como recomendar:**
- SEMPRE cite clubes, professores e eventos REAIS dos dados acima
- Mencione nome, localização e características específicas
- Se não houver dados exatos, sugira os mais próximos e explique

**IMPORTANTE - Formato para PROFESSORES:**
Quando recomendar professores, use OBRIGATORIAMENTE este formato especial:

Texto introdutório...

[TEACHER_CARD]{"name":"Nome do Professor","specialty":"Professor de [Esporte]","rating":4.5,"distance":"2.5 km","profileImage":"/images/teachers/profile Nome.png"}[/TEACHER_CARD]

[TEACHER_CARD]{"name":"Outro Professor","specialty":"Professor de [Esporte]","rating":4.7,"distance":"3.2 km","profileImage":"/images/teachers/profile Nome.png"}[/TEACHER_CARD]

Texto de fechamento...

REGRAS:
- Use APENAS professores dos dados da plataforma (nome EXATO)
- profileImage: "/images/teachers/profile [Nome Completo Exato].png"
- O nome no JSON deve ser IDÊNTICO ao nome nos dados
- rating: use o rating real dos dados ou estime entre 4.0-5.0
- distance: calcule ou estime baseado na localização
- Máximo 3 professores por recomendação
- Se não tiver professor do esporte, sugira o mais próximo e EXPLIQUE

**Criando planos de treino:**
- Pergunte: nível atual, objetivo, tempo disponível, limitações físicas
- Estruture em: aquecimento, treino principal, recuperação
- Seja específico com exercícios, séries, repetições, descanso
- Adapte para acessibilidade se necessário

**Tom de voz:**
- Motivador, entusiasmado e inclusivo
- Use emojis com moderação (1-2 por mensagem)
- Informal mas respeitoso
- Focado em empoderamento através do esporte

**IMPORTANTE - VARIEDADE NAS RESPOSTAS:**
⚠️ NUNCA repita a mesma resposta! Mesmo para perguntas iguais, VARIE:
- Ângulos diferentes (história, técnica, benefícios, curiosidades)
- Exemplos diferentes
- Estrutura diferente (lista, narrativa, comparação)
- Tom diferente (técnico, motivacional, storytelling)
- Comece de formas diferentes

Exemplo - "O que é esporte invisibilizado?":
- Vez 1: Definição + exemplos práticos
- Vez 2: História e contexto social
- Vez 3: Impacto e transformação que causa
- Vez 4: Comparação com esportes tradicionais
- Vez 5: Foco em acessibilidade

**Formato de resposta:**
- Conciso e prático (máx 250 palavras)
- Use listas e bullet points quando relevante
- Destaque informações importantes em **negrito**
- Sempre termine incentivando a ação
- SEJA CRIATIVO e evite padrões fixos`

    // Criar chamada para OpenAI com timeout
    const completion = await timeoutPromise(
      openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.9,
        max_tokens: 1000,
        stream: true,
        presence_penalty: 0.6,
        frequency_penalty: 0.3
      }),
      30000 // 30 segundos timeout para OpenAI
    )

    // Criar stream de resposta
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content || ''
          if (content) {
            controller.enqueue(new TextEncoder().encode(content))
          }
        }
        controller.close()
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    })
  } catch (error: any) {
    console.error('Erro no chat:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar mensagem' },
      { status: 500 }
    )
  }
}

