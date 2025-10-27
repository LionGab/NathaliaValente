# 🔒 Checklist de Segurança - ClubNath VIP

## Baseado em: OWASP Mobile Security, NIST, e Best Practices 2025

---

## 📋 ÍNDICE

1. [Segurança de Dados](#1-segurança-de-dados)
2. [Autenticação e Autorização](#2-autenticação-e-autorização)
3. [Comunicação de Rede](#3-comunicação-de-rede)
4. [Criptografia](#4-criptografia)
5. [Proteção de Código](#5-proteção-de-código)
6. [Privacidade](#6-privacidade)
7. [Segurança de API](#7-segurança-de-api)
8. [Storage Security](#8-storage-security)
9. [Third-Party Dependencies](#9-third-party-dependencies)
10. [Compliance e Regulamentação](#10-compliance-e-regulamentação)

---

## 1. Segurança de Dados

### 1.1 Dados em Repouso
- [x] Variáveis de ambiente não commitadas (`.env` no `.gitignore`)
- [ ] Dados sensíveis criptografados no localStorage
- [x] Tokens armazenados de forma segura (Supabase auth)
- [ ] Implementar secure storage para tokens de sessão
- [ ] Limpar dados sensíveis ao logout
- [ ] Implementar data expiration no storage

**Prioridade**: 🔴 Alta

**Ação Imediata**:
```typescript
// src/lib/secureStorage.ts
import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_STORAGE_KEY;

export const secureStorage = {
  set: (key: string, value: any) => {
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(value),
      SECRET_KEY
    ).toString();
    localStorage.setItem(key, encrypted);
  },
  
  get: (key: string) => {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    
    const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  },
  
  remove: (key: string) => {
    localStorage.removeItem(key);
  },
  
  clear: () => {
    localStorage.clear();
  }
};
```

### 1.2 Dados em Trânsito
- [x] HTTPS obrigatório (Netlify)
- [x] Certificate pinning via Supabase
- [x] Validação de certificados SSL
- [ ] Implementar request signing
- [ ] Timeout configurado para requests

**Prioridade**: 🟢 Média

### 1.3 Validação de Dados
- [x] Validação de input implementada (`src/utils/validation.ts`)
- [ ] Validação em TODOS os formulários
- [ ] Sanitização de HTML/XSS protection
- [ ] Validação de tipos de arquivo upload
- [ ] Tamanho máximo de upload configurado

**Prioridade**: 🔴 Alta

**Ação Imediata**:
```typescript
// src/utils/sanitize.ts
import DOMPurify from 'dompurify';

export const sanitize = {
  html: (dirty: string): string => {
    return DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
      ALLOWED_ATTR: ['href', 'target']
    });
  },
  
  url: (url: string): boolean => {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  },
  
  filename: (filename: string): string => {
    return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  }
};
```

---

## 2. Autenticação e Autorização

### 2.1 Autenticação
- [x] Autenticação via Supabase implementada
- [x] Session management (persistSession: true)
- [x] Auto-refresh de tokens
- [ ] Multi-factor authentication (MFA)
- [ ] Biometric authentication (Face ID/Touch ID)
- [ ] Password strength validation
- [ ] Account lockout após tentativas falhas
- [ ] Rate limiting em login endpoints

**Prioridade**: 🔴 Alta

**Status Atual**: Parcialmente implementado

**Melhorias Necessárias**:
```typescript
// src/features/auth/hooks/useAuth.ts
export const useAuth = () => {
  // Adicionar:
  const [failedAttempts, setFailedAttempts] = useState(0);
  const MAX_ATTEMPTS = 5;
  
  const login = async (email: string, password: string) => {
    if (failedAttempts >= MAX_ATTEMPTS) {
      throw new Error('Account locked. Try again in 15 minutes.');
    }
    
    try {
      // ... login logic
      setFailedAttempts(0);
    } catch (error) {
      setFailedAttempts(prev => prev + 1);
      throw error;
    }
  };
};
```

### 2.2 Autorização
- [ ] Role-Based Access Control (RBAC) implementado
- [x] Row Level Security (RLS) no Supabase
- [ ] Permissões granulares
- [ ] Validação de permissões no frontend
- [ ] Validação de permissões no backend (Supabase policies)

**Prioridade**: 🟡 Média

**Ação Requerida**: Auditar políticas RLS no Supabase

### 2.3 Session Management
- [x] Session timeout configurado
- [x] Token refresh automático
- [ ] Invalidação de sessões antigas
- [ ] Detecção de sessões concorrentes
- [ ] Logout em todos os dispositivos

**Prioridade**: 🟡 Média

---

## 3. Comunicação de Rede

### 3.1 HTTPS/TLS
- [x] HTTPS enforced (Netlify)
- [x] TLS 1.2+ (Supabase/Netlify)
- [x] Certificado SSL válido
- [ ] Certificate pinning
- [ ] HSTS (HTTP Strict Transport Security)

**Prioridade**: 🟡 Média

**Ação Imediata**:
```toml
# netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
```

### 3.2 API Security
- [ ] API rate limiting
- [ ] Request/Response encryption
- [ ] API key rotation policy
- [ ] CORS configurado corretamente
- [ ] API versioning

**Prioridade**: 🔴 Alta

**Status**: ❌ Não implementado

**Ação Imediata**: Implementar rate limiting no Supabase Edge Functions

### 3.3 Network Resilience
- [x] Timeout configurado
- [x] Retry logic (React Query)
- [x] Offline mode (PWA Service Worker)
- [ ] Circuit breaker pattern
- [ ] Request queueing offline

**Prioridade**: 🟢 Baixa

---

## 4. Criptografia

### 4.1 Dados Sensíveis
- [ ] Senhas nunca armazenadas (apenas hashes)
- [x] Tokens criptografados (Supabase)
- [ ] PII (Personal Identifiable Information) criptografado
- [ ] Chaves de criptografia rotacionadas

**Prioridade**: 🔴 Alta

### 4.2 Implementação
- [x] Biblioteca de criptografia confiável (Supabase)
- [ ] AES-256 para dados sensíveis
- [ ] SHA-256 para hashing
- [ ] Salt único por usuário

**Prioridade**: 🟡 Média

**Ação Recomendada**:
```typescript
// src/lib/crypto.ts
import { createHash, randomBytes } from 'crypto';

export const crypto = {
  hash: (data: string, salt?: string): string => {
    const actualSalt = salt || randomBytes(16).toString('hex');
    return createHash('sha256')
      .update(data + actualSalt)
      .digest('hex');
  },
  
  generateSalt: (): string => {
    return randomBytes(16).toString('hex');
  }
};
```

---

## 5. Proteção de Código

### 5.1 Code Obfuscation
- [x] Minificação (Terser)
- [x] Tree shaking
- [x] Dead code elimination
- [ ] Source maps removidos em produção
- [ ] Nomes de variáveis ofuscados

**Prioridade**: 🟢 Baixa

**Status**: Parcialmente implementado

**Melhoria**:
```javascript
// vite.config.ts
build: {
  sourcemap: false, // ✅ Já implementado
  minify: 'terser',
  terserOptions: {
    mangle: {
      properties: {
        regex: /^_private/
      }
    }
  }
}
```

### 5.2 Secret Management
- [x] Secrets não commitados
- [x] Variáveis de ambiente
- [ ] Secrets rotation policy
- [ ] Secrets em vault (Netlify Env Vars)
- [ ] Secret scanning no CI/CD

**Prioridade**: 🟡 Média

**Ação Imediata**: Configurar secret scanning no GitHub

```yaml
# .github/workflows/secret-scan.yml
name: Secret Scan

on: [push, pull_request]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Secret Scanning
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: ${{ github.event.repository.default_branch }}
          head: HEAD
```

### 5.3 Console Logs
- [x] Console.log removido em build (terser)
- [ ] Substituir console.log por logger estruturado
- [ ] Logging level configurável

**Prioridade**: 🔴 Alta

**Status**: ⚠️ 19 console.log presentes no código fonte

**Ação Imediata**: Implementar logger e remover console.log

```typescript
// src/lib/logger.ts
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

class Logger {
  private level: LogLevel;
  
  constructor() {
    this.level = import.meta.env.PROD ? LogLevel.WARN : LogLevel.DEBUG;
  }
  
  debug(...args: any[]) {
    if (this.level <= LogLevel.DEBUG) {
      console.debug('[DEBUG]', ...args);
    }
  }
  
  info(...args: any[]) {
    if (this.level <= LogLevel.INFO) {
      console.info('[INFO]', ...args);
    }
  }
  
  warn(...args: any[]) {
    if (this.level <= LogLevel.WARN) {
      console.warn('[WARN]', ...args);
    }
  }
  
  error(...args: any[]) {
    if (this.level <= LogLevel.ERROR) {
      console.error('[ERROR]', ...args);
    }
  }
}

export const logger = new Logger();
```

---

## 6. Privacidade

### 6.1 LGPD/GDPR Compliance
- [ ] Privacy policy implementada
- [ ] Terms of service
- [ ] Cookie consent
- [ ] Data retention policy
- [ ] Right to be forgotten
- [ ] Data export functionality
- [ ] Age verification (13+)

**Prioridade**: 🔴 Crítica (Legal requirement)

**Status**: ❌ Não verificado

**Ação Imediata**: 
1. Adicionar política de privacidade
2. Implementar cookie consent
3. Implementar funcionalidade de export/delete de dados

### 6.2 Analytics e Tracking
- [ ] Analytics opt-in/opt-out
- [ ] PII não enviado para analytics
- [ ] Tracking transparente
- [ ] Data anonymization

**Prioridade**: 🟡 Alta

### 6.3 Permissions
- [ ] Solicitar apenas permissões necessárias
- [ ] Explicar motivo das permissões
- [ ] Graceful degradation se permissão negada
- [ ] Runtime permission checks

**Prioridade**: 🟢 Média

---

## 7. Segurança de API

### 7.1 Supabase Configuration
- [x] Row Level Security (RLS) ativo
- [ ] Políticas RLS auditadas
- [ ] API rate limiting configurado
- [ ] IP whitelisting (se aplicável)
- [ ] Webhook signature verification

**Prioridade**: 🔴 Alta

**Ação Requerida**: Auditoria completa de políticas RLS

```sql
-- Exemplo de política RLS segura
CREATE POLICY "Users can only view their own data"
ON posts
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can only update their own data"
ON posts
FOR UPDATE
USING (auth.uid() = user_id);
```

### 7.2 Input Validation
- [x] Validação de tipos (TypeScript)
- [ ] Validação de ranges
- [ ] SQL injection prevention (Supabase)
- [ ] NoSQL injection prevention
- [ ] Command injection prevention

**Prioridade**: 🔴 Alta

### 7.3 Output Encoding
- [ ] XSS prevention
- [ ] HTML encoding
- [ ] JSON encoding
- [ ] URL encoding

**Prioridade**: 🔴 Alta

**Ação Imediata**: Implementar DOMPurify

```bash
npm install dompurify
npm install --save-dev @types/dompurify
```

---

## 8. Storage Security

### 8.1 LocalStorage/SessionStorage
- [ ] Dados sensíveis criptografados
- [ ] Dados expiram automaticamente
- [ ] Limpeza ao logout
- [ ] Validação de dados ao recuperar

**Prioridade**: 🔴 Alta

**Status**: ⚠️ 11 usos de localStorage encontrados

**Ação**: Auditar todos os usos e implementar secure storage

### 8.2 IndexedDB
- [ ] Schema validation
- [ ] Encryption at rest
- [ ] Access control
- [ ] Quota management

**Prioridade**: 🟢 Baixa (se usado)

### 8.3 Cookies
- [x] HttpOnly para tokens (Supabase)
- [x] Secure flag
- [x] SameSite attribute
- [ ] Domain e Path corretos

**Prioridade**: 🟡 Média

---

## 9. Third-Party Dependencies

### 9.1 Dependency Management
- [x] npm audit executado (0 vulnerabilities)
- [x] Lockfile commitado (package-lock.json)
- [ ] Dependabot configurado
- [ ] Automated dependency updates
- [ ] Security alerts habilitados

**Prioridade**: 🟡 Média

**Ação Imediata**: Configurar Dependabot

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    reviewers:
      - "LionGab"
    labels:
      - "dependencies"
```

### 9.2 License Compliance
- [ ] License audit
- [ ] GPL-incompatible licenses identificadas
- [ ] SBOM (Software Bill of Materials)

**Prioridade**: 🟢 Baixa

**Ação**: Gerar SBOM

```bash
npm install -g @cyclonedx/cdxgen
cdxgen -o sbom.json
```

### 9.3 Supply Chain Security
- [x] NPM registry oficial
- [ ] Package signature verification
- [ ] Subresource Integrity (SRI)
- [ ] CDN content verification

**Prioridade**: 🟡 Média

---

## 10. Compliance e Regulamentação

### 10.1 LGPD (Brasil)
- [ ] Base legal para tratamento de dados
- [ ] Consentimento explícito
- [ ] Finalidade específica
- [ ] Minimização de dados
- [ ] Transparência
- [ ] Segurança técnica
- [ ] Prevenção de danos
- [ ] Não discriminação

**Prioridade**: 🔴 Crítica

**Status**: ❌ Não verificado

### 10.2 Accessibility (WCAG 2.1)
- [x] Componentes acessíveis (AccessibilityProvider)
- [ ] ARIA labels
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Color contrast

**Prioridade**: 🟡 Alta

### 10.3 Security Standards
- [ ] OWASP Top 10 compliance
- [ ] NIST Cybersecurity Framework
- [ ] ISO 27001 alignment
- [ ] SOC 2 considerations

**Prioridade**: 🟢 Baixa (para MVP)

---

## 📊 RESUMO DE PRIORIDADES

### 🔴 CRÍTICO (Implementar Imediatamente)

1. **Criptografar dados sensíveis no localStorage**
   - Esforço: 1 dia
   - Impacto: Alto

2. **Remover/Substituir console.log**
   - Esforço: 2 horas
   - Impacto: Médio

3. **Implementar Content Security Policy**
   - Esforço: 2 horas
   - Impacto: Alto

4. **Auditar políticas RLS do Supabase**
   - Esforço: 1 dia
   - Impacto: Crítico

5. **Implementar rate limiting**
   - Esforço: 1 dia
   - Impacto: Alto

6. **Sanitização de HTML/XSS protection**
   - Esforço: 1 dia
   - Impacto: Alto

7. **Privacy Policy e LGPD compliance**
   - Esforço: 2 dias
   - Impacto: Crítico (Legal)

**Total Esforço**: ~6-7 dias

### 🟡 ALTO (Próximas 2 Semanas)

8. Configurar secret scanning
9. Implementar MFA
10. Configurar Dependabot
11. Implementar cookie consent
12. Adicionar HSTS headers
13. Request signing

**Total Esforço**: ~5 dias

### 🟢 MÉDIO (Próximo Mês)

14. Biometric authentication
15. License compliance audit
16. SBOM generation
17. Accessibility improvements

**Total Esforço**: ~3 dias

---

## 🛠️ SCRIPTS DE AUTOMAÇÃO

### Script 1: Security Check Completo

```bash
#!/bin/bash
# scripts/security-check.sh

echo "🔒 Executando verificação de segurança completa..."

# 1. Dependency audit
echo "📦 Auditando dependências..."
npm audit --audit-level=moderate

# 2. Secret scanning
echo "🔍 Verificando secrets..."
git secrets --scan

# 3. Verificar console.log
echo "🚨 Procurando console.log..."
CONSOLE_COUNT=$(grep -r "console.log" src --include="*.ts" --include="*.tsx" | wc -l)
if [ $CONSOLE_COUNT -gt 0 ]; then
  echo "⚠️  $CONSOLE_COUNT console.log encontrados"
  grep -r "console.log" src --include="*.ts" --include="*.tsx"
fi

# 4. Verificar variáveis de ambiente
echo "🔑 Verificando .env..."
if [ -f .env ]; then
  echo "⚠️  Arquivo .env encontrado! Verificar se está no .gitignore"
fi

# 5. Headers de segurança
echo "🛡️  Verificando headers de segurança..."
curl -sI https://clubnath.netlify.app | grep -E "(X-Frame-Options|X-XSS-Protection|Content-Security-Policy)"

echo "✅ Verificação concluída!"
```

### Script 2: Audit de localStorage

```bash
#!/bin/bash
# scripts/audit-storage.sh

echo "💾 Auditando uso de storage..."

# Procurar localStorage
echo "📍 LocalStorage usage:"
grep -r "localStorage" src --include="*.ts" --include="*.tsx" -n

# Procurar sessionStorage
echo "📍 SessionStorage usage:"
grep -r "sessionStorage" src --include="*.ts" --include="*.tsx" -n

# Procurar dados sensíveis
echo "🔍 Procurando dados sensíveis:"
grep -rE "(password|token|secret|key)" src --include="*.ts" --include="*.tsx" | grep -E "(localStorage|sessionStorage)"
```

### Script 3: CSP Generator

```typescript
// scripts/generate-csp.ts
const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "https://cdn.supabase.co"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", "data:", "https:", "blob:"],
  'font-src': ["'self'", "data:"],
  'connect-src': ["'self'", "https://*.supabase.co"],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
};

const csp = Object.entries(CSP_DIRECTIVES)
  .map(([key, values]) => `${key} ${values.join(' ')}`)
  .join('; ');

console.log('Add to netlify.toml:');
console.log(`Content-Security-Policy = "${csp}"`);
```

---

## 📚 RECURSOS E REFERÊNCIAS

### Documentação Oficial
- [OWASP Mobile Security Testing Guide](https://owasp.org/www-project-mobile-security-testing-guide/)
- [Supabase Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Web Security OWASP](https://owasp.org/www-project-web-security-testing-guide/)

### Ferramentas
- [Snyk](https://snyk.io/) - Vulnerability scanning
- [OWASP ZAP](https://www.zaproxy.org/) - Security testing
- [Mozilla Observatory](https://observatory.mozilla.org/) - Security score

### Compliance
- [LGPD - Lei Geral de Proteção de Dados](https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd)
- [GDPR Compliance](https://gdpr.eu/)

---

## ✅ VERIFICAÇÃO FINAL

```bash
# Executar todos os checks
npm run security:check
npm run audit:storage
npm run test:security
npm audit
```

**Meta**: 100% dos itens críticos implementados em 2 semanas

---

**Última atualização**: Outubro 2025  
**Próxima revisão**: Dezembro 2025
