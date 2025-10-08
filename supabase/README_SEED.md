# 🌱 Seed do Banco de Dados Trivoo

## 📋 Instruções para Popular o Banco de Dados

### Passo 1: Executar o Schema Principal

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto: `ovhmuidvyqvwhmdondia`
3. Vá em **SQL Editor**
4. Execute na seguinte ordem:

```sql
-- 1. Criar estrutura do banco
schema.sql

-- 2. Configurar esportes
sports_setup.sql

-- 3. Adicionar coordenadas
add_location_coords.sql

-- 4. Configurar swipe results
swipe_results.sql

-- 5. Popular dados (clubes, professores, eventos)
seed_data.sql
```

### Passo 2: Verificar Dados Inseridos

Após executar `seed_data.sql`, você deverá ver:

- ✅ **7 Clubes** inseridos
- ✅ **11 Professores** inseridos
- ✅ **10 Eventos** inseridos

### 📊 Dados Populados

#### Clubes:
- Centro Horizonte (9 km)
- Boulder Lab (11 km)
- KinBall & Floorball Hub (4 km)
- Campo Verde Footgolf (28 km)
- Biribol & Natação Adaptada São Francisco (15 km)
- Tamboréu Praia Clube (16 km)
- Hangar 101 (24 km)

#### Professores:
- Victor Nascimento - Tamboréu (4.9⭐)
- Helena Moraes - Esgrima (4.7⭐)
- Lucas Prado - Escalada (4.4⭐)
- Ana Bechara - Corrida (4.6⭐)
- Mateus Furlan - Natação (4.5⭐)
- Clarice Neri - Beach Tennis (4.8⭐)
- Rogério Saito - Cross Fit (4.3⭐)
- Naomi Tanaka - Tênis de Mesa (4.9⭐)
- Gabriel Mitter - Futebol (4.2⭐)
- Yara Potiguara - Ginástica Rítmica (4.5⭐)
- Bruno Dantas - Escalada (4.6⭐)

#### Eventos:
- Trilha de Orientação Camboinhas
- Night Parkour Meetup
- Korfebol Aberto da Baía
- Circuito Inclusivo - Bocha na Praça
- Open de Esgrima — Iniciação & Amistoso
- Slackline Festival - Lagoa de Piratininga
- Patins Street Jam — Neves
- Clínica de Polo Aquático — Iniciantes
- Lacrosse Day — Amistoso Misto
- Footgolf Aberto da Restinga

### 🔄 Reexecutar Seed

Se precisar repovoar o banco, simplesmente execute `seed_data.sql` novamente. O script limpa os dados existentes antes de inserir novos.

### ⚠️ Importante

- As imagens dos clubes, professores e eventos já estão na pasta `/public/images/`
- Os caminhos das imagens estão configurados corretamente no banco
- Certifique-se de que o Row Level Security (RLS) está ativo para segurança

### 🧪 Testar Dados

Após popular o banco, você pode testar com estas queries:

```sql
-- Verificar clubes
SELECT * FROM clubs ORDER BY distance_km;

-- Verificar professores
SELECT * FROM teachers ORDER BY rating DESC;

-- Verificar eventos próximos
SELECT * FROM events WHERE date >= CURRENT_DATE ORDER BY date;

-- Verificar esportes cadastrados
SELECT * FROM sports ORDER BY name;
```

### 🎯 Próximos Passos

Após popular o banco:
1. Faça login no aplicativo
2. Cadastre-se como novo usuário
3. Adicione esportes de interesse no seu perfil
4. Explore clubes, professores e eventos
5. Teste o sistema de swipe

### 🔐 Segurança

Todos os dados são protegidos por:
- ✅ Row Level Security (RLS)
- ✅ Políticas de acesso configuradas
- ✅ Autenticação via Supabase Auth

