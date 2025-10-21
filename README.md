# 💕 ClubNath - Apoio e Conexão para Mães

<div align="center">

![ClubNath](https://img.shields.io/badge/ClubNath-Apoio%20Maternal-ff69b4?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ecf8e?style=for-the-badge&logo=supabase)
![Claude](https://img.shields.io/badge/Claude-4.5%20Haiku-cc9966?style=for-the-badge)

**Uma plataforma de apoio e conexão para mães, com IA empática e comunidade acolhedora**

[🚀 Deploy](./docs/DEPLOYMENT.md) • [� Setup](./docs/SETUP.md) • [🤖 Robô Nath](#-robô-nath) • [� Docs](#-documentação)

**📦 Repositório:** [github.com/LionGab/boltnathH](https://github.com/LionGab/boltnathH)

</div>

---

## 📋 Índice

- [🚀 Deploy Rápido](#-deploy-no-netlify)
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Começar](#-começar)
- [Configuração](#-configuração)
- [Robô Nath](#-robô-nath)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Documentação](#-documentação)

---

## 🚀 Deploy no Netlify

### Deploy em 3 Passos (5 minutos)

1. **Acesse:** https://app.netlify.com/start
2. **Importe:** Selecione `LionGab/boltnathH` do GitHub
3. **Configure:** Adicione as variáveis de ambiente:
   - `VITE_SUPABASE_URL=https://bbcwitnbnosyfpfjtzkr.supabase.co`
   - `VITE_SUPABASE_ANON_KEY=[sua-chave-anon]`

**Pronto!** Seu app estará no ar em ~3 minutos 🎉

📖 **Guias detalhados:**
- [⚡ Deploy Rápido (5 min)](./DEPLOY_RAPIDO.md)
- [📚 Guia Completo de Deploy](./DEPLOYMENT.md)

---

## 🌟 Sobre o Projeto

ClubNath é uma plataforma digital criada para apoiar mães em sua jornada da maternidade. Oferecemos:

- 🤖 **Robô Nath**: Assistente de IA empática e acolhedora
- 📱 **Feed Social**: Compartilhe momentos e conquistas
- 💭 **Frases Diárias**: Inspiração e encorajamento
- 👥 **Comunidade**: Conexão com outras mães

### Por que ClubNath?

A maternidade pode ser desafiadora e, às vezes, solitária. O ClubNath oferece um espaço seguro onde mães podem:
- Encontrar apoio emocional 24/7
- Compartilhar suas experiências
- Sentir-se compreendidas e validadas
- Conectar-se com outras mães

---

## ✨ Funcionalidades

### 🤖 Chat com Robô Nath
- Conversas empáticas e personalizadas
- Disponível 24/7
- Powered by Claude 4.5 Haiku
- Respostas rápidas e contextualizadas

### 📱 Feed Social
- Compartilhe fotos e momentos
- Comentários e reações
- Timeline personalizada
- Modo claro/escuro

### 💭 Frases do Dia
- Mensagens inspiradoras diárias
- Lembretes de autocuidado
- Palavras de encorajamento

### 👤 Perfil Personalizado
- Gerenciamento de conta
- Histórico de atividades
- Preferências customizáveis

---

## 🛠 Tecnologias

### Frontend
- **React 18.3** - Biblioteca UI
- **TypeScript 5.6** - Tipagem estática
- **Vite** - Build tool
- **TailwindCSS** - Estilização
- **Lucide React** - Ícones

### Backend
- **Supabase** - Backend as a Service
  - Autenticação
  - Database (PostgreSQL)
  - Storage
  - Edge Functions

### IA
- **Claude 4.5 Haiku** - Modelo de linguagem da Anthropic
  - Respostas empáticas
  - Baixa latência
  - Econômico

---

## 🚀 Começar

### Pré-requisitos

- Node.js 18+ e NPM
- Conta no Supabase
- Chave de API da Anthropic

### Instalação Rápida

```bash
# 1. Clone o repositório
git clone <repository-url>
cd boltnathH

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
# (O arquivo .env já deve existir com as credenciais do Supabase)

# 4. Instale o Supabase CLI
npm install -g supabase

# 5. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse: http://localhost:5174/

---

## 🔧 Configuração

### Configuração Completa em 3 Arquivos

Criamos documentação detalhada para facilitar a configuração:

| Arquivo | Descrição | Quando Usar |
|---------|-----------|-------------|
| **[CHECKLIST.md](CHECKLIST.md)** | ✅ Checklist interativo | Acompanhe cada passo |
| **[CONFIGURACAO.md](CONFIGURACAO.md)** | 📖 Guia completo passo a passo | Instruções detalhadas |
| **[SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)** | 📋 Instruções originais | Referência técnica |

### Scripts de Configuração

#### Windows
```batch
# Instalar Supabase CLI
setup-supabase.bat

# Verificar configuração
verificar-setup.bat
```

#### Linux/Mac
```bash
# Instalar Supabase CLI
chmod +x setup-supabase.sh
./setup-supabase.sh
```

### Passos Principais

1. **Instalar Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Login e Vinculação**
   ```bash
   supabase login
   supabase link --project-ref bbcwitnbnosyfpfjtzkr
   ```

3. **Configurar API Key**
   - Acesse: [Supabase Secrets](https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/settings/vault)
   - Adicione: `ANTHROPIC_API_KEY`

4. **Deploy da Edge Function**
   ```bash
   supabase functions deploy chat-ai
   ```

5. **Testar**
   ```bash
   npm run dev
   ```

📖 **Guia completo:** Consulte [CONFIGURACAO.md](CONFIGURACAO.md)

---

## 🤖 Robô Nath

### Sobre a Assistente

A Robô Nath é uma assistente virtual especializada em apoio maternal, criada com:

- **Modelo:** Claude 4.5 Haiku (claude-haiku-4-5-20250429)
- **Características:**
  - ⚡ Respostas rápidas (< 2 segundos)
  - 💕 Tom empático e acolhedor
  - 🇧🇷 Português brasileiro natural
  - 🔒 Segura e privada

### Personalidade

- Acolhedora e compassiva
- Entende os desafios da maternidade
- Oferece apoio sem julgamentos
- Celebra pequenas conquistas
- Lembra que você é suficiente

### Exemplos de Conversas

```
👤 Você: "Estou me sentindo sobrecarregada hoje..."

🤖 Nath: "Compreendo completamente como você está se sentindo. 
A maternidade pode ser exaustiva, e tudo bem reconhecer isso. 
Você está fazendo um trabalho incrível, mesmo nos dias difíceis. 
Lembre-se: cuidar de si mesma não é egoísmo, é necessário. 💕"
```

### Tecnologia

A Robô Nath funciona através de uma **Supabase Edge Function** que:
1. Recebe a mensagem do usuário
2. Adiciona contexto de apoio maternal
3. Chama a API da Anthropic (Claude)
4. Retorna resposta empática e personalizada

**Segurança:** A API key nunca é exposta no frontend! ✅

---

## 📁 Estrutura do Projeto

```
boltnathH/
├── 📄 Documentação
│   ├── README.md                    # Este arquivo
│   ├── CONFIGURACAO.md              # Guia completo
│   ├── CHECKLIST.md                 # Checklist de setup
│   └── SETUP_INSTRUCTIONS.md        # Instruções originais
│
├── 🔧 Scripts de Setup
│   ├── setup-supabase.bat           # Windows
│   ├── setup-supabase.sh            # Linux/Mac
│   └── verificar-setup.bat          # Verificador Windows
│
├── 💻 Código Fonte
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatPage.tsx         # Chat com Robô Nath
│   │   │   ├── FeedPage.tsx         # Feed social
│   │   │   ├── DailyQuotePage.tsx   # Frases diárias
│   │   │   ├── ProfilePage.tsx      # Perfil do usuário
│   │   │   └── ...
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx      # Autenticação
│   │   │   └── ThemeContext.tsx     # Tema claro/escuro
│   │   └── lib/
│   │       └── supabase.ts          # Cliente Supabase
│   │
│   ├── supabase/
│   │   ├── functions/
│   │   │   └── chat-ai/
│   │   │       └── index.ts         # Edge Function (IA)
│   │   └── migrations/              # Migrações do DB
│   │
│   ├── 📦 Configuração
│   │   ├── .env                     # Variáveis de ambiente
│   │   ├── package.json             # Dependências
│   │   ├── vite.config.ts           # Config Vite
│   │   ├── tailwind.config.js       # Config Tailwind
│   │   └── tsconfig.json            # Config TypeScript
│   │
│   └── 🌐 Public
│       └── index.html               # HTML base
```

---

## 📖 Documentação

### Guias Disponíveis

| Documento | Descrição | Link |
|-----------|-----------|------|
| � **Setup** | Configuração inicial e em nova máquina | [docs/SETUP.md](docs/SETUP.md) |
| 🚀 **Deploy** | Guia completo de deploy no Netlify | [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) |
| 🤖 **MCP** | Configurar Model Context Protocol | [docs/MCP_SETUP.md](docs/MCP_SETUP.md) |
| 🐙 **GitHub MCP** | Setup automatizado do GitHub MCP | [docs/GITHUB_MCP_SETUP.md](docs/GITHUB_MCP_SETUP.md) |
| 🐛 **Troubleshooting** | Solução de problemas comuns | [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) |
| 🤖 **PR Automáticos** | Sistema de PRs automáticos | [.github/AUTO_PR_CONFIG.md](.github/AUTO_PR_CONFIG.md) |

### Links Úteis

- **Dashboard Supabase:** [Ver Projeto](https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr)
- **Anthropic Console:** [Gerenciar API Keys](https://console.anthropic.com/)
- **Documentação Supabase:** [Docs](https://supabase.com/docs)
- **Documentação Claude:** [API Reference](https://docs.anthropic.com/)
- **GitHub Actions:** [Ver Workflows](https://github.com/LionGab/boltnathH/actions)

---

## 🚀 Comandos Úteis

### Desenvolvimento
```bash
# Iniciar servidor dev
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Type checking
npm run typecheck
```

### Supabase
```bash
# Ver status do projeto
supabase status

# Ver logs da função
supabase functions logs chat-ai

# Deploy da função
supabase functions deploy chat-ai

# Listar secrets
supabase secrets list

# Adicionar secret
supabase secrets set KEY=value
```

### MCP (Model Context Protocol)

Configure o Claude Code/Desktop para gerenciar o projeto via GitHub:

**Linux/Mac:**
```bash
cd scripts
./setup-github-mcp.sh
```

**Windows:**
```batch
cd scripts
setup-github-mcp.bat
```

**Recursos do GitHub MCP:**
- 📝 Gerenciar issues e pull requests
- 🔍 Buscar código no repositório
- 📊 Analisar commits e branches
- 🏷️ Trabalhar com labels e milestones
- 📁 Ler e criar arquivos remotamente

📖 **Guia completo:** [docs/GITHUB_MCP_SETUP.md](docs/GITHUB_MCP_SETUP.md)

---

## 🔒 Segurança

### ✅ Implementado

- API keys armazenadas em Supabase Secrets
- Edge Functions no servidor (não no frontend)
- Autenticação via Supabase Auth
- CORS configurado corretamente
- Validação de entrada
- Fallback em caso de erro

### ⚠️ Importante

- **NUNCA** commite API keys
- **SEMPRE** use variáveis de ambiente
- **REVOGUE** chaves expostas imediatamente
- **USE** Supabase Secrets para produção

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto é privado e proprietário.

---

## 💖 Agradecimentos

- **Anthropic** - Pela tecnologia Claude
- **Supabase** - Pela plataforma backend
- **Todas as mães** - Que inspiram este projeto

---

## 📞 Suporte

Problemas ou dúvidas?

1. Consulte [Troubleshooting](docs/TROUBLESHOOTING.md)
2. Veja [Guia de Setup](docs/SETUP.md)
3. Verifique os logs: `supabase functions logs chat-ai`
4. Crie uma [issue no GitHub](https://github.com/LionGab/boltnathH/issues)

---

<div align="center">

**Feito com 💕 para apoiar mães em sua jornada**

[🏠 Início](#-clubnath---apoio-e-conexão-para-mães) • [⬆️ Topo](#)

</div>
