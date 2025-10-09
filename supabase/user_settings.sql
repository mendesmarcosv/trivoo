-- =====================================================
-- CRIAR TABELA user_settings
-- =====================================================
-- Execute esta query no Editor SQL do Supabase Dashboard

-- 1. Criar tabela user_settings
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Configurações de notificação
  notification_settings JSONB DEFAULT '{
    "push_enabled": true,
    "email_enabled": true,
    "new_events": true,
    "event_reminders": true,
    "club_updates": true,
    "teacher_messages": true,
    "sports_recommendations": false
  }'::jsonb,
  
  -- Preferências de unidades
  unit_preferences JSONB DEFAULT '{
    "distance": "km",
    "weight": "kg",
    "height": "cm"
  }'::jsonb,
  
  -- Preferências de idioma
  language_preferences JSONB DEFAULT '{
    "language": "pt-BR",
    "timezone": "America/Sao_Paulo",
    "dateFormat": "DD/MM/YYYY"
  }'::jsonb,
  
  -- Configurações de feedback tátil
  haptic_settings JSONB DEFAULT '{
    "enabled": true,
    "intensity": 50,
    "button_vibration": true,
    "success_vibration": true,
    "error_vibration": true
  }'::jsonb,
  
  -- Configurações de exibição
  display_settings JSONB DEFAULT '{
    "high_contrast": false,
    "font_size": 100,
    "bold_text": false,
    "reduce_transparency": false,
    "color_blind_mode": "none"
  }'::jsonb,
  
  -- Preferências de acessibilidade
  accessibility_preferences JSONB DEFAULT '{
    "wheelchair_access": false,
    "sign_language": false,
    "audio_description": false,
    "adapted_equipment": false,
    "accessible_parking": false,
    "accessible_restroom": false
  }'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Garantir que cada usuário tenha apenas uma linha de configurações
  UNIQUE(user_id)
);

-- 2. Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- 3. Habilitar RLS (Row Level Security)
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas RLS
-- Política de SELECT: usuários podem ler apenas suas próprias configurações
DROP POLICY IF EXISTS "Users can view their own settings" ON user_settings;
CREATE POLICY "Users can view their own settings" 
ON user_settings
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Política de INSERT: usuários podem criar suas próprias configurações
DROP POLICY IF EXISTS "Users can insert their own settings" ON user_settings;
CREATE POLICY "Users can insert their own settings" 
ON user_settings
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Política de UPDATE: usuários podem atualizar apenas suas próprias configurações
DROP POLICY IF EXISTS "Users can update their own settings" ON user_settings;
CREATE POLICY "Users can update their own settings" 
ON user_settings
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- Política de DELETE: usuários podem deletar apenas suas próprias configurações
DROP POLICY IF EXISTS "Users can delete their own settings" ON user_settings;
CREATE POLICY "Users can delete their own settings" 
ON user_settings
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- =====================================================
-- CRIAR TABELA support_tickets (para relatar problemas)
-- =====================================================

CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para support_tickets
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);

-- Habilitar RLS para support_tickets
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Políticas para support_tickets
DROP POLICY IF EXISTS "Users can view their own tickets" ON support_tickets;
CREATE POLICY "Users can view their own tickets" 
ON support_tickets
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create tickets" ON support_tickets;
CREATE POLICY "Users can create tickets" 
ON support_tickets
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- ADICIONAR CAMPOS FALTANTES NA TABELA profiles
-- =====================================================

-- Adicionar campos de localização e configuração (se não existirem)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'location_enabled'
  ) THEN
    ALTER TABLE profiles ADD COLUMN location_enabled BOOLEAN DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'search_radius'
  ) THEN
    ALTER TABLE profiles ADD COLUMN search_radius INTEGER DEFAULT 10;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'is_deleted'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_deleted BOOLEAN DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'deleted_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN deleted_at TIMESTAMPTZ;
  END IF;
END $$;

-- =====================================================
-- VERIFICAR CONFIGURAÇÃO
-- =====================================================

-- Verificar se as tabelas foram criadas
SELECT 'user_settings' as table_name, COUNT(*) as exists 
FROM information_schema.tables 
WHERE table_name = 'user_settings'
UNION ALL
SELECT 'support_tickets', COUNT(*) 
FROM information_schema.tables 
WHERE table_name = 'support_tickets';

-- Verificar políticas RLS
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('user_settings', 'support_tickets')
ORDER BY tablename, policyname;
