# Configuração de Variáveis de Ambiente - Supabase

## Problema Identificado
O erro 400 (Bad Request) no Supabase está acontecendo porque as variáveis de ambiente não estão configuradas no Vercel.

## Solução

### 1. Criar arquivo .env.local localmente
Crie um arquivo `.env.local` na raiz do projeto com:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

### 2. Encontrar as credenciais do Supabase
1. Acesse https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em Settings > API
4. Copie:
   - **Project URL** (para NEXT_PUBLIC_SUPABASE_URL)
   - **anon public** key (para NEXT_PUBLIC_SUPABASE_ANON_KEY)

### 3. Configurar no Vercel
1. Acesse o dashboard do Vercel
2. Selecione seu projeto
3. Vá em Settings > Environment Variables
4. Adicione as variáveis:
   - `NEXT_PUBLIC_SUPABASE_URL` = sua URL do Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = sua chave anônima
5. Faça o redeploy do projeto

### 4. Verificar configuração
Após configurar, o código em `src/lib/supabase.ts` deve funcionar corretamente:

```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
```

## Arquivos que precisam das variáveis
- `src/lib/supabase.ts` - Cliente Supabase
- `src/lib/hooks/useAuth.ts` - Autenticação
- `src/app/auth/login/page.tsx` - Página de login
- `src/app/auth/signup/page.tsx` - Página de cadastro
