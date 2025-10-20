# Como Adicionar o Ícone do App

## 📋 Passo a Passo Rápido

### 1. Salvar a Imagem

A imagem que você enviou (da mãe com bebê) precisa ser salva como:

```
C:\Users\User\BoltValente\boltnathH\source-icon.png
```

**Como fazer:**
1. Clique com botão direito na imagem
2. Selecione "Salvar imagem como..."
3. Navegue até: `C:\Users\User\BoltValente\boltnathH\`
4. Nomeie como: `source-icon.png`
5. Salve

### 2. Gerar os Ícones

Depois de salvar a imagem, rode este comando no terminal:

```bash
node generate-icons.js
```

Isso vai criar automaticamente todos os 12 tamanhos de ícone necessários:
- ✅ icon-16x16.png
- ✅ icon-32x32.png
- ✅ icon-72x72.png
- ✅ icon-96x96.png
- ✅ icon-120x120.png
- ✅ icon-128x128.png
- ✅ icon-144x144.png
- ✅ icon-152x152.png
- ✅ icon-180x180.png
- ✅ icon-192x192.png
- ✅ icon-384x384.png
- ✅ icon-512x512.png

### 3. Verificar

Os ícones serão salvos em:
```
C:\Users\User\BoltValente\boltnathH\public\icons\
```

### 4. Testar

```bash
npm run dev
```

Abra o app no navegador e veja se o ícone aparece na aba!

---

## 🎨 O que foi configurado

Já está tudo pronto no código:
- ✅ `manifest.json` - Configuração PWA
- ✅ `index.html` - Referências aos ícones
- ✅ `generate-icons.js` - Script de geração
- ✅ `public/icons/` - Pasta criada

**Você só precisa:**
1. Salvar a imagem como `source-icon.png`
2. Rodar `node generate-icons.js`

Pronto! 🎉
