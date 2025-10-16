#!/bin/bash

# Script para preparar o projeto para deploy no Vercel
# Adiciona apenas os arquivos necessários, ignorando SQL e MD (exceto README)

echo "🚀 Preparando projeto Trivoo para deploy no Vercel..."
echo ""

# Adicionar arquivos essenciais do projeto
echo "📦 Adicionando arquivos da aplicação..."
git add .gitignore
git add package.json package-lock.json
git add next.config.js tsconfig.json tailwind.config.js postcss.config.js
git add README.md

# Adicionar código fonte
echo "📝 Adicionando código fonte..."
git add src/
git add public/

# Adicionar componentes específicos
echo "🎨 Adicionando componentes..."
git add components/

# Verificar status
echo ""
echo "📊 Status dos arquivos:"
git status --short

echo ""
echo "✅ Arquivos preparados!"
echo ""
echo "🔍 Verifique se está tudo correto acima."
echo ""
echo "Para continuar com o deploy:"
echo "1. git commit -m \"Deploy: versão final\""
echo "2. git push origin main"
echo "3. Acesse vercel.com e importe o repositório"
echo ""
echo "📖 Consulte DEPLOY_VERCEL.md para detalhes completos"

