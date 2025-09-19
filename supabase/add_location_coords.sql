-- =====================================================
-- TRIVOO - ADD location_coords EM profiles (rodar separado)
-- Objetivo: adicionar a coluna JSONB para guardar cidade/estado/lat/lng
-- Execução: cole no SQL Editor do Supabase e rode uma vez
-- Seguro para reexecução (usa IF NOT EXISTS)
-- =====================================================

-- 1) Adicionar coluna JSONB para coordenadas e metadados de localização
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS location_coords JSONB;

-- 2) Índice opcional para consultas por chaves dentro do JSONB
CREATE INDEX IF NOT EXISTS idx_profiles_location_coords ON profiles USING GIN (location_coords);

-- 3) Backfill opcional: se já existe texto em profiles.location, copia para o JSON
-- (ajuste 'RJ' se quiser assumir outro estado padrão)
UPDATE profiles
SET location_coords = jsonb_build_object('city', location, 'state', 'RJ')
WHERE location IS NOT NULL
  AND (location_coords IS NULL OR location_coords = 'null'::jsonb);

-- Observações:
-- - Políticas RLS existentes de UPDATE em profiles continuam válidas; não é necessário alterá-las.
-- - A aplicação salva neste formato: { city: string, state: string, lat: number, lng: number }.
-- - Caso queira limpar depois: UPDATE profiles SET location_coords = NULL WHERE ...;


