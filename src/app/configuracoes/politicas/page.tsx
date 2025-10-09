'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

export default function PoliticasPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'cookies'>('privacy')

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
              Políticas e termos
            </h1>
          </div>
        </div>

        <div style={{ maxWidth: '80%' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', borderBottom: '1px solid var(--neutral-300)' }}>
            <button
              onClick={() => setActiveTab('privacy')}
              style={{
                padding: '12px 24px',
                border: 'none',
                backgroundColor: 'transparent',
                color: activeTab === 'privacy' ? 'var(--green-700)' : 'var(--ink-600)',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                borderBottom: activeTab === 'privacy' ? '3px solid var(--green-700)' : '3px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              Privacidade
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              style={{
                padding: '12px 24px',
                border: 'none',
                backgroundColor: 'transparent',
                color: activeTab === 'terms' ? 'var(--green-700)' : 'var(--ink-600)',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                borderBottom: activeTab === 'terms' ? '3px solid var(--green-700)' : '3px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              Termos de uso
            </button>
            <button
              onClick={() => setActiveTab('cookies')}
              style={{
                padding: '12px 24px',
                border: 'none',
                backgroundColor: 'transparent',
                color: activeTab === 'cookies' ? 'var(--green-700)' : 'var(--ink-600)',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                borderBottom: activeTab === 'cookies' ? '3px solid var(--green-700)' : '3px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              Cookies
            </button>
          </div>

          {/* Conteúdo */}
          <div style={{
            padding: '32px',
            backgroundColor: 'white',
            borderRadius: '16px',
            maxHeight: '600px',
            overflowY: 'auto'
          }}>
            {activeTab === 'privacy' && (
              <div style={{ fontSize: '14px', color: 'var(--ink-700)', lineHeight: 1.8 }}>
                <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--ink-800)', marginBottom: '16px' }}>
                  Política de Privacidade
                </h2>
                <p style={{ marginBottom: '16px' }}>Última atualização: 09 de Outubro de 2025</p>
                
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginTop: '24px', marginBottom: '12px' }}>
                  1. Informações que coletamos
                </h3>
                <p style={{ marginBottom: '16px' }}>
                  Coletamos informações que você nos fornece diretamente, como nome, email, telefone e preferências esportivas. 
                  Também coletamos dados de uso do aplicativo para melhorar sua experiência.
                </p>

                <h3 style={{ fontSize: '18px', fontWeight: 600, marginTop: '24px', marginBottom: '12px' }}>
                  2. Como usamos suas informações
                </h3>
                <p style={{ marginBottom: '16px' }}>
                  Utilizamos suas informações para personalizar recomendações, conectar você com eventos e clubes, 
                  e melhorar nossos serviços. Nunca vendemos seus dados para terceiros.
                </p>

                <h3 style={{ fontSize: '18px', fontWeight: 600, marginTop: '24px', marginBottom: '12px' }}>
                  3. Compartilhamento de dados
                </h3>
                <p style={{ marginBottom: '16px' }}>
                  Compartilhamos informações apenas com clubes e professores quando você se inscreve em eventos. 
                  Seus dados pessoais são protegidos e não são compartilhados sem seu consentimento.
                </p>

                <h3 style={{ fontSize: '18px', fontWeight: 600, marginTop: '24px', marginBottom: '12px' }}>
                  4. Seus direitos
                </h3>
                <p style={{ marginBottom: '16px' }}>
                  Você tem direito de acessar, corrigir ou excluir seus dados a qualquer momento. 
                  Entre em contato conosco através de suporte@trivoo.com.br para exercer seus direitos.
                </p>
              </div>
            )}

            {activeTab === 'terms' && (
              <div style={{ fontSize: '14px', color: 'var(--ink-700)', lineHeight: 1.8 }}>
                <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--ink-800)', marginBottom: '16px' }}>
                  Termos de Uso
                </h2>
                <p style={{ marginBottom: '16px' }}>Última atualização: 09 de Outubro de 2025</p>
                
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginTop: '24px', marginBottom: '12px' }}>
                  1. Aceitação dos termos
                </h3>
                <p style={{ marginBottom: '16px' }}>
                  Ao usar o Trivoo, você concorda com estes termos de uso. Se você não concorda, 
                  por favor não use nossos serviços.
                </p>

                <h3 style={{ fontSize: '18px', fontWeight: 600, marginTop: '24px', marginBottom: '12px' }}>
                  2. Uso do serviço
                </h3>
                <p style={{ marginBottom: '16px' }}>
                  Você concorda em usar o Trivoo apenas para fins legais e de acordo com as leis aplicáveis. 
                  É proibido usar o serviço para atividades fraudulentas ou prejudiciais.
                </p>

                <h3 style={{ fontSize: '18px', fontWeight: 600, marginTop: '24px', marginBottom: '12px' }}>
                  3. Conteúdo do usuário
                </h3>
                <p style={{ marginBottom: '16px' }}>
                  Você é responsável pelo conteúdo que compartilha no Trivoo. Conteúdo ofensivo, 
                  discriminatório ou ilegal será removido e pode resultar em suspensão da conta.
                </p>

                <h3 style={{ fontSize: '18px', fontWeight: 600, marginTop: '24px', marginBottom: '12px' }}>
                  4. Limitação de responsabilidade
                </h3>
                <p style={{ marginBottom: '16px' }}>
                  O Trivoo conecta você com clubes e eventos, mas não nos responsabilizamos por problemas 
                  que possam ocorrer durante as atividades. Sempre verifique as informações diretamente com os organizadores.
                </p>
              </div>
            )}

            {activeTab === 'cookies' && (
              <div style={{ fontSize: '14px', color: 'var(--ink-700)', lineHeight: 1.8 }}>
                <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--ink-800)', marginBottom: '16px' }}>
                  Política de Cookies
                </h2>
                <p style={{ marginBottom: '16px' }}>Última atualização: 09 de Outubro de 2025</p>
                
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginTop: '24px', marginBottom: '12px' }}>
                  1. O que são cookies
                </h3>
                <p style={{ marginBottom: '16px' }}>
                  Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita nosso site. 
                  Eles nos ajudam a melhorar sua experiência e fornecer recursos personalizados.
                </p>

                <h3 style={{ fontSize: '18px', fontWeight: 600, marginTop: '24px', marginBottom: '12px' }}>
                  2. Tipos de cookies que usamos
                </h3>
                <p style={{ marginBottom: '16px' }}>
                  <strong>Cookies essenciais:</strong> Necessários para o funcionamento básico do site.<br/>
                  <strong>Cookies de preferências:</strong> Lembram suas configurações e escolhas.<br/>
                  <strong>Cookies analíticos:</strong> Nos ajudam a entender como você usa o Trivoo.<br/>
                  <strong>Cookies de marketing:</strong> Personalizam anúncios e recomendações.
                </p>

                <h3 style={{ fontSize: '18px', fontWeight: 600, marginTop: '24px', marginBottom: '12px' }}>
                  3. Como gerenciar cookies
                </h3>
                <p style={{ marginBottom: '16px' }}>
                  Você pode desativar cookies nas configurações do seu navegador. Note que isso pode afetar 
                  o funcionamento de alguns recursos do Trivoo.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
