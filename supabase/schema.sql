-- =====================================================
-- TRIVOO - SCHEMA E DADOS INICIAIS DO SUPABASE
-- =====================================================

-- Limpar tabelas existentes (se necessário)
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS clubs CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- =====================================================
-- CONFIGURAÇÃO DO SUPABASE STORAGE
-- =====================================================

-- Criar buckets para armazenar imagens
INSERT INTO storage.buckets (id, name, public) VALUES
('avatars', 'avatars', true),
('clubs', 'clubs', true),
('teachers', 'teachers', true),
('events', 'events', true),
('banners', 'banners', true);

-- Políticas de acesso para o bucket de avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" ON storage.objects
FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar" ON storage.objects
FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Políticas de acesso para o bucket de clubs
CREATE POLICY "Club images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'clubs');

CREATE POLICY "Authenticated users can upload club images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'clubs' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update club images" ON storage.objects
FOR UPDATE USING (bucket_id = 'clubs' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete club images" ON storage.objects
FOR DELETE USING (bucket_id = 'clubs' AND auth.role() = 'authenticated');

-- Políticas de acesso para o bucket de teachers
CREATE POLICY "Teacher images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'teachers');

CREATE POLICY "Authenticated users can upload teacher images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'teachers' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update teacher images" ON storage.objects
FOR UPDATE USING (bucket_id = 'teachers' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete teacher images" ON storage.objects
FOR DELETE USING (bucket_id = 'teachers' AND auth.role() = 'authenticated');

-- Políticas de acesso para o bucket de events
CREATE POLICY "Event images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'events');

CREATE POLICY "Authenticated users can upload event images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'events' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update event images" ON storage.objects
FOR UPDATE USING (bucket_id = 'events' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete event images" ON storage.objects
FOR DELETE USING (bucket_id = 'events' AND auth.role() = 'authenticated');

-- Políticas de acesso para o bucket de banners
CREATE POLICY "Banner images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'banners');

CREATE POLICY "Authenticated users can upload banner images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'banners' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update banner images" ON storage.objects
FOR UPDATE USING (bucket_id = 'banners' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete banner images" ON storage.objects
FOR DELETE USING (bucket_id = 'banners' AND auth.role() = 'authenticated');

-- =====================================================
-- TABELA: sports (esportes disponíveis)
-- =====================================================
CREATE TABLE sports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir os esportes da imagem
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
('Tamboréu', 'Raquete');

-- =====================================================
-- TABELA: profiles (perfis de usuários)
-- =====================================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  phone TEXT,
  bio TEXT,
  location TEXT DEFAULT 'Niterói',
  location_coords JSONB, -- {lat: number, lng: number, city: string, state: string}
  avatar_url TEXT, -- URL do Supabase Storage
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: user_sports (relação usuários-esportes)
-- =====================================================
CREATE TABLE user_sports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  sport_id UUID REFERENCES sports(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, sport_id)
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sports ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para profiles
CREATE POLICY "Usuários podem ver todos os perfis" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Usuários podem atualizar seu próprio perfil" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seu próprio perfil" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas de segurança para sports
CREATE POLICY "Esportes são públicos" ON sports
  FOR SELECT USING (true);

-- Políticas de segurança para user_sports
CREATE POLICY "Usuários podem ver esportes de todos" ON user_sports
  FOR SELECT USING (true);

CREATE POLICY "Usuários podem adicionar seus próprios esportes" ON user_sports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem remover seus próprios esportes" ON user_sports
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- TABELA: clubs (clubes e centros de treinamento)
-- =====================================================
CREATE TABLE clubs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  distance_km DECIMAL(5,2),
  sports TEXT[] NOT NULL,
  image_url TEXT, -- URL do Supabase Storage
  address TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir dados dos clubes (sem imagens por enquanto)
INSERT INTO clubs (name, distance_km, sports, address) VALUES
('Centro Horizonte', 9, ARRAY['Goalball', 'Bocha paralímpica'], 'Rua das Flores, 123, Icaraí'),
('Boulder Lab', 11, ARRAY['Escalada indoor', 'Slackline'], 'Av. Roberto Silveira, 456, Centro'),
('Ginásio Aquático', 7, ARRAY['Natação adaptada', 'Hidroginástica'], 'Rua do Esporte, 789, Santa Rosa'),
('Arena Verde', 12, ARRAY['Futebol de 5', 'Atletismo'], 'Estrada da Alameda, 321, Charitas'),
('Biribol & Natação Adaptada São Francisco', 15, ARRAY['Biribol', 'Natação Adaptada'], 'Rua São Francisco, 654, São Francisco'),
('Tamboréu Praia Clube', 16, ARRAY['Tamboréu', 'Beach Ultimate'], 'Praia de Camboinhas, 987, Camboinhas'),
('Hangar 101', 24, ARRAY['Corrida de Drone'], 'Rua do Hangar, 101, Pendotiba');

-- =====================================================
-- TABELA: teachers (professores)
-- =====================================================
CREATE TABLE teachers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  sport TEXT NOT NULL,
  rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
  total_reviews INTEGER DEFAULT 0,
  location TEXT NOT NULL,
  avatar_url TEXT, -- URL do Supabase Storage
  price_per_hour DECIMAL(6,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir dados dos professores (sem imagens por enquanto)
INSERT INTO teachers (name, sport, rating, total_reviews, location, price_per_hour) VALUES
('Clarice Neri', 'Tamboréu', 4.8, 32, 'Arena de Squash Santa Rosa', 120.00),
('Rogério Saito', 'Tamboréu', 4.3, 21, 'Centro de Treino Várzea das Moças', 95.00),
('Naomi Tanaka', 'Tamboréu', 4.9, 45, 'Ginásio São Domingos', 150.00),
('Gabriel Mitter', 'Tamboréu', 4.2, 18, 'Campo Caio Martins', 80.00),
('Yara Poliguara', 'Tamboréu', 4.5, 27, 'Área Verde Maria Paula', 110.00),
('Bruno Dantas', 'Tamboréu', 4.6, 33, 'Climb House Pendotiba', 100.00),
('Carlos Silva', 'Escalada', 4.7, 29, 'Boulder Lab', 130.00),
('Marina Costa', 'Natação Adaptada', 4.9, 51, 'Ginásio Aquático', 140.00),
('Pedro Almeida', 'Biribol', 4.4, 22, 'Praia de Icaraí', 90.00),
('Ana Santos', 'Goalball', 4.8, 38, 'Centro Horizonte', 115.00);

-- =====================================================
-- TABELA: events (eventos esportivos)
-- =====================================================
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT, -- URL do Supabase Storage
  sport TEXT NOT NULL,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  price DECIMAL(6,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir dados dos eventos (sem imagens por enquanto)
INSERT INTO events (title, date, time, location, sport, max_participants, current_participants, price) VALUES
('Torneio de Tamboréu', '2025-10-15', '14:00', 'Arena Central', 'Tamboréu', 32, 18, 50.00),
('Aula aberta de Goalball', '2025-10-18', '10:00', 'Centro Horizonte', 'Goalball', 20, 12, 0.00),
('Competição de Boulder', '2025-10-20', '16:00', 'Boulder Lab', 'Escalada', 40, 35, 75.00),
('Festival de Biribol', '2025-10-22', '09:00', 'Praia de Icaraí', 'Biribol', 50, 28, 30.00),
('Corrida de Drones', '2025-10-25', '15:00', 'Hangar 101', 'Drone Racing', 16, 14, 120.00),
('Clínica de Natação Adaptada', '2025-10-28', '08:00', 'Ginásio Aquático', 'Natação', 25, 20, 40.00);

-- =====================================================
-- FUNÇÕES ÚTEIS PARA SUPABASE STORAGE
-- =====================================================

-- Função para gerar URL pública do Supabase Storage
CREATE OR REPLACE FUNCTION get_public_url(bucket_name TEXT, file_path TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN 'https://' || current_setting('app.settings.supabase_url') || '/storage/v1/object/public/' || bucket_name || '/' || file_path;
END;
$$ LANGUAGE plpgsql;

-- Função para deletar arquivo do storage quando deletar registro
CREATE OR REPLACE FUNCTION delete_storage_file()
RETURNS TRIGGER AS $$
BEGIN
  -- Deletar arquivo do storage se existir
  IF OLD.avatar_url IS NOT NULL THEN
    PERFORM storage.delete_object('avatars', OLD.avatar_url);
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger para deletar avatar quando deletar perfil
CREATE TRIGGER delete_profile_avatar
  BEFORE DELETE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION delete_storage_file();

-- =====================================================
-- FUNÇÕES E TRIGGERS
-- =====================================================

-- Função para atualizar o campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at em profiles
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ÍNDICES PARA MELHOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_clubs_distance ON clubs(distance_km);
CREATE INDEX idx_teachers_rating ON teachers(rating DESC);
CREATE INDEX idx_teachers_sport ON teachers(sport);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_sport ON events(sport);

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View para professores com melhor avaliação
CREATE VIEW top_teachers AS
SELECT * FROM teachers
WHERE rating >= 4.5
ORDER BY rating DESC, total_reviews DESC;

-- View para eventos próximos (próximos 30 dias)
CREATE VIEW upcoming_events AS
SELECT * FROM events
WHERE date >= CURRENT_DATE AND date <= CURRENT_DATE + INTERVAL '30 days'
ORDER BY date, time;

-- View para clubes próximos (até 15km)
CREATE VIEW nearby_clubs AS
SELECT * FROM clubs
WHERE distance_km <= 15
ORDER BY distance_km;

-- =====================================================
-- PERMISSÕES RLS PARA OUTRAS TABELAS
-- =====================================================

-- Habilitar RLS nas tabelas
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Políticas de leitura pública
CREATE POLICY "Clubes são públicos" ON clubs
  FOR SELECT USING (true);

CREATE POLICY "Professores são públicos" ON teachers
  FOR SELECT USING (true);

CREATE POLICY "Eventos são públicos" ON events
  FOR SELECT USING (true);

-- =====================================================
-- COMENTÁRIOS NAS TABELAS
-- =====================================================
COMMENT ON TABLE profiles IS 'Perfis de usuários do Trivoo';
COMMENT ON TABLE clubs IS 'Clubes e centros de treinamento esportivo';
COMMENT ON TABLE teachers IS 'Professores e instrutores esportivos';
COMMENT ON TABLE events IS 'Eventos esportivos próximos';

-- =====================================================
-- INSTRUÇÕES DE USO DO SUPABASE STORAGE
-- =====================================================

/*
COMO USAR O SUPABASE STORAGE:

1. UPLOAD DE IMAGEM:
   - Use a função: supabase.storage.from('bucket_name').upload('path/file.jpg', file)
   - Exemplo: supabase.storage.from('avatars').upload('user-123/avatar.jpg', file)

2. OBTER URL PÚBLICA:
   - Use: supabase.storage.from('bucket_name').getPublicUrl('path/file.jpg')
   - Exemplo: supabase.storage.from('avatars').getPublicUrl('user-123/avatar.jpg')

3. DELETAR IMAGEM:
   - Use: supabase.storage.from('bucket_name').remove(['path/file.jpg'])
   - Exemplo: supabase.storage.from('avatars').remove(['user-123/avatar.jpg'])

BUCKETS CRIADOS:
- avatars: Para fotos de perfil dos usuários
- clubs: Para imagens dos clubes
- teachers: Para fotos dos professores
- events: Para imagens dos eventos
- banners: Para imagens dos banners do carrossel

ESTRUTURA DE PASTAS RECOMENDADA:
- avatars/user-{user_id}/avatar.jpg
- clubs/club-{club_id}/image.jpg
- teachers/teacher-{teacher_id}/avatar.jpg
- events/event-{event_id}/image.jpg
- banners/banner-{banner_id}/image.jpg
*/
