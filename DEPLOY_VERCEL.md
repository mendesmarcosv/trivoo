# 🚀 Deploy no Vercel - Trivoo

Este guia detalha como fazer o deploy da aplicação Trivoo no Vercel.

## 📋 Pré-requisitos

1. **Conta no Vercel**: Crie em [vercel.com](https://vercel.com)
2. **Conta no GitHub**: Sua conta precisa ter acesso ao repositório
3. **Supabase configurado**: Database e Storage já devem estar configurados

## 🔐 Variáveis de Ambiente Necessárias

Você precisará configurar as seguintes variáveis no Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=sua-url-do-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica-do-supabase
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
OPENAI_API_KEY=sua-chave-openai
```

### Como obter as chaves do Supabase:

1. Acesse seu projeto no [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em **Settings** → **API**
3. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** (clique em "Reveal") → `SUPABASE_SERVICE_ROLE_KEY`

### Como obter a chave da OpenAI:

1. Acesse [platform.openai.com](https://platform.openai.com)
2. Vá em **API Keys**
3. Crie uma nova chave → `OPENAI_API_KEY`

## 🚀 Passo a Passo do Deploy

### Método 1: Deploy via GitHub (Recomendado)

1. **Prepare o repositório**
   ```bash
   # Adicione todos os arquivos ao git
   git add .
   
   # Faça o commit
   git commit -m "Preparando deploy no Vercel"
   
   # Envie para o GitHub
   git push origin main
   ```

2. **No Vercel Dashboard**
   - Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
   - Clique em **"Add New Project"**
   - Clique em **"Import Git Repository"**
   - Selecione o repositório **trivoo**
   - Clique em **"Import"**

3. **Configure o projeto**
   - **Framework Preset**: Next.js (detectado automaticamente)
   - **Root Directory**: `.` (deixe em branco)
   - **Build Command**: `npm run build` (padrão)
   - **Output Directory**: `.next` (padrão)
   - **Install Command**: `npm install` (padrão)

4. **Adicione as variáveis de ambiente**
   - Na seção **Environment Variables**
   - Adicione cada variável (veja lista acima)
   - Para todas as variáveis, selecione: **Production**, **Preview** e **Development**
   - Clique em **"Add"** para cada uma

5. **Deploy**
   - Clique em **"Deploy"**
   - Aguarde o build finalizar (2-5 minutos)
   - Seu site estará disponível em `https://seu-projeto.vercel.app`

### Método 2: Deploy via Vercel CLI

1. **Instale o Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Faça login**
   ```bash
   vercel login
   ```

3. **Configure as variáveis de ambiente localmente**
   - Crie um arquivo `.env.production` (não será commitado):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=sua-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave
   SUPABASE_SERVICE_ROLE_KEY=sua-service-role
   OPENAI_API_KEY=sua-openai-key
   ```

4. **Faça o deploy**
   ```bash
   # Deploy de preview (teste)
   vercel
   
   # Deploy de produção
   vercel --prod
   ```

5. **Configure as variáveis no dashboard**
   - Acesse o projeto no [Vercel Dashboard](https://vercel.com/dashboard)
   - Vá em **Settings** → **Environment Variables**
   - Adicione todas as variáveis listadas acima

## ⚙️ Configurações Adicionais (Opcional)

### Domínio Customizado

1. No Vercel Dashboard, vá em **Settings** → **Domains**
2. Adicione seu domínio
3. Configure o DNS conforme instruções

### Builds Automáticos

- ✅ Já configurado: Todo push na branch `main` fará deploy automático
- Preview builds: Toda PR gerará um preview deploy

### Logs e Monitoramento

- Acesse **Deployments** para ver histórico
- Clique em um deploy específico para ver logs
- **Runtime Logs** mostra erros em produção

## 🔧 Troubleshooting

### Erro: "Module not found"
- Verifique se todas as dependências estão no `package.json`
- Rode localmente: `npm install && npm run build`

### Erro: "Supabase connection failed"
- Verifique se as variáveis de ambiente estão corretas
- Teste a conexão com: `curl https://sua-url.supabase.co`

### Erro: "OpenAI API error"
- Verifique se a chave está correta
- Confirme se tem créditos disponíveis na OpenAI
- Verifique se a chave tem permissão para GPT-4

### Build muito lento
- Vercel tem limite de build time (15min no free tier)
- Otimize imagens grandes
- Remova dependências não utilizadas

## 📊 Pós-Deploy

### Verifique se está funcionando:

1. ✅ Login/Signup funcionando
2. ✅ Upload de avatar funcionando (Supabase Storage)
3. ✅ Busca e listagem de professores/clubes/eventos
4. ✅ Assistente IA respondendo
5. ✅ Imagens carregando corretamente

### Configure Analytics (Opcional)

1. No Vercel Dashboard, vá em **Analytics**
2. Ative **Web Analytics**
3. Ative **Speed Insights**

## 🎉 Pronto!

Seu app está no ar! 🚀

**URL de produção**: `https://trivoo.vercel.app` (ou seu domínio)

### Próximos passos:

- 📱 Teste em diferentes dispositivos
- 🔍 Configure SEO e Open Graph
- 📊 Configure Google Analytics
- 🚀 Compartilhe com os usuários!

---

**Dúvidas?** Consulte a [documentação do Vercel](https://vercel.com/docs)
