'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

export default function AjudaPage() {
  const router = useRouter()

  const faqs = [
    {
      question: 'Como faço para encontrar eventos próximos a mim?',
      answer: 'Vá até a página inicial e use o filtro de localização para ver eventos próximos. Você também pode ajustar o raio de busca em Configurações > Localização.'
    },
    {
      question: 'Como adiciono esportes de interesse?',
      answer: 'Acesse Meu Perfil e clique em "Adicionar esportes" na seção de esportes de interesse. Selecione os esportes que você gosta e salve.'
    },
    {
      question: 'Posso alterar minhas notificações?',
      answer: 'Sim! Vá em Configurações > Notificações e personalize quais tipos de notificações você deseja receber.'
    },
    {
      question: 'Como entro em contato com um professor?',
      answer: 'Na página do professor, clique no botão "Enviar mensagem" para iniciar uma conversa diretamente.'
    },
    {
      question: 'Como faço para participar de um evento?',
      answer: 'Na página do evento, clique em "Participar" ou "Inscrever-se". Você receberá uma confirmação e lembretes antes do evento.'
    },
    {
      question: 'Posso cancelar minha participação em um evento?',
      answer: 'Sim! Acesse a página do evento e clique em "Cancelar participação". Recomendamos fazer isso com antecedência.'
    },
    {
      question: 'Como altero minha foto de perfil?',
      answer: 'Vá em Configurações > Editar perfil, clique em "Alterar foto", selecione uma imagem e faça o ajuste desejado.'
    },
    {
      question: 'Como funciona o sistema de avaliações?',
      answer: 'Após participar de uma aula ou evento, você pode avaliar sua experiência de 1 a 5 estrelas e deixar um comentário.'
    }
  ]

  const [openIndex, setOpenIndex] = React.useState<number | null>(null)

  return (
    <div className="layout">
      <Sidebar />
      
      <main className="config-content">
        <div className="config-header" style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => router.push('/configuracoes')}
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
              Ajuda
            </h1>
          </div>
        </div>

        <div style={{ maxWidth: '60%' }}>
          {/* Central de Ajuda */}
          <div className="config-section">
            <h2 style={{ 
              fontSize: '22px', 
              fontWeight: 600, 
              color: 'var(--neutral-700)',
              marginBottom: '24px'
            }}>
              Central de ajuda
            </h2>
            
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
              <button
                onClick={() => router.push('/configuracoes/relatar-problema')}
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: 'var(--green-700)',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--green-800)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--green-700)'}
              >
                <i className="ph ph-warning-diamond" style={{ fontSize: '20px' }}></i>
                Relatar problema
              </button>
              <button
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: 'var(--neutral-200)',
                  color: 'var(--ink-700)',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--neutral-300)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--neutral-200)'}
              >
                <i className="ph ph-chat-circle-text" style={{ fontSize: '20px' }}></i>
                Chat ao vivo
              </button>
            </div>
          </div>

          {/* Perguntas Frequentes */}
          <div className="config-section">
            <h2 style={{ 
              fontSize: '22px', 
              fontWeight: 600, 
              color: 'var(--neutral-700)',
              marginBottom: '24px'
            }}>
              Perguntas frequentes
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: 'var(--neutral-100)',
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    style={{
                      width: '100%',
                      padding: '16px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ 
                      fontSize: '16px', 
                      fontWeight: 500, 
                      color: 'var(--ink-800)',
                      flex: 1
                    }}>
                      {faq.question}
                    </span>
                    <i 
                      className={`ph ${openIndex === index ? 'ph-caret-up' : 'ph-caret-down'}`}
                      style={{ 
                        fontSize: '20px', 
                        color: 'var(--ink-600)',
                        transition: 'transform 0.2s'
                      }}
                    ></i>
                  </button>
                  {openIndex === index && (
                    <div style={{
                      padding: '0 16px 16px 16px',
                      fontSize: '14px',
                      color: 'var(--ink-600)',
                      lineHeight: 1.6
                    }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contato */}
          <div className="config-section">
            <h2 style={{ 
              fontSize: '22px', 
              fontWeight: 600, 
              color: 'var(--neutral-700)',
              marginBottom: '24px'
            }}>
              Outras formas de contato
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                padding: '16px',
                backgroundColor: 'var(--neutral-100)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <i className="ph ph-envelope" style={{ fontSize: '24px', color: 'var(--green-700)' }}></i>
                <div>
                  <div style={{ fontSize: '14px', color: 'var(--ink-600)', marginBottom: '4px' }}>Email</div>
                  <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--ink-800)' }}>
                    suporte@trivoo.com.br
                  </div>
                </div>
              </div>

              <div style={{
                padding: '16px',
                backgroundColor: 'var(--neutral-100)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <i className="ph ph-phone" style={{ fontSize: '24px', color: 'var(--green-700)' }}></i>
                <div>
                  <div style={{ fontSize: '14px', color: 'var(--ink-600)', marginBottom: '4px' }}>Telefone</div>
                  <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--ink-800)' }}>
                    0800 123 4567
                  </div>
                </div>
              </div>

              <div style={{
                padding: '16px',
                backgroundColor: 'var(--neutral-100)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <i className="ph ph-clock" style={{ fontSize: '24px', color: 'var(--green-700)' }}></i>
                <div>
                  <div style={{ fontSize: '14px', color: 'var(--ink-600)', marginBottom: '4px' }}>Horário</div>
                  <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--ink-800)' }}>
                    Segunda a sexta, 8h às 18h
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
