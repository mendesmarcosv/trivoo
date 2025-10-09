-- ============================================================================
-- TRIVOO - SETUP DE ACESSIBILIDADE E ESPORTES
-- ============================================================================
-- Este arquivo cria as tabelas de acessibilidade e esportes gerais,
-- popula com os dados fornecidos e configura as políticas RLS.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) TABELAS PRINCIPAIS
-- ----------------------------------------------------------------------------

-- 1.1) Condições de deficiência
CREATE TABLE IF NOT EXISTS disability_conditions (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  label_pt TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.2) Recursos que os locais devem ter
CREATE TABLE IF NOT EXISTS accessibility_location_resources (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  label_pt TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.3) O que os professores devem oferecer
CREATE TABLE IF NOT EXISTS coach_accessibility_offerings (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  label_pt TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.4) Esportes gerais (lista fixa)
CREATE TABLE IF NOT EXISTS sports_general (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  label_pt TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2) TABELAS DE RELACIONAMENTO (USER -> SELEÇÕES)
-- ----------------------------------------------------------------------------

-- 2.1) Condições de deficiência do usuário
CREATE TABLE IF NOT EXISTS user_disability_conditions (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  condition_id INT NOT NULL REFERENCES disability_conditions(id) ON DELETE CASCADE,
  other_description TEXT, -- Para quando selecionar "Outro"
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, condition_id)
);

-- 2.2) Recursos de acessibilidade desejados pelo usuário
CREATE TABLE IF NOT EXISTS user_desired_location_resources (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id INT NOT NULL REFERENCES accessibility_location_resources(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, resource_id)
);

-- 2.3) Ofertas de acessibilidade desejadas em professores
CREATE TABLE IF NOT EXISTS user_desired_coach_offerings (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  offering_id INT NOT NULL REFERENCES coach_accessibility_offerings(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, offering_id)
);

-- 2.4) Esportes praticados pelo usuário
CREATE TABLE IF NOT EXISTS user_sports_practiced (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sport_id INT NOT NULL REFERENCES sports_general(id) ON DELETE CASCADE,
  other_description TEXT, -- Para quando selecionar "Outro"
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, sport_id)
);

-- ----------------------------------------------------------------------------
-- 3) POPULAR DADOS (SEEDS)
-- ----------------------------------------------------------------------------

-- 3.1) Condições de deficiência
INSERT INTO disability_conditions (slug, label_pt, sort_order) VALUES
  ('cadeirante', 'Cadeirante / usa cadeira de rodas', 1),
  ('amputacao_protese', 'Amputação / usa prótese', 2),
  ('mobilidade_apoio', 'Mobilidade com apoio (muletas, andador, bengala)', 3),
  ('baixa_visao_cego', 'Baixa visão / cegueira', 4),
  ('baixa_audicao_surdo', 'Baixa audição / surdez', 5),
  ('intelectual', 'Deficiência intelectual', 6),
  ('tea_sensorial', 'TEA / sensibilidade sensorial', 7),
  ('neuromotora', 'Neuromotora (ex.: paralisia cerebral)', 8),
  ('fala_comunicacao', 'Fala / comunicação alternativa', 9),
  ('nanismo', 'Baixa estatura / nanismo', 10),
  ('multipla', 'Deficiência múltipla', 11),
  ('prefiro_nao_informar', 'Prefiro não informar', 12),
  ('outro', 'Outro (descrever)', 13)
ON CONFLICT (slug) DO NOTHING;

-- 3.2) Recursos que os locais devem ter
INSERT INTO accessibility_location_resources (slug, label_pt, sort_order) VALUES
  ('rampa', 'Rampa de acesso', 1),
  ('elevador', 'Elevador/plataforma de acesso', 2),
  ('piso_regular', 'Piso regular / sem degraus', 3),
  ('vaga_pcd', 'Vaga PCD próxima', 4),
  ('banheiro_adaptado', 'Banheiro adaptado com barras', 5),
  ('vestiario_banco', 'Banco no vestiário / área de troca', 6),
  ('chuveiro_banco', 'Chuveiro com banco', 7),
  ('area_protese', 'Espaço para ajuste/troca de prótese', 8),
  ('piso_antiderrapante', 'Piso antiderrapante na área de treino', 9),
  ('corredores_largos', 'Corredores/portas largos', 10),
  ('assento_descanso', 'Assentos de descanso próximos', 11),
  ('sinalizacao_contraste', 'Sinalização de alto contraste', 12),
  ('piso_tatil', 'Piso tátil / orientação', 13),
  ('braille', 'Placas/emblemas em Braille', 14),
  ('musica_baixa', 'Música baixa / ambiente tranquilo', 15),
  ('sem_luz_estroboscopica', 'Sem luz estroboscópica', 16),
  ('guincho_piscina', 'Guincho/cadeira de transferência em piscina', 17),
  ('equipe_pcd', 'Equipe treinada em atendimento a PcD', 18),
  ('primeiros_socorros', 'Equipe com noções de primeiros socorros', 19),
  ('acompan_habilitado', 'Permite acompanhante / cão-guia', 20)
