#!/bin/bash

echo "🚀 Fazendo push do projeto Trivoo para GitHub..."

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script no diretório raiz do projeto"
    exit 1
fi

# Tentar inicializar Git se necessário
if [ ! -d ".git" ]; then
    echo "🔧 Inicializando repositório Git..."
    git init
fi

# Adicionar arquivos
echo "📦 Adicionando arquivos..."
git add .

# Fazer commit
echo "💾 Fazendo commit..."
git commit -m "feat: atualização dos dados da Ana Silva

- ✅ Nome atualizado para 'Ana Silva'
- ✅ Removida localização 'Niterói' 
- ✅ Esportes alterados para modalidades invisibilizadas:
  - Escalada esportiva (indoor)
  - Parkour
  - Slackline
  - Esgrima
- ✅ Máximo de 4 esportes conforme solicitado"

echo "✅ Commit realizado!"
echo ""
echo "📝 Próximos passos:"
echo "1. Crie um repositório no GitHub"
echo "2. Execute: git remote add origin https://github.com/SEU_USUARIO/trivoo.git"
echo "3. Execute: git push -u origin main"
echo ""
echo "🌟 Substitua 'SEU_USUARIO' pelo seu nome de usuário do GitHub"
