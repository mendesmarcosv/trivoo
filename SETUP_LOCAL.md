# 🚀 Setup Local - Trivoo

## ⚡ Setup Automático (Recomendado)

Execute apenas um comando:

```bash
npm run setup
```

Depois execute:

```bash
npm run dev
```

**Pronto! Acesse http://localhost:3000** ✅

## 📋 O que o setup automático faz:

1. ✅ Instala todas as dependências (`npm install`)
2. ✅ Cria o arquivo `.env.local` com as configurações do Supabase
3. ✅ Configura tudo para funcionar localmente

## 🔧 Setup Manual (se necessário)

Se preferir configurar manualmente:

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Copie o arquivo de configuração:**
   ```bash
   cp env.local .env.local
   ```

3. **Execute o projeto:**
   ```bash
   npm run dev
   ```

4. **Acesse:** http://localhost:3000

## 🎯 Para Professores

**Super simples:** Baixe o projeto → Execute `npm run setup` → Execute `npm run dev` → Acesse http://localhost:3000

O login funcionará automaticamente! 🎉