ON CONFLICT (slug) DO NOTHING;

-- 3.3) O que os professores devem oferecer
INSERT INTO coach_accessibility_offerings (slug, label_pt, sort_order) VALUES
  ('exp_pcd', 'Experiência com PcD', 1),
  ('exp_def_especifica', 'Experiência na deficiência informada (ex.: amputação/prótese)', 2),
  ('adapta_exercicios', 'Adapta exercícios/técnica', 3),
  ('progressao_gradual', 'Progressão gradual de carga', 4),
  ('tempo_extra', 'Tempo extra para equipar/ajustar (ex.: prótese)', 5),
  ('turma_pequena', 'Turmas pequenas / atenção individual', 6),
  ('horario_tranquilo', 'Horários menos cheios', 7),
  ('checagem_espaco', 'Checagem prévia de piso/obstáculos', 8),
  ('primeiros_socorros_prof', 'Primeiros socorros (instrutor)', 9),
  ('comunicacao_objetiva', 'Comunicação objetiva e respeitosa', 10),
  ('libras_ou_legenda', 'Libras / material escrito/legendado', 11),
  ('aceita_acompanhante', 'Aceita acompanhante / cão-guia', 12)
ON CONFLICT (slug) DO NOTHING;

-- 3.4) Esportes gerais
INSERT INTO sports_general (slug, label_pt, sort_order) VALUES
  ('natacao', 'Natação', 1),
  ('hidroginastica', 'Hidroginástica', 2),
  ('biribol', 'Biribol', 3),
  ('polo_aquatico', 'Polo aquático', 4),
  ('stand_up_paddle', 'Stand up paddle', 5),
  ('canoagem_caiaque', 'Canoagem/caiaque', 6),
  ('remo', 'Remo', 7),
  ('surf_bodyboard', 'Surf/Bodyboard', 8),
  ('caminhada', 'Caminhada', 9),
  ('corrida_rua', 'Corrida de rua', 10),
  ('corrida_trilha', 'Corrida em trilha', 11),
  ('marcha_atletica', 'Marcha atlética', 12),
  ('ciclismo_urbano', 'Ciclismo urbano', 13),
  ('ciclismo_estrada', 'Ciclismo de estrada', 14),
  ('mountain_bike_mtb', 'Mountain bike (MTB)', 15),
  ('spinning', 'Spinning', 16),
  ('patins_inline', 'Patins in-line', 17),
  ('skate_longboard', 'Skate/longboard', 18),
  ('volei', 'Vôlei', 19),
  ('volei_praia', 'Vôlei de praia', 20),
  ('basquete', 'Basquete', 21),
  ('futsal', 'Futsal', 22),
  ('handebol', 'Handebol', 23),
  ('tenis', 'Tênis', 24),
  ('tenis_mesa', 'Tênis de mesa', 25),
  ('badminton', 'Badminton', 26),
  ('squash', 'Squash', 27),
  ('pickleball', 'Pickleball', 28),
  ('musculacao', 'Musculação', 29),
  ('treinamento_funcional', 'Treinamento funcional', 30),
  ('cross_training', 'Cross training', 31),
  ('calistenia', 'Calistenia', 32),
  ('ginastica_artistica_iniciante', 'Ginástica artística (iniciante)', 33),
  ('subida_de_corda', 'Subida de corda', 34),
  ('jiu_jitsu', 'Jiu-jitsu', 35),
  ('judo', 'Judô', 36),
  ('muay_thai', 'Muay Thai', 37),
  ('boxe', 'Boxe', 38),
  ('karate', 'Karatê', 39),
  ('taekwondo', 'Taekwondo', 40),
  ('capoeira', 'Capoeira', 41),
  ('esgrima', 'Esgrima', 42),
  ('trilhas_trekking', 'Trilhas/trekking', 43),
  ('orientacao', 'Orientação', 44),
  ('escalada_indoor_outdoor', 'Escalada (indoor/outdoor)', 45),
  ('slackline', 'Slackline', 46),
  ('montanhismo_via_ferrata_iniciante', 'Montanhismo/via ferrata (iniciante)', 47),
  ('arco_e_flecha', 'Arco e flecha', 48),
  ('tiro_esportivo', 'Tiro esportivo (airsoft/tiro ao alvo recreativo)', 49),
  ('lacrosse', 'Lacrosse', 50),
  ('hoquei_inline', 'Hóquei in-line', 51),
  ('floorball', 'Floorball', 52),
  ('beisebol_softbol_recreativo', 'Beisebol/softbol (recreativo)', 53),
  ('disc_golf', 'Disc golf', 54),
  ('yoga', 'Yoga', 55),
  ('pilates', 'Pilates', 56),
  ('alongamento_mobilidade', 'Alongamento/mobilidade', 57),
  ('danca_ritmos_fitdance', 'Dança (ritmos/fitdance/ballet fitness)', 58),
  ('tenis_de_praia', 'Tênis de praia', 59),
  ('beach_tennis', 'Beach tennis', 60),
  ('peteca', 'Peteca', 61),
  ('teqball_futmesa', 'Teqball (futmesa)', 62),
  ('outro', 'Outro (descrever)', 63),
  ('nunca_pratiquei', 'Nunca pratiquei', 64)
