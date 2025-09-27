'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function SupabaseTest() {
  const [config, setConfig] = useState<any>(null)
  const [testResult, setTestResult] = useState<string>('')

  useEffect(() => {
    // Verificar configuração
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    setConfig({
      url: supabaseUrl,
      key: supabaseKey ? 'configurada' : 'não configurada',
      urlValid: supabaseUrl && !supabaseUrl.includes('placeholder'),
      keyValid: supabaseKey && !supabaseKey.includes('placeholder')
    })

    // Testar conexão
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          setTestResult(`❌ Erro na conexão: ${error.message}`)
        } else {
          setTestResult('✅ Conexão com Supabase funcionando!')
        }
      } catch (err) {
        setTestResult(`❌ Erro geral: ${err}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-neutral-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Teste de Configuração Supabase</h1>
        
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Configuração Atual</h2>
          <div className="space-y-2">
            <p><strong>URL:</strong> {config?.url || 'Não configurada'}</p>
            <p><strong>Chave:</strong> {config?.key || 'Não configurada'}</p>
            <p><strong>URL Válida:</strong> {config?.urlValid ? '✅' : '❌'}</p>
            <p><strong>Chave Válida:</strong> {config?.keyValid ? '✅' : '❌'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Teste de Conexão</h2>
          <p>{testResult}</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Como Configurar</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Acesse <a href="https://supabase.com/dashboard" target="_blank" className="text-blue-600 underline">supabase.com/dashboard</a></li>
            <li>Selecione seu projeto</li>
            <li>Vá em Settings → API</li>
            <li>Copie a Project URL e a anon public key</li>
            <li>No Vercel, vá em Settings → Environment Variables</li>
            <li>Adicione NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
            <li>Faça o redeploy do projeto</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
