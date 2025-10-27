# 🔒 Guia de Segurança - ClubNath VIP

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Variáveis de Ambiente](#variáveis-de-ambiente)
3. [Row Level Security (RLS) - Supabase](#row-level-security-rls---supabase)
4. [Práticas de Código Seguro](#práticas-de-código-seguro)
5. [Monitoramento e Resposta a Incidentes](#monitoramento-e-resposta-a-incidentes)
6. [Checklist de Segurança](#checklist-de-segurança)

---

## Visão Geral

Este documento descreve as práticas de segurança implementadas no ClubNath VIP e fornece diretrizes para manter a aplicação segura.

### Stack de Segurança

- **Backend:** Supabase com Row Level Security (RLS)
- **Frontend:** React com validação de inputs
- **Monitoramento:** Sentry para rastreamento de erros
- **CI/CD:** GitHub Actions com scanning de segredos e vulnerabilidades
- **Pre-commit:** Husky + lint-staged para bloquear commits inseguros

---

## Variáveis de Ambiente

### ⚠️ REGRAS CRÍTICAS

1. **NUNCA** commite arquivos `.env` no Git
2. **SEMPRE** use `VITE_` como prefixo para variáveis expostas ao cliente
3. **SEMPRE** valide variáveis de ambiente no startup
4. **IMEDIATAMENTE** rotacione chaves se forem expostas

### Configuração

#### 1. Criando seu `.env`

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite com seus valores reais
nano .env
```

#### 2. Variáveis Obrigatórias

```env
# Supabase (OBRIGATÓRIO)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App Configuration
VITE_APP_URL=https://clubnath.app
VITE_ENVIRONMENT=production
```

#### 3. Variáveis Opcionais

```env
# Sentry (Recomendado para produção)
VITE_SENTRY_DSN=https://xxx@sentry.io/yyy
VITE_APP_VERSION=1.0.0
```

### Validação Automática

O arquivo `src/lib/env-validator.ts` valida todas as variáveis necessárias no startup:

```typescript
import { validateEnvOrThrow } from './lib/env-validator';

// Em main.tsx ou App.tsx
validateEnvOrThrow();
```

---

## Row Level Security (RLS) - Supabase

### Conceito

Row Level Security (RLS) é a camada de segurança **mais crítica** da aplicação. Ela garante que:

- Usuários só acessem seus próprios dados
- Operações sejam autorizadas no nível do banco
- Mesmo com a API key, dados não podem ser acessados indevidamente

### ⚠️ IMPORTANTE

**SEM RLS, QUALQUER PESSOA COM A CHAVE ANON PODE ACESSAR/MODIFICAR TODOS OS DADOS!**

### Políticas Implementadas

#### 1. Tabela `profiles`

```sql
-- Usuários podem ler todos os perfis públicos
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

-- Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
```

#### 2. Tabela `posts`

```sql
-- Qualquer usuário autenticado pode ler posts
CREATE POLICY "Posts are viewable by authenticated users"
ON posts FOR SELECT
TO authenticated
USING (true);

-- Usuários podem criar posts
CREATE POLICY "Users can create posts"
ON posts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Usuários podem editar/deletar apenas seus posts
CREATE POLICY "Users can update own posts"
ON posts FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
ON posts FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

#### 3. Tabela `comments`

```sql
-- Comentários são visíveis para usuários autenticados
CREATE POLICY "Comments are viewable by authenticated users"
ON comments FOR SELECT
TO authenticated
USING (true);

-- Usuários podem criar comentários
CREATE POLICY "Users can create comments"
ON comments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Usuários podem deletar seus próprios comentários
CREATE POLICY "Users can delete own comments"
ON comments FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

#### 4. Tabela `private_messages`

```sql
-- Mensagens privadas só visíveis para remetente/destinatário
CREATE POLICY "Users can view their own messages"
ON private_messages FOR SELECT
TO authenticated
USING (
  auth.uid() = sender_id
  OR auth.uid() = recipient_id
);

-- Usuários podem enviar mensagens
CREATE POLICY "Users can send messages"
ON private_messages FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = sender_id);
```

### Como Verificar RLS

```sql
-- No Supabase SQL Editor, verifique se RLS está ativo
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- rowsecurity deve ser 't' (true) para todas as tabelas
```

### Como Testar RLS

1. **Via Supabase Dashboard:**
   - SQL Editor → Run query como usuário específico
   - Use `set local role authenticated; set local request.jwt.claims.sub to 'user-uuid';`

2. **Via aplicação:**
   - Crie duas contas de teste
   - Tente acessar dados da outra conta
   - Deve retornar vazio ou erro de permissão

---

## Práticas de Código Seguro

### 1. Validação de Inputs

**SEMPRE valide inputs do usuário:**

```typescript
import { z } from 'zod';

// Defina schema de validação
const PostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(10000),
  tags: z.array(z.string()).max(10),
});

// Valide antes de enviar ao servidor
try {
  const validatedData = PostSchema.parse(userInput);
  await createPost(validatedData);
} catch (error) {
  // Handle validation error
}
```

### 2. Sanitização de Dados

**NUNCA use `dangerouslySetInnerHTML`** sem sanitização:

```typescript
// ❌ ERRADO - XSS vulnerability
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ CORRETO - Use biblioteca de sanitização
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(userContent)
}} />
```

### 3. Tratamento de Erros

**SEMPRE trate erros sem expor informações sensíveis:**

```typescript
try {
  const { data, error } = await supabase.from('posts').insert(newPost);

  if (error) throw error;

  return data;
} catch (error) {
  // ❌ ERRADO - expõe detalhes internos
  // alert(error.message);

  // ✅ CORRETO - mensagem genérica ao usuário
  console.error('Error creating post:', error);
  reportError(error); // Envia para Sentry
  throw new Error('Não foi possível criar o post. Tente novamente.');
}
```

### 4. Autenticação e Autorização

```typescript
// Sempre verifique se usuário está autenticado
const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  navigate('/login');
  return;
}

