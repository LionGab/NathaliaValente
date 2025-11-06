# 🚀 Deploy Netlify - Instruções

## Status Atual
- ✅ Todas as mudanças estão commitadas na branch `main`
- ✅ Push realizado para `origin/main`
- ⚠️ Netlify pode precisar de rebuild manual

## Para atualizar o site no Netlify:

### Opção 1: Rebuild Manual (Recomendado)
1. Acesse o dashboard do Netlify: https://app.netlify.com
2. Vá para o site: `nathaliavalentegit`
3. Clique em "Deploys"
4. Clique em "Trigger deploy" > "Deploy site"

### Opção 2: Forçar novo commit
Execute no terminal:
```bash
git commit --allow-empty -m "chore: trigger Netlify rebuild"
git push origin main
```

### Opção 3: Verificar logs do build
1. No dashboard do Netlify
2. Vá para "Deploys" > último deploy
3. Verifique os logs de build para erros

## Mudanças que precisam ser deployadas:

### Performance
- ✅ Lazy loading de páginas
- ✅ Code splitting otimizado
- ✅ Remoção de Framer Motion
- ✅ Resource hints

### Tailwind CSS 4 + Shadcn
- ✅ Tailwind CSS 4.0.0-beta.15
- ✅ Shadcn UI configurado
- ✅ Componentes Button e Card
- ✅ CSS Variables com tema azul

### Design System
- ✅ Tema azul aplicado
- ✅ Componentes otimizados mobile-first

## Possíveis problemas no build:

1. **Tailwind CSS 4 Beta**: Pode precisar de ajustes no Netlify
   - Verificar se Node 20+ está configurado ✅ (já está no netlify.toml)

2. **Dependências Radix UI**: Podem precisar de rebuild
   - Execute: `npm install` antes do build

3. **PostCSS**: Verificar se está configurado corretamente
   - Arquivo `postcss.config.js` existe ✅

## Comando para testar build localmente:
```bash
npm install
npm run build
```

Se o build local funcionar, o problema pode ser cache do Netlify.
