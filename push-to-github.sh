#!/bin/bash

echo "🚀 Executando push completo do projeto Trivoo para GitHub..."

# Navegar para o diretório do projeto
cd /Users/marcomendes/trivoo

echo "📁 Diretório atual: $(pwd)"

# Verificar se já é um repositório Git
if [ -d ".git" ]; then
    echo "✅ Repositório Git já existe"
else
    echo "🔧 Inicializando repositório Git..."
    git init
fi

# Adicionar todos os arquivos
echo "📦 Adicionando arquivos ao Git..."
git add .

# Verificar status
echo "📊 Status do repositório:"
git status

# Fazer commit
echo "💾 Fazendo commit..."
git commit -m "feat: configuração completa do projeto Trivoo com foco em inclusão

✨ Funcionalidades:
- Sistema de autenticação com Supabase funcionando
- Setup automático para professores (npm run setup)
- Foco em esportes invisibilizados e inclusivos
- Design system acessível e responsivo
- Documentação completa e profissional

🎯 Público-Alvo:
- Praticantes de esportes alternativos
- Professores de modalidades invisibilizadas
- Pessoas com deficiência
- Centros esportivos inclusivos

🌍 Impacto Social:
- Democratização do acesso ao esporte
- Visibilidade para modalidades alternativas
- Promoção de inclusão e diversidade
- Transformação do ecossistema esportivo

🛠️ Stack Tecnológica:
- Next.js 14 com App Router
- React 18 + TypeScript
- Supabase (Backend + Auth)
- Tailwind CSS (Design System)
- Swiper.js (Interações touch)

📚 Documentação:
- README.md completo e profissional
- Instruções para professores
- Setup automático
- Justificativas técnicas detalhadas"

echo "✅ Commit realizado com sucesso!"

# Mostrar informações do repositório
echo "📋 Informações do repositório:"
git log --oneline -1

echo ""
echo "🎉 Projeto pronto para push!"
echo ""
echo "📝 Próximos passos:"
echo "1. Crie um repositório no GitHub (se ainda não criou)"
echo "2. Execute: git remote add origin https://github.com/SEU_USUARIO/trivoo.git"
echo "3. Execute: git push -u origin main"
echo ""
echo "🌟 Substitua 'SEU_USUARIO' pelo seu nome de usuário do GitHub"
