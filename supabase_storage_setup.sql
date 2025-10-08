-- =====================================================
-- CONFIGURAÇÃO COMPLETA DO SUPABASE STORAGE PARA AVATARS
-- =====================================================
-- Execute esta query no Editor SQL do Supabase Dashboard
-- para configurar automaticamente o bucket e políticas

-- 1. CRIAR BUCKET 'avatars' (se não existir)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB em bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 2. REMOVER POLÍTICAS EXISTENTES (se houver)
DROP POLICY IF EXISTS "Allow authenticated users to upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON storage.objects;
DROP POLICY IF EXISTS "Enable read access for all users" ON storage.objects;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON storage.objects;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON storage.objects;

-- 3. CRIAR POLÍTICAS DE ACESSO

-- Política 1: Permitir upload para usuários autenticados
CREATE POLICY "Allow authenticated users to upload avatars" 
ON storage.objects
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- Política 2: Permitir leitura pública
CREATE POLICY "Allow public read access to avatars" 
ON storage.objects
FOR SELECT 
TO public
USING (bucket_id = 'avatars');

-- Política 3: Permitir usuários atualizarem suas próprias imagens
CREATE POLICY "Allow users to update their own avatars" 
ON storage.objects
FOR UPDATE 
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Política 4: Permitir usuários deletarem suas próprias imagens
CREATE POLICY "Allow users to delete their own avatars" 
ON storage.objects
FOR DELETE 
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 4. VERIFICAR CONFIGURAÇÃO
-- Execute estas queries para verificar se tudo foi criado corretamente:

-- Verificar se o bucket foi criado
SELECT * FROM storage.buckets WHERE id = 'avatars';

-- Verificar se as políticas foram criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%avatar%';

-- =====================================================
-- INSTRUÇÕES DE USO:
-- =====================================================
-- 1. Copie toda esta query
-- 2. Cole no Editor SQL do Supabase Dashboard
-- 3. Clique em "Run" para executar
-- 4. Verifique se não há erros
-- 5. Teste o upload de imagem na aplicação
-- =====================================================

-- =====================================================
-- QUERY ALTERNATIVA (POLÍTICAS MAIS SIMPLES):
-- =====================================================
-- Se as políticas acima não funcionarem, descomente e execute esta versão:

/*
-- Políticas mais simples (descomente se necessário)
CREATE POLICY "Enable insert for authenticated users only" 
ON storage.objects
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Enable read access for all users" 
ON storage.objects
FOR SELECT 
TO public
USING (bucket_id = 'avatars');

CREATE POLICY "Enable update for authenticated users only" 
ON storage.objects
FOR UPDATE 
TO authenticated
USING (bucket_id = 'avatars');

CREATE POLICY "Enable delete for authenticated users only" 
ON storage.objects
FOR DELETE 
TO authenticated
USING (bucket_id = 'avatars');
*/
