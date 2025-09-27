-- =====================================================
-- TRIVOO - SETUP DE ESPORTES (executar separadamente)
-- Este script cria somente as tabelas e políticas necessárias
-- para gerenciar esportes e os interesses dos usuários.
-- Execute no SQL Editor do Supabase.
-- =====================================================

-- 1) TABELA: sports (lista de esportes disponíveis)
CREATE TABLE IF NOT EXISTS sports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2) TABELA: user_sports (relação N:N usuário x esporte)
CREATE TABLE IF NOT EXISTS user_sports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  sport_id UUID NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, sport_id)
);

-- 3) RLS e políticas
ALTER TABLE sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sports ENABLE ROW LEVEL SECURITY;

-- Leitura pública da lista de esportes
DO $$ BEGIN
  CREATE POLICY "Esportes são públicos" ON sports
    FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Todos podem ver interesses (público)
DO $$ BEGIN
  CREATE POLICY "user_sports públicos" ON user_sports
    FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Usuário só insere seus próprios interesses
DO $$ BEGIN
  CREATE POLICY "Usuário pode inserir seus esportes" ON user_sports
    FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Usuário só remove seus próprios interesses
DO $$ BEGIN
  CREATE POLICY "Usuário pode remover seus esportes" ON user_sports
    FOR DELETE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 4) Índices
CREATE INDEX IF NOT EXISTS idx_user_sports_user ON user_sports(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sports_sport ON user_sports(sport_id);

-- 5) SEED opcional (esportes da imagem)
INSERT INTO sports (name, category) VALUES
  ('Escalada esportiva (indoor)', 'Aventura'),
  ('Arco e flecha indígena', 'Cultural'),
  ('Lacrosse', 'Coletivo'),
  ('Polo aquático', 'Aquático'),
  ('Orientação', 'Aventura'),
  ('Parkour', 'Urbano'),
  ('Marcha atlética', 'Atletismo'),
  ('Korfebol', 'Coletivo'),
  ('Ultimate Frisbee', 'Coletivo'),
  ('Biribol', 'Aquático'),
  ('Bocha (versão convencional)', 'Precisão'),
  ('Sumô', 'Combate'),
  ('Hóquei sobre grama', 'Coletivo'),
  ('Slackline', 'Equilíbrio'),
  ('Patins street', 'Urbano'),
  ('Floorball', 'Coletivo'),
  ('Esgrima', 'Combate'),
  ('Footgolf', 'Precisão'),
  ('Corrida de drones (FPV)', 'Tecnologia'),
  ('Squash', 'Raquete'),
  ('Subida de corda', 'Força'),
  ('Kinball', 'Coletivo'),
  ('Tamboréu', 'Raquete')
ON CONFLICT (name) DO NOTHING;


