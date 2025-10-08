# 🚀 Guia de Deploy do Trivoo no Vercel

## 📋 Pré-requisitos

- Conta no [Vercel](https://vercel.com)
- Conta no [GitHub](https://github.com)
- Projeto Supabase configurado

## 🔧 Configuração do Supabase

### Seu Projeto Supabase:
- **Project ID:** `ovhmuidvyqvwhmdondia`
- **URL:** `https://ovhmuidvyqvwhmdondia.supabase.co`
- **Anon Key:** Configurada ✅

### 1. Executar o Schema SQL no Supabase

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto: `ovhmuidvyqvwhmdondia`
3. Vá em **SQL Editor**
4. Execute os scripts na seguinte ordem:

```bash
# 1. Schema principal
supabase/schema.sql

# 2. Setup de esportes (se necessário)
supabase/sports_setup.sql

# 3. Adicionar coordenadas de localização
supabase/add_location_coords.sql

# 4. Configurar swipe results
supabase/swipe_results.sql
```

## 🚀 Deploy no Vercel

### Método 1: Via GitHub (Recomendado)

#### Passo 1: Push para GitHub
```bash
# Certifique-se que tudo está commitado
git add .
git commit -m "chore: Configura variáveis de ambiente do Supabase"
git push origin main
```

#### Passo 2: Conectar no Vercel

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Clique em **Import Git Repository**
3. Selecione seu repositório: `mendesmarcosv/trivoo`
4. Clique em **Import**

#### Passo 3: Configurar Variáveis de Ambiente

Na página de configuração do projeto, clique em **Environment Variables** e adicione:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://ovhmuidvyqvwhmdondia.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92aG11aWR2eXF2d2htZG9uZGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNTk3NDYsImV4cCI6MjA3MzczNTc0Nn0.wisimwwluAyElBKb4OkWxvgqfbbV2frb5n5VHC_DrMk` |

**Importante:** Marque todas as variáveis para os ambientes:
- ✅ Production
- ✅ Preview
- ✅ Development

#### Passo 4: Deploy

1. Clique em **Deploy**
2. Aguarde o build finalizar (2-5 minutos)
3. Seu projeto estará disponível em: `https://trivoo-seu-usuario.vercel.app`

### Método 2: Via CLI do Vercel

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login no Vercel
vercel login

# 3. Deploy
vercel

# 4. Configurar variáveis de ambiente
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Cole: https://ovhmuidvyqvwhmdondia.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Cole: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 5. Deploy para produção
vercel --prod
```

## 🔐 Segurança

### ✅ O que é seguro:
- A **anon key** é segura para uso público
- Todas as tabelas têm **Row Level Security (RLS)** ativo
- Políticas de segurança estão configuradas

### ⚠️ Nunca exponha:
- `SUPABASE_SERVICE_ROLE_KEY` (se tiver)
- Senhas do banco de dados
- Chaves privadas

## 🧪 Testar Deploy

Após o deploy, teste as seguintes funcionalidades:

1. **Home:** Visualização de dados do usuário mock
2. **Clubes:** Lista de clubes esportivos
3. **Professores:** Lista de professores
4. **Eventos:** Lista de eventos
5. **Swipe:** Sistema de swipe para professores
6. **Perfil:** Página de perfil do usuário

## 🔄 Atualizações Futuras

Para atualizar o projeto no Vercel:

```bash
# 1. Faça suas alterações
git add .
git commit -m "feat: Sua alteração"
git push origin main

# 2. O Vercel fará deploy automático! 🎉
```

## 📱 Domínio Personalizado (Opcional)

1. Vá em **Settings** → **Domains** no Vercel
2. Adicione seu domínio personalizado
3. Configure os DNS conforme instruções

## 🐛 Troubleshooting

### Erro de conexão com Supabase:
- Verifique se as variáveis de ambiente estão corretas
- Confirme que o RLS está configurado no Supabase
- Verifique os logs no Vercel Dashboard

### Build falhou:
- Verifique os logs de build no Vercel
- Execute `npm run build` localmente para identificar erros
- Certifique-se que todas as dependências estão no `package.json`

### Dados não aparecem:
- Verifique se os scripts SQL foram executados no Supabase
- Confirme a conexão no Supabase Dashboard
- Verifique as políticas RLS

## 📞 Suporte

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs

---

**Projeto:** Trivoo  
**Desenvolvido por:** Marco Mendes  
**Repositório:** https://github.com/mendesmarcosv/trivoo

