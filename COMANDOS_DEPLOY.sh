#!/bin/bash

# ========================================
# COMANDOS PARA DEPLOY - TRIVOO
# ========================================

echo ""
echo "🚀 DEPLOY TRIVOO NO VERCEL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Verificar se há mudanças
if [[ -n $(git status -s) ]]; then
  echo "📦 Passo 1: Fazer commit das mudanças"
  echo ""
  echo "Execute:"
  echo "  git commit -m \"Deploy: versão final com todas as funcionalidades\""
  echo ""
else
  echo "✅ Nenhuma mudança pendente para commit"
  echo ""
fi

# Push para GitHub
echo "📤 Passo 2: Enviar para o GitHub"
echo ""
echo "Execute:"
echo "  git push origin main"
echo ""
echo "⚠️  Se houver conflito:"
echo "  git pull --rebase origin main"
echo "  git push origin main"
echo ""

# Vercel
echo "🌐 Passo 3: Deploy no Vercel"
echo ""
echo "Opção A - Via Dashboard (Recomendado):"
echo "  1. Acesse: https://vercel.com/new"
echo "  2. Selecione o repositório 'trivoo'"
echo "  3. Configure as variáveis de ambiente (veja VARIAVEIS_AMBIENTE.txt)"
echo "  4. Clique em Deploy"
echo ""
echo "Opção B - Via CLI:"
echo "  npm install -g vercel"
echo "  vercel login"
echo "  vercel --prod"
echo ""

# Variáveis
echo "🔑 Passo 4: Configure as variáveis (IMPORTANTE!)"
echo ""
echo "No Vercel Dashboard → Settings → Environment Variables"
echo ""
echo "Adicione estas 4 variáveis:"
echo "  • NEXT_PUBLIC_SUPABASE_URL"
echo "  • NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "  • SUPABASE_SERVICE_ROLE_KEY"
echo "  • OPENAI_API_KEY"
echo ""
echo "📖 Veja VARIAVEIS_AMBIENTE.txt para detalhes"
echo ""

# Teste
echo "✅ Passo 5: Teste o deploy"
echo ""
echo "Após o build finalizar:"
echo "  • Teste login/cadastro"
echo "  • Teste upload de avatar"
echo "  • Teste o assistente IA"
echo "  • Navegue pelas páginas"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📖 Guia completo: DEPLOY_VERCEL.md"
echo "✅ Checklist: CHECKLIST_DEPLOY.md"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

