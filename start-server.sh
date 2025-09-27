#!/bin/bash

echo "🚀 Iniciando servidor Next.js..."

cd /Users/marcomendes/Desktop/trivoo-final/enterprise-challenge-trivoo

echo "📁 Diretório atual: $(pwd)"

echo "🔧 Instalando dependências..."
npm install

echo "🏗️ Fazendo build..."
npm run build

echo "🌐 Iniciando servidor na porta 3001..."
npx next dev --port 3001
