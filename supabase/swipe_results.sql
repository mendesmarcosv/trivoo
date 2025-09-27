-- =====================================================
-- TRIVOO - Tabelas opcionais para armazenar resultados do Swipe Quiz
-- Execute somente se quiser persistir resultados/estatísticas
-- =====================================================

CREATE TABLE IF NOT EXISTS swipe_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS swipe_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES swipe_sessions(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  liked BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS swipe_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES swipe_sessions(id) ON DELETE CASCADE,
  sport_name TEXT NOT NULL,
  score INT NOT NULL,
  rank INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE swipe_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipe_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipe_recommendations ENABLE ROW LEVEL SECURITY;

-- leitura pública
DO $$ BEGIN
  CREATE POLICY "swipe_sessions select" ON swipe_sessions FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "swipe_answers select" ON swipe_answers FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "swipe_recommendations select" ON swipe_recommendations FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- inserção limitada ao usuário logado
DO $$ BEGIN
  CREATE POLICY "swipe_sessions insert" ON swipe_sessions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "swipe_answers insert" ON swipe_answers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "swipe_recommendations insert" ON swipe_recommendations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS idx_swipe_answers_session ON swipe_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_swipe_recommendations_session ON swipe_recommendations(session_id);





