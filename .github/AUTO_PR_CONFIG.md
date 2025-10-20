# 🤖 Configuração de PRs Automáticos

Este documento descreve como o sistema de PRs automáticos foi configurado para este repositório.

## 📋 Workflows Configurados

### 1. 🔄 Auto Pull Request (`auto-pr.yml`)

**Quando executa:**
- Push para branches `feature/*`, `bugfix/*`, `hotfix/*`, `develop`, `dev`
- NÃO executa para `main` ou `master`

**O que faz:**
- Cria PR automaticamente quando código é enviado para branches de desenvolvimento
- Determina branch base automaticamente:
  - `hotfix/*` → `main`
  - `feature/*`, `bugfix/*` → `develop`
  - `develop`, `dev` → `main`
- Adiciona labels apropriadas baseadas no tipo de branch
- Gera descrição com arquivos alterados e checklist

### 2. 📦 Auto Dependency Update PR (`auto-dependency-pr.yml`)

**Quando executa:**
- Toda segunda-feira às 9:00 UTC (agendado)
- Execução manual disponível

**O que faz:**
- Verifica atualizações de dependências disponíveis
- Atualiza apenas versões minor/patch (seguro)
- Executa testes básicos (typecheck, lint)
- Cria PR com resumo das atualizações

### 3. 🐛 Auto Fix PR (`auto-fix-pr.yml`)

**Quando executa:**
- Issues são abertas ou recebem labels `auto-fix`, `good first issue`, `enhancement`
- Execução manual com número de issue

**O que faz:**
- Cria branch e PR automático para resolver issues
- Detecta tipo de problema (TypeScript, documentação, styling)
- Atribui PR ao autor da issue
- Cria arquivo de rastreamento do progresso

### 4. 🚀 Auto Release PR (`auto-release-pr.yml`)

**Quando executa:**
- Toda sexta-feira às 16:00 UTC (agendado)
- Execução manual com tipo de release

**O que faz:**
- Analisa commits para determinar tipo de release (patch/minor/major)
- Gera changelog automático baseado em commits convencionais
- Atualiza version no package.json
- Cria PR de release com todas as mudanças

## 🏷️ Sistema de Labels

O sistema usa labels para categorizar PRs automáticos:

- `auto-generated` - PRs criados automaticamente
- `feature` - Novas funcionalidades
- `bugfix` - Correções de bugs
- `hotfix` - Correções urgentes
- `dependencies` - Atualizações de dependências
- `release` - PRs de release
- `documentation` - Mudanças na documentação

## 🔧 Configuração Necessária

### Tokens e Permissões

Os workflows usam `GITHUB_TOKEN` que já está disponível automaticamente. Para funcionalidades avançadas, você pode precisar de:

```yaml
permissions:
  contents: write      # Para criar branches e commits
  pull-requests: write # Para criar e gerenciar PRs
  issues: write        # Para comentar em issues
```

### Secrets Opcionais

Para funcionalidades do Claude Code:
- `CLAUDE_CODE_OAUTH_TOKEN` - Para review automático de código

## 📝 Convenções de Commit

Para melhor funcionamento dos automações, use commits convencionais:

```
feat: adiciona nova funcionalidade
fix: corrige bug específico
docs: atualiza documentação
style: mudanças de formatação
refactor: refatoração de código
test: adiciona ou modifica testes
chore: tarefas de manutenção
```

Para releases automáticos, use:
```
feat: nova funcionalidade (minor release)
fix: correção de bug (patch release)
feat!: breaking change (major release)
BREAKING CHANGE: detalhe no corpo do commit (major release)
```

## 🚀 Como Usar

### Para Features

1. Crie branch com prefixo `feature/nome-da-feature`
2. Faça commits e push
3. PR será criado automaticamente apontando para `develop`

### Para Bug Fixes

1. Crie branch com prefixo `bugfix/nome-do-fix`
2. Faça commits e push
3. PR será criado automaticamente apontando para `develop`

### Para Hotfixes

1. Crie branch com prefixo `hotfix/nome-do-hotfix`
2. Faça commits e push
3. PR será criado automaticamente apontando para `main`

### Para Issues

1. Adicione label `auto-fix` na issue
2. PR será criado automaticamente em modo draft
3. Desenvolva a solução na branch criada
4. Marque PR como ready for review

### Para Releases

1. O sistema executa automaticamente toda sexta-feira
2. Ou execute manualmente em Actions → Auto Release PR
3. Escolha tipo de release (patch/minor/major)
4. PR será criado com changelog automático

## 🔍 Monitoramento

### Verificar Status

```bash
# Ver PRs automáticos
gh pr list --label "auto-generated"

# Ver últimas execuções
gh run list --workflow="auto-pr.yml"
```

### Logs e Debug

- Acesse Actions no GitHub para ver logs detalhados
- Cada workflow tem steps explicativos
- Erros são reportados com contexto

## ⚙️ Personalização

### Modificar Branches Base

Edite `.github/workflows/auto-pr.yml`:

```yaml
# Linha ~30-40, modifique lógica:
if [[ $BRANCH_NAME == feature/* ]]; then
  BASE_BRANCH="sua-branch-base"
fi
```

### Modificar Schedule

Edite os arquivos de workflow:

```yaml
schedule:
  - cron: '0 9 * * 1'  # Segunda às 9h UTC
```

### Adicionar Labels Customizadas

Edite as seções de labels nos workflows:

```yaml
--label "custom-label,auto-generated"
```

## 🛡️ Segurança

- Workflows só executam em branches específicas
- PRs de dependências só fazem updates seguros (minor/patch)
- Todos os PRs são criados como draft ou precisam de review
- Logs são públicos - não incluem informações sensíveis

## 📞 Suporte

Se encontrar problemas:

1. Verifique logs em Actions
2. Confirme permissões dos tokens
3. Verifique se branches seguem naming conventions
4. Abra issue com detalhes do problema

---

*Sistema configurado para maximizar produtividade com segurança! 🚀*