# Trivoo - Plataforma Web

Uma aplicação web moderna construída com HTML, CSS e JavaScript puro, integrada com Supabase como backend.

## 🚀 Funcionalidades

- ✅ Design responsivo e moderno
- ✅ Sistema de autenticação completo
- ✅ Formulários com validação em tempo real
- ✅ Integração com Supabase
- ✅ Animações e efeitos visuais
- ✅ Interface mobile-friendly

## 📋 Pré-requisitos

- Navegador web moderno
- Conta no [Supabase](https://supabase.com)

## 🛠️ Configuração

### 1. Clone o repositório
```bash
git clone https://github.com/mendesmarcosv/trivoo.git
cd trivoo
```

### 2. Configure o Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. Vá para Settings > API
3. Copie a **URL do projeto** e a **chave anônima**
4. Abra o arquivo `assets/js/config.js`
5. Substitua os valores:
```javascript
const SUPABASE_URL = 'SUA_URL_DO_SUPABASE';
const SUPABASE_ANON_KEY = 'SUA_CHAVE_ANONIMA';
```

### 3. Configure as tabelas no Supabase

Execute estes comandos SQL no SQL Editor do Supabase:

```sql
-- Tabela para contatos
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para usuários (já criada automaticamente pelo auth)
-- Você pode adicionar campos customizados se necessário
```

### 4. Execute o projeto

Abra o arquivo `index.html` no seu navegador ou use um servidor local:

```bash
# Usando Python
python -m http.server 8000

# Usando Node.js
npx serve .

# Usando PHP
php -S localhost:8000
```

Acesse: `http://localhost:8000`

## 📱 Estrutura do Projeto

```
trivoo/
├── index.html              # Página principal
├── assets/
│   ├── css/
│   │   ├── styles.css      # Estilos principais
│   │   └── responsive.css  # Estilos responsivos
│   └── js/
│       ├── config.js       # Configuração do Supabase
│       ├── app.js          # Aplicação principal
│       ├── auth.js         # Sistema de autenticação
│       └── forms.js        # Gerenciamento de formulários
├── pages/                  # Páginas adicionais
├── components/             # Componentes reutilizáveis
└── README.md              # Este arquivo
```

## 🎨 Personalização

### Cores
As cores principais estão definidas no arquivo `assets/css/styles.css`. Para alterar:

```css
/* Gradiente principal */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Cores secundárias */
.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Tipografia
O projeto usa Google Fonts (Inter). Para alterar, modifique o link no `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=SUA_FONTE:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

## 🔧 Desenvolvimento

### Adicionando novas funcionalidades

1. **Nova página**: Crie um arquivo HTML em `pages/` e adicione ao menu
2. **Novo componente**: Crie arquivos em `components/` e importe no HTML
3. **Nova funcionalidade**: Adicione código aos arquivos JS correspondentes

### Estrutura dos módulos JavaScript

- `config.js`: Configurações globais e Supabase
- `app.js`: Lógica principal da aplicação
- `auth.js`: Gerenciamento de autenticação
- `forms.js`: Validação e manipulação de formulários

## 🌐 Deploy

### GitHub Pages
1. Vá para Settings > Pages no seu repositório
2. Selecione "main" como branch
3. Selecione "/ (root)" como folder
4. Salve e aguarde o deploy

### Outras opções
- Vercel
- Netlify
- Firebase Hosting
- AWS S3 + CloudFront

## 📞 Suporte

Para dúvidas ou sugestões, abra uma issue no GitHub ou entre em contato através do formulário na aplicação.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
