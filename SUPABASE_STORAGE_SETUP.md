# Configuração do Supabase Storage para Avatars

## 🚨 Erro de Upload de Imagem

Se você está recebendo erro ao fazer upload da imagem, é porque o bucket `avatars` não existe no Supabase Storage ou não tem as políticas de acesso configuradas.

## 📋 Passos para Configurar

### 1. Criar o Bucket `avatars`

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá para o seu projeto
3. Clique em **Storage** no menu lateral
4. Clique em **Create a new bucket**
5. Nome do bucket: `avatars`
6. Marque **Public bucket** (para permitir acesso público às imagens)
7. Clique em **Create bucket**

### 2. Configurar Políticas de Acesso (RLS)

1. No bucket `avatars`, clique em **Policies**
2. Clique em **New Policy**
3. Selecione **For full customization**
4. Configure as seguintes políticas:

#### Política 1: Permitir upload para usuários autenticados
```sql
-- Nome: Allow authenticated users to upload avatars
-- Operação: INSERT
-- Target roles: authenticated

CREATE POLICY "Allow authenticated users to upload avatars" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'avatars');
```

#### Política 2: Permitir leitura pública
```sql
-- Nome: Allow public read access to avatars
-- Operação: SELECT
-- Target roles: public

CREATE POLICY "Allow public read access to avatars" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'avatars');
```

#### Política 3: Permitir usuários atualizarem suas próprias imagens
```sql
-- Nome: Allow users to update their own avatars
-- Operação: UPDATE
-- Target roles: authenticated

CREATE POLICY "Allow users to update their own avatars" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

#### Política 4: Permitir usuários deletarem suas próprias imagens
```sql
-- Nome: Allow users to delete their own avatars
-- Operação: DELETE
-- Target roles: authenticated

CREATE POLICY "Allow users to delete their own avatars" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 3. Verificar Configuração

Após configurar, teste o upload de imagem na aplicação:

1. Acesse `/editar-perfil`
2. Clique em "Alterar foto"
3. Selecione uma imagem
4. Faça o crop
5. Confirme o upload

## 🔧 Solução Alternativa (Políticas Simples)

Se as políticas acima não funcionarem, use estas políticas mais simples:

### Política de Upload (INSERT)
```sql
CREATE POLICY "Enable insert for authenticated users only" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'avatars');
```

### Política de Leitura (SELECT)
```sql
CREATE POLICY "Enable read access for all users" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'avatars');
```

### Política de Atualização (UPDATE)
```sql
CREATE POLICY "Enable update for authenticated users only" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'avatars');
```

### Política de Exclusão (DELETE)
```sql
CREATE POLICY "Enable delete for authenticated users only" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'avatars');
```

## 🎯 Estrutura de Arquivos

O código está configurado para salvar as imagens com o seguinte padrão:
- **Nome do arquivo:** `{user-id}-{timestamp}.jpg`
- **Bucket:** `avatars`
- **Formato:** JPEG (conversão automática)

## ✅ Verificação Final

Após configurar, verifique:

1. ✅ Bucket `avatars` existe
2. ✅ Bucket é público
3. ✅ Políticas RLS configuradas
4. ✅ Usuário está autenticado
5. ✅ Imagem é válida (JPG, PNG, WebP, max 5MB)

## 🐛 Debug

Se ainda houver erro, verifique:

1. **Console do navegador** - erros JavaScript
2. **Network tab** - requisições falhando
3. **Supabase Logs** - erros no servidor
4. **Políticas RLS** - se estão ativas

## 📞 Suporte

Se o problema persistir, verifique:
- Versão do Supabase
- Configurações de CORS
- Limites de upload do projeto