ON CONFLICT (slug) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 4) POLÍTICAS RLS (Row Level Security)
-- ----------------------------------------------------------------------------

-- Habilitar RLS em todas as tabelas
ALTER TABLE disability_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE accessibility_location_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_accessibility_offerings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sports_general ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_disability_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_desired_location_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_desired_coach_offerings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sports_practiced ENABLE ROW LEVEL SECURITY;

-- 4.1) Políticas para tabelas de referência (leitura pública)
CREATE POLICY "Todos podem ler condições de deficiência" 
  ON disability_conditions FOR SELECT 
  USING (active = true);

CREATE POLICY "Todos podem ler recursos de localização" 
  ON accessibility_location_resources FOR SELECT 
  USING (active = true);

CREATE POLICY "Todos podem ler ofertas de professores" 
  ON coach_accessibility_offerings FOR SELECT 
  USING (active = true);

CREATE POLICY "Todos podem ler esportes gerais" 
  ON sports_general FOR SELECT 
  USING (active = true);

-- 4.2) Políticas para user_disability_conditions
CREATE POLICY "Usuários podem ver suas próprias condições" 
  ON user_disability_conditions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias condições" 
  ON user_disability_conditions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias condições" 
  ON user_disability_conditions FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias condições" 
  ON user_disability_conditions FOR DELETE 
  USING (auth.uid() = user_id);

-- 4.3) Políticas para user_desired_location_resources
CREATE POLICY "Usuários podem ver seus próprios recursos desejados" 
  ON user_desired_location_resources FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios recursos desejados" 
  ON user_desired_location_resources FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios recursos desejados" 
  ON user_desired_location_resources FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios recursos desejados" 
  ON user_desired_location_resources FOR DELETE 
  USING (auth.uid() = user_id);

-- 4.4) Políticas para user_desired_coach_offerings
CREATE POLICY "Usuários podem ver suas próprias ofertas desejadas" 
  ON user_desired_coach_offerings FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias ofertas desejadas" 
  ON user_desired_coach_offerings FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias ofertas desejadas" 
  ON user_desired_coach_offerings FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias ofertas desejadas" 
  ON user_desired_coach_offerings FOR DELETE 
  USING (auth.uid() = user_id);

-- 4.5) Políticas para user_sports_practiced
CREATE POLICY "Usuários podem ver seus próprios esportes praticados" 
  ON user_sports_practiced FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios esportes praticados" 
  ON user_sports_practiced FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios esportes praticados" 
  ON user_sports_practiced FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios esportes praticados" 
  ON user_sports_practiced FOR DELETE 
  USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 5) ÍNDICES PARA PERFORMANCE
-- ----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_user_disability_conditions_user_id ON user_disability_conditions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_desired_location_resources_user_id ON user_desired_location_resources(user_id);
CREATE INDEX IF NOT EXISTS idx_user_desired_coach_offerings_user_id ON user_desired_coach_offerings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sports_practiced_user_id ON user_sports_practiced(user_id);

-- ============================================================================
-- FIM DO SETUP DE ACESSIBILIDADE
-- ============================================================================

