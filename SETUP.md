# Configuração do Trivoo

## 1. Configuração do Supabase

### Criar arquivo .env.local
Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

### Como obter as credenciais:
1. Acesse https://supabase.com/dashboard
2. Selecione seu projeto (ou crie um novo)
3. Vá em **Settings > API**
4. Copie:
   - **Project URL** (cole em NEXT_PUBLIC_SUPABASE_URL)
   - **anon public key** (cole em NEXT_PUBLIC_SUPABASE_ANON_KEY)

## 2. Configuração do Banco de Dados

Execute o arquivo `supabase/schema.sql` no editor SQL do Supabase:

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em **New Query**
3. Cole todo o conteúdo do arquivo `supabase/schema.sql`
4. Clique em **Run**

## 3. Executar o Projeto

```bash
npm run dev
```

O projeto estará disponível em http://localhost:3000

## Problemas Comuns

### Tela branca no navegador
- Verifique se o arquivo `.env.local` foi criado corretamente
- Certifique-se de que as credenciais do Supabase estão corretas
- Reinicie o servidor de desenvolvimento após criar o `.env.local`

### Erro de autenticação
- Verifique se as tabelas foram criadas no Supabase
- Confirme que as políticas RLS estão ativas
