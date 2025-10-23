# 📱 GUIA DE TESTE MOBILE - CLUBNATH VIP

## 🎯 OBJETIVO
Validar todas as funcionalidades do app em dispositivos iOS e Android antes do lançamento oficial.

---

## 📋 CHECKLIST DE TESTES

### ✅ PWA - Instalação

#### iOS Safari
1. [ ] Abrir URL no Safari
2. [ ] Clicar no ícone de compartilhar (quadrado com seta para cima)
3. [ ] Selecionar "Adicionar à Tela de Início"
4. [ ] Verificar ícone personalizado instalado
5. [ ] Abrir app da tela inicial (deve abrir fullscreen sem barra de endereço)

#### Android Chrome
1. [ ] Abrir URL no Chrome
2. [ ] Aguardar banner "Adicionar à tela inicial" aparecer
3. [ ] OU: Menu (3 pontos) → "Instalar aplicativo"
4. [ ] Verificar ícone instalado
5. [ ] Abrir app da tela inicial (modo standalone)

### ✅ Autenticação
1. [ ] Tela de login Instagram aparece
2. [ ] Login funciona (ou mock data ativa)
3. [ ] Redirecionamento para onboarding

### ✅ Onboarding
1. [ ] **Etapa 1**: Seleção de avatar (12 opções)
2. [ ] **Etapa 2**: Nickname personalizado
3. [ ] **Etapa 3**: Seleção de metas/interesses
4. [ ] **Etapa 4**: Confirmação e boas-vindas
5. [ ] Transição suave para app principal

### ✅ Navegação Principal
1. [ ] **Feed**: Timeline de posts carrega
2. [ ] **Chat**: Chat com IA Nathália abre
3. [ ] **Busca**: Página de busca funciona
4. [ ] **Daily**: Frase/versículo do dia exibido
5. [ ] **Perfil**: Perfil do usuário carrega
6. [ ] Navegação bottom bar funciona sem lag

### ✅ Feed de Posts
1. [ ] Posts carregam com imagens
2. [ ] Likes funcionam (animação coração)
3. [ ] Comentários abrem
4. [ ] Badge "Nathy Aprovou" aparece em posts especiais
5. [ ] Scroll infinito carrega mais posts
6. [ ] Pull-to-refresh funciona

### ✅ Chat IA
1. [ ] Interface de chat carrega
2. [ ] Mensagens enviadas aparecem instantaneamente
3. [ ] Resposta da IA chega (pode haver delay por API)
4. [ ] Histórico de mensagens persiste
5. [ ] Scroll funciona suavemente

### ✅ Grupos
1. [ ] Lista de grupos carrega
2. [ ] Filtros por categoria funcionam
3. [ ] Criar novo grupo abre modal
4. [ ] Entrar em grupo funciona
5. [ ] Dentro do grupo: posts, membros, chat

### ✅ Perfil
1. [ ] Avatar personalizado aparece
2. [ ] Informações do usuário carregam
3. [ ] Editar perfil funciona
4. [ ] Posts próprios listados
5. [ ] Badges conquistados exibidos
6. [ ] Configurações acessíveis

### ✅ Funcionalidades Premium
1. [ ] **Diário**: Criar entrada funciona
2. [ ] **Estudos Bíblicos**: Conteúdo carrega
3. [ ] **Pedidos de Oração**: Criar/visualizar funciona
4. [ ] **SOS Emocional**: Recursos de apoio acessíveis
5. [ ] **Busca Avançada**: Filtros funcionam

### ✅ Dark Mode
1. [ ] Toggle tema claro/escuro funciona
2. [ ] Cores ajustam corretamente
3. [ ] Imagens/ícones visíveis em ambos temas
4. [ ] Preferência persiste após reload

### ✅ Performance
1. [ ] App carrega em < 3 segundos (primeira vez)
2. [ ] App carrega em < 1 segundo (retorno)
3. [ ] Transições de página suaves
4. [ ] Sem lags visíveis ao scrollar
5. [ ] Imagens carregam progressivamente

### ✅ Offline (PWA)
1. [ ] Desconectar internet
2. [ ] App ainda abre (Service Worker)
3. [ ] Conteúdo cacheado visível
4. [ ] Mensagem de "offline" aparece ao tentar ação que precisa internet
5. [ ] Reconectar internet restaura funcionalidades

### ✅ Notificações (Android principalmente)
1. [ ] Permitir notificações quando solicitado
2. [ ] Receber notificação de teste
3. [ ] Clicar na notificação abre app na página correta

### ✅ Responsividade
Testar em diferentes orientações e tamanhos:
1. [ ] **Portrait** (vertical) - layout correto
2. [ ] **Landscape** (horizontal) - layout se adapta
3. [ ] **iPhone SE** (320px) - tudo visível
4. [ ] **iPhone 14 Pro** (393px) - aproveita espaço
5. [ ] **Tablet** (768px+) - usa colunas

---

## 🐛 COMO REPORTAR BUGS

Se encontrar problemas, anotar:

**Formato de Bug Report:**
```
Dispositivo: iPhone 14 Pro / Moto G9
SO: iOS 17.5 / Android 13
Browser: Safari / Chrome
URL: https://clubnath.netlify.app

Problema: Descrição detalhada
Passos para Reproduzir:
1. ...
2. ...
3. ...

Comportamento Esperado: ...
Comportamento Atual: ...
Screenshot: (se possível)
```

---

## 📊 MÉTRICAS A COLETAR

Durante os testes, anotar:

1. **Tempo de carregamento inicial**: ___ segundos
2. **Tempo de instalação PWA**: ___ segundos
3. **Uso de dados** (Settings → Cellular/Mobile Data): ___ MB
4. **Bateria consumida** em 15 min de uso: ___ %
5. **Espaço em disco** (Storage ocupado): ___ MB

---

## ✅ APROVAÇÃO FINAL

O app está pronto para lançamento quando:

- [x] Build de produção funcional
- [ ] PWA instala em iOS e Android
- [ ] Todas funcionalidades core testadas
- [ ] Zero bugs críticos (crashs, tela branca)
- [ ] Performance aceitável (< 3s load inicial)
- [ ] Offline mode funcional
- [ ] Dark mode funcional
- [ ] Responsivo em 3+ dispositivos

---

## 🚀 PÓS-LANÇAMENTO

### Semana 1
- Monitorar analytics de uso
- Coletar feedback inicial usuários
- Identificar funcionalidades mais usadas
- Corrigir bugs reportados

### Semana 2-4
- Otimizações baseadas em dados reais
- Novas funcionalidades com base em demanda
- Marketing e growth

---

**Boa sorte nos testes! 🎉**
**Qualquer dúvida, consulte DEPLOY.md ou RELATORIO-FINAL.md**