// Verifique permissões antes de operações sensíveis
if (post.user_id !== user.id && user.role !== 'admin') {
  throw new Error('Você não tem permissão para editar este post');
}
```

---

## Monitoramento e Resposta a Incidentes

### Sentry - Monitoramento de Erros

Configurado em `src/lib/sentry.ts`:

```typescript
import { initSentry, reportError } from './lib/sentry';

// Inicializar no main.tsx
initSentry();

// Reportar erros manualmente
try {
  // código
} catch (error) {
  reportError(error, {
    feature: 'posts',
    action: 'create',
  });
}
```

### Logs e Auditoria

```typescript
// Use níveis apropriados de log
console.error('Critical error:', error); // Produção
console.warn('Warning:', warning); // Produção
console.log('Info:', info); // Apenas desenvolvimento
console.debug('Debug:', debug); // Apenas desenvolvimento
```

### Resposta a Incidentes

Se uma chave de API for exposta:

1. **IMEDIATAMENTE rotacione a chave:**
   - Supabase: Settings → API → Generate new key
   - Revogue a chave antiga

2. **Atualize em todos os ambientes:**
   - Produção (Netlify)
   - Staging
   - Time de desenvolvimento

3. **Investigue o escopo:**
   - Verifique logs do Supabase
   - Identifique acessos não autorizados
   - Notifique usuários se necessário

4. **Previna recorrência:**
   - Adicione regra ao `.gitignore`
   - Configure pre-commit hooks
   - Treine equipe

---

## Checklist de Segurança

### 🔐 Antes de Cada Deploy

- [ ] `.env` não está commitado
- [ ] RLS está ativa em todas as tabelas do Supabase
- [ ] Variáveis de ambiente estão configuradas no Netlify
- [ ] Todos os inputs de usuário são validados
- [ ] Testes de segurança passaram no CI/CD
- [ ] Sem `console.log` de dados sensíveis
- [ ] Sem hard-coded secrets no código

### 📊 Mensalmente

- [ ] Revisar logs do Supabase para acessos suspeitos
- [ ] Verificar alertas do Sentry
- [ ] Executar `npm audit` e corrigir vulnerabilidades
- [ ] Atualizar dependências com patches de segurança
- [ ] Revisar permissões de usuários no Supabase

### 🚨 Anualmente

- [ ] Rotação de todas as chaves de API
- [ ] Auditoria completa de segurança
- [ ] Treinamento de segurança para equipe
- [ ] Revisão de políticas RLS

---

## 🆘 Contato em Caso de Incidente

Se você descobrir uma vulnerabilidade de segurança:

1. **NÃO** crie uma issue pública no GitHub
2. Envie email para: security@clubnath.app
3. Descreva a vulnerabilidade em detalhes
4. Aguarde resposta em até 48 horas

---

## 📚 Recursos Adicionais

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Mobile Top 10](https://owasp.org/www-project-mobile-top-10/)
- [React Security Best Practices](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)

---

**Última Atualização:** 27 de Outubro de 2025  
**Versão:** 1.0.0
