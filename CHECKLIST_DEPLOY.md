# ✅ Checklist - Deploy Vercel

## Antes do Deploy

- [ ] `.gitignore` configurado (arquivos SQL e MD excluídos)
- [ ] Todas as variáveis de ambiente anotadas:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `OPENAI_API_KEY`

## Durante o Deploy

- [ ] Repositório GitHub atualizado
- [ ] Projeto criado no Vercel
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Build finalizado com sucesso

## Após o Deploy

- [ ] Site acessível no domínio Vercel
- [ ] Login/Signup funcionando
- [ ] Upload de imagens funcionando
- [ ] Assistente IA respondendo
- [ ] Carrosséis carregando dados
- [ ] Mobile responsivo funcionando

## Comandos Rápidos

```bash
# Commit e push
git add .
git commit -m "Deploy: versão final"
git push origin main

# Se houver divergência
git pull --rebase origin main
git push origin main

# Deploy via CLI (opcional)
vercel --prod
```

## 🆘 Se algo der errado

1. Verifique os logs no Vercel Dashboard
2. Teste localmente: `npm run build`
3. Verifique as variáveis de ambiente
4. Consulte o `DEPLOY_VERCEL.md` para detalhes

