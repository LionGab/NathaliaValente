# 🔧 Como Corrigir o Erro 403 - Autenticação Supabase

## ❌ Problema

Erro 403 ao tentar fazer login/cadastro:
```
identitytoolkit.googleapis.com: Failed to load resource: the server responded with a status of 403 ()
```

## ✅ Solução

### Passo 1: Configurar URLs Permitidas no Supabase

1. **Acesse a configuração de URLs:**
   👉 https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/auth/url-configuration

2. **Configure os seguintes campos:**

   **Site URL:**
   ```
   http://localhost:5174
   ```

   **Redirect URLs (adicione cada uma separadamente):**
   ```
   http://localhost:5174
   http://localhost:5174/**
   http://localhost:5173
   http://localhost:5173/**
   ```

3. **Clique em "Save"** no final da página

### Passo 2: Verificar Provedor de Email

1. **Acesse os provedores de autenticação:**
   👉 https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/auth/providers

2. **Verifique se "Email" está ENABLED:**
   - Se estiver desabilitado, clique em "Enable"
   - Configure:
     - ✅ **Enable Email provider**
     - ✅ **Confirm email** (pode desabilitar para desenvolvimento local)
     - ✅ **Secure email change** (recomendado)

3. **Clique em "Save"**

### Passo 3: Verificar SMTP (Opcional para Desenvolvimento)

Para desenvolvimento local, você pode **desabilitar a confirmação de email**:

1. Acesse: https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/auth/providers
2. Clique em **"Email"**
3. **Desabilite** "Confirm email"
4. Clique em "Save"

Isso permitirá criar contas sem precisar confirmar o email durante o desenvolvimento.

### Passo 4: Reiniciar o Servidor Local

Após fazer as configurações acima:

1. **Pare o servidor** (Ctrl+C no terminal)
2. **Inicie novamente:**
   ```bash
   npm run dev
   ```
3. **Acesse:** http://localhost:5174/

### Passo 5: Testar

1. **Tente criar uma nova conta:**
   - Email: `teste@example.com`
   - Senha: `Senha123!`
   - Nome: `Usuário Teste`

2. **Clique em "Cadastrar"**

3. **Se funcionou:** ✅ Você será redirecionado para o feed

4. **Se ainda der erro 403:**
   - Aguarde 1-2 minutos (as configurações do Supabase podem levar um tempo para propagar)
   - Limpe o cache do navegador (Ctrl+Shift+Delete)
   - Tente novamente

---

## 🔍 Verificações Adicionais

### Verificar se as variáveis de ambiente estão corretas:

```bash
# No terminal, execute:
cat .env
```

Deve mostrar:
```
VITE_SUPABASE_URL=https://bbcwitnbnosyfpfjtzkr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Verificar no Console do Navegador (F12):

Se ainda houver erros, pressione **F12** e vá para a aba **Console**. Procure por:
- ❌ Erros em vermelho
- ⚠️ Avisos em amarelo relacionados ao Supabase

Copie a mensagem de erro completa para diagnóstico.

---

## 🎯 Resumo

**Causa do erro:** O Supabase bloqueia requisições de URLs não autorizadas por segurança.

**Solução:** Adicionar `http://localhost:5174` nas URLs permitidas do projeto Supabase.

**Tempo estimado:** 2-3 minutos

---

## 📞 Ainda com Problemas?

Se o erro persistir após seguir todos os passos:

1. Verifique se salvou as configurações no Supabase
2. Aguarde 2-3 minutos para as mudanças propagarem
3. Limpe o cache do navegador
4. Reinicie o servidor de desenvolvimento
5. Tente em uma aba anônima/privada do navegador

---

**Última atualização:** 20/10/2025
