# Trivoo - Plataforma de Esportes

Uma plataforma web moderna para descoberta e reserva de aulas de esportes, construída com Next.js, React e TypeScript.

## 🚀 Funcionalidades

- **Descoberta de Esportes**: Explore diferentes modalidades esportivas
- **Clubes e Centros**: Encontre centros de treinamento próximos
- **Professores**: Conecte-se com instrutores qualificados
- **Eventos**: Participe de eventos esportivos na sua região
- **Autenticação**: Sistema completo de login/cadastro com Supabase
- **Interface Responsiva**: Design moderno e mobile-first

## 🛠️ Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **React 18** - Biblioteca para interfaces
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Supabase** - Backend como serviço (autenticação e banco de dados)
- **Swiper.js** - Carrosséis responsivos
- **Phosphor Icons** - Biblioteca de ícones

## 📁 Estrutura do Projeto

```
trivoo/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Layout raiz da aplicação
│   │   └── page.tsx        # Página inicial
│   ├── components/         # Componentes React
│   │   ├── Sidebar.tsx
│   │   ├── GreetingSection.tsx
│   │   ├── ClubsSection.tsx
│   │   ├── TeachersSection.tsx
│   │   ├── EventsSection.tsx
│   │   └── AuthModal.tsx
│   ├── lib/
│   │   ├── supabase.ts     # Configuração Supabase
│   │   └── hooks/          # Hooks customizados
│   │       ├── useAuth.ts
│   │       ├── useForm.ts
│   │       └── useSwiper.ts
│   └── styles/
│       ├── globals.css     # Estilos globais
│       ├── styles.css      # Estilos customizados
│       └── responsive.css  # Estilos responsivos
├── backup-original/        # Arquivos do projeto original
└── public/                 # Arquivos estáticos
```

## 🚀 Como Executar

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd trivoo
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**

   Copie o arquivo de exemplo e configure suas credenciais do Supabase:
   ```bash
   cp env.example .env.local
   ```

   Edite o `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Execute o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Acesse no navegador**
   ```
   http://localhost:3000
   ```

## 📦 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter

## 🔧 Configuração do Supabase

### 1. Criar/Configurar Projeto
1. Acesse [supabase.com](https://supabase.com) e faça login
2. Selecione seu projeto existente ou crie um novo

### 2. Configurar Variáveis de Ambiente
No arquivo `.env.local`, substitua pelas suas credenciais reais:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Obter as Credenciais
1. No painel do Supabase, vá para **Settings** → **API**
2. Copie o **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
3. Copie o **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Configurar Autenticação (Opcional)
No painel do Supabase:
1. Vá para **Authentication** → **Settings**
2. Configure:
   - **Site URL**: `http://localhost:3000` (para desenvolvimento)
   - **Redirect URLs**: Adicione as URLs permitidas
   - **Enable email confirmations** (opcional)

### 5. Testar a Conexão
Após configurar, execute:
```bash
npm run dev
```

Se aparecer erro sobre variáveis de ambiente, verifique se o arquivo `.env.local` está correto.

### Tabelas Necessárias

O projeto utiliza as seguintes tabelas no Supabase:

- `contacts` - Para formulários de contato
- `profiles` - Para perfis de usuário (criada automaticamente pela autenticação)

## 🎨 Estilos

O projeto utiliza uma combinação de:
- **Tailwind CSS** para utilitários
- **CSS Customizado** para componentes específicos
- **Variáveis CSS** para tema consistente

## 📱 Responsividade

O layout é totalmente responsivo e otimizado para:
- Desktop (1024px+)
- Tablet (640px - 1023px)
- Mobile (320px - 639px)

## 🔒 Autenticação

Sistema completo de autenticação incluindo:
- Login/cadastro com email e senha
- Recuperação de senha
- Gerenciamento de sessão
- Proteção de rotas

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.