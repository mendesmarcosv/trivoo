# 🔧 Como Corrigir o Nome no Perfil

## Problema
O nome está aparecendo como "Usuário" em vez do nome completo.

## Solução 1: Logout e Login novamente

1. **Faça logout:**
   - Clique no botão "Sair" na sidebar
   
2. **Faça login novamente:**
   - Entre com seu email e senha
   - O perfil será criado automaticamente agora

## Solução 2: Criar/Atualizar perfil no Supabase manualmente

### Opção A: Via SQL Editor

1. Acesse: https://app.supabase.com/project/ovhmuidvyqvwhmdondia/editor
2. Vá em **SQL Editor**
3. Execute este comando (substitua os valores):

```sql
-- Primeiro, veja qual é seu user_id
SELECT id, email FROM auth.users;

-- Copie o ID do seu usuário e use no comando abaixo
-- Substitua 'SEU_USER_ID_AQUI' pelo ID que você copiou
-- Substitua 'Seu Nome Completo' pelo seu nome

INSERT INTO profiles (id, name, phone, bio, location, location_coords, avatar_url)
VALUES (
  'SEU_USER_ID_AQUI',  -- Cole aqui o ID do usuário
  'Seu Nome Completo',  -- Seu nome
  '(21) 99999-9999',    -- Seu telefone
  '',                    -- Biografia (deixe vazio por enquanto)
  'Niterói',            -- Localização
  null,                  -- Coordenadas
  null                   -- Avatar URL
)
ON CONFLICT (id) 
DO UPDATE SET 
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  updated_at = NOW();
```

### Opção B: Via Interface do Supabase

1. Acesse: https://app.supabase.com/project/ovhmuidvyqvwhmdondia/editor
2. Vá em **Table Editor**
3. Selecione a tabela `profiles`
4. Clique em **Insert** → **Insert row**
5. Preencha:
   - **id:** (copie da tabela `auth.users`)
   - **name:** Seu nome completo
   - **phone:** Seu telefone
   - **bio:** (deixe vazio)
   - **location:** Niterói
   - **location_coords:** null
   - **avatar_url:** null
6. Clique em **Save**

## Solução 3: Atualizar via Perfil

Se o perfil já existir mas estiver vazio:

1. Acesse: http://localhost:3000/profile
2. Clique em **"Editar perfil"**
3. Preencha seu nome completo
4. Clique em **"Salvar alterações"**
5. Recarregue a página

## Como Verificar se funcionou

1. Acesse a home: http://localhost:3000
2. O nome deve aparecer em "Olá, [Seu Nome]!"
3. Na sidebar inferior, deve mostrar seu nome
4. No perfil, deve mostrar seu nome completo

## Se ainda não funcionar

Execute no console do navegador (F12):

```javascript
// Verificar dados do usuário
const { data: { user } } = await supabase.auth.getUser()
console.log('User:', user)

// Verificar perfil
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single()
console.log('Profile:', profile)
```

Envie os logs para verificarmos o problema!

