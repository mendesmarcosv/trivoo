#!/bin/bash

echo "🚀 Configurando o projeto Trivoo para uso local..."

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Instale em: https://nodejs.org/"
    exit 1
fi

# Verificar se o npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não está instalado."
    exit 1
fi

echo "✅ Node.js e npm encontrados"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Criar arquivo .env.local se não existir
if [ ! -f ".env.local" ]; then
    echo "🔧 Criando arquivo .env.local..."
    cp env.local .env.local
    echo "✅ Arquivo .env.local criado"
else
    echo "✅ Arquivo .env.local já existe"
fi

echo ""
echo "🎉 Setup concluído!"
echo ""
echo "Para executar o projeto:"
echo "  npm run dev"
echo ""
echo "Depois acesse: http://localhost:3000"
echo ""
echo "📚 Para mais informações, consulte SETUP_LOCAL.md"
