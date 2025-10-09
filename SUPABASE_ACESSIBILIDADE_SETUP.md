# 🔐 Setup de Acessibilidade e Esportes - Supabase

## 📋 Visão Geral

Este documento explica como configurar as tabelas de acessibilidade e esportes gerais no Supabase.

---

## 🚀 Como Executar

### 1. Acesse o SQL Editor do Supabase

1. Vá para [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto: **ovhmuidvyqvwhmdondia**
3. No menu lateral, clique em **SQL Editor**
4. Clique em **New Query**

### 2. Execute o Script

1. Abra o arquivo `supabase/accessibility_setup.sql`
2. Copie **TODO O CONTEÚDO** do arquivo
3. Cole no editor SQL do Supabase
4. Clique em **RUN** (ou `Ctrl/Cmd + Enter`)

### 3. Verifique a Execução

Após executar, você verá a mensagem de sucesso. Verifique as tabelas criadas:

```sql
-- Verificar tabelas principais
SELECT * FROM disability_conditions LIMIT 5;
SELECT * FROM accessibility_location_resources LIMIT 5;
SELECT * FROM coach_accessibility_offerings LIMIT 5;
SELECT * FROM sports_general LIMIT 5;

-- Verificar políticas RLS
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename LIKE '%disability%' OR tablename LIKE '%accessibility%' OR tablename LIKE '%sports%';
```

---

## 📊 Tabelas Criadas

### 1. **Tabelas de Referência** (Listas Fixas)

#### `disability_conditions`
- **13 condições** (cadeirante, amputação, baixa visão, etc.)
- Incluí "Prefiro não informar" e "Outro (descrever)"

#### `accessibility_location_resources`
- **20 recursos** de acessibilidade para locais
- Rampa, elevador, banheiro adaptado, piso tátil, etc.

#### `coach_accessibility_offerings`
- **12 ofertas** que professores devem ter
- Experiência com PcD, adaptação de exercícios, Libras, etc.

#### `sports_general`
- **64 esportes** (natação, musculação, yoga, escalada, etc.)
- Incluí "Nunca pratiquei" e "Outro (descrever)"

---

### 2. **Tabelas de Relacionamento** (User → Seleções)

#### `user_disability_conditions`
- Condições de deficiência do usuário
- Campo `other_description` para quando selecionar "Outro"

#### `user_desired_location_resources`
- Recursos de acessibilidade desejados pelo usuário em locais

#### `user_desired_coach_offerings`
- Ofertas de acessibilidade desejadas em professores

#### `user_sports_practiced`
- Esportes que o usuário já praticou
- Campo `other_description` para quando selecionar "Outro"

---

## 🔒 Segurança (RLS)

Todas as tabelas têm **Row Level Security (RLS)** ativado:

### Tabelas de Referência
- ✅ Leitura pública (somente registros ativos)
- ❌ Nenhuma escrita permitida (dados fixos)

### Tabelas de Relacionamento
- ✅ Usuários podem ver, criar, atualizar e deletar **apenas suas próprias seleções**
- ❌ Nenhum acesso aos dados de outros usuários

---

## 🎨 Páginas Criadas

### 1. **Hub de Acessibilidade**
**Rota:** `/configuracoes/recursos-acessibilidade`

Página central com 3 sub-páginas:
- Minhas condições de deficiência
- Recursos que os locais devem ter
- O que os professores devem oferecer

### 2. **Condições de Deficiência**
**Rota:** `/configuracoes/condicoes-deficiencia`

- Tags redondas selecionáveis
- Campo de descrição quando selecionar "Outro"
- Salva em `user_disability_conditions`

### 3. **Recursos de Locais**
**Rota:** `/configuracoes/recursos-locais`

- Tags redondas selecionáveis
- 20 recursos de acessibilidade
- Salva em `user_desired_location_resources`

### 4. **Ofertas de Professores**
**Rota:** `/configuracoes/ofertas-professores`

- Tags redondas selecionáveis
- 12 ofertas de acessibilidade
- Salva em `user_desired_coach_offerings`

### 5. **Esportes Praticados**
**Rota:** `/configuracoes/esportes-praticados`

- Tags redondas selecionáveis
- Campo de busca para filtrar esportes
- 64 esportes disponíveis
- Campo de descrição quando selecionar "Outro"
- Contador de esportes selecionados
- Salva em `user_sports_practiced`

---

## 🎯 Componente Reutilizável

### `SelectableTag`

Componente de tag redonda com dois estados:

**Não selecionada:**
- Fundo transparente
- Borda verde (`var(--green-700)`)
- Texto verde

**Selecionada:**
- Fundo verde (`var(--green-700)`)
- Sem borda
- Texto branco

```tsx
<SelectableTag
  label="Cadeirante / usa cadeira de rodas"
  selected={isSelected}
  onClick={() => handleToggle(id)}
/>
```

---

## 📱 Fluxo do Usuário

### 1. Configurar Acessibilidade

1. Menu **Configurações** → **Recursos de acessibilidade**
2. Escolher uma das 3 opções:
   - Minhas condições de deficiência
   - Recursos que os locais devem ter
   - O que os professores devem oferecer
3. Selecionar tags (podem selecionar múltiplas)
4. Clicar em **Salvar**

### 2. Configurar Esportes Praticados

1. Menu **Configurações** → **Esportes que já pratiquei**
2. Usar campo de busca para filtrar (opcional)
3. Selecionar todos os esportes já praticados
4. Se selecionar "Outro", preencher descrição
5. Ver contador de esportes selecionados
6. Clicar em **Salvar**

---

## ✅ Status

- ✅ SQL criado e pronto para executar
- ✅ Todas as 4 páginas funcionais criadas
- ✅ Componente `SelectableTag` reutilizável
- ✅ RLS configurado corretamente
- ✅ Integração completa com Supabase
- ✅ Design consistente com outras páginas

---

## 🔄 Próximos Passos

1. **Execute o SQL** no Supabase (`supabase/accessibility_setup.sql`)
2. **Teste as páginas** no navegador
3. **Verifique se os dados estão sendo salvos** corretamente

---

## 📞 Suporte

Se houver algum erro ao executar o SQL, verifique:

1. Se você está logado no projeto correto
2. Se já executou o `user_settings.sql` anteriormente
3. Se há conflitos de nomes de tabelas (use `DROP TABLE IF EXISTS` se necessário)

---

**Última atualização:** 09/10/2025

