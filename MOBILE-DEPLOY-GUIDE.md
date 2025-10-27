# 📱 Guia Completo de Deploy Mobile - ClubNath VIP

**Versão:** 1.0
**Data:** 27 de Outubro de 2025
**Plataformas:** Android (APK/AAB) e iOS (App Store)

---

## 📋 Pré-requisitos

### Para Android

- **Node.js** >= 20.19.0
- **Java Development Kit (JDK)** 17 ou superior
- **Android Studio** (última versão) com Android SDK
- **Gradle** (incluído no Android Studio)

### Para iOS (apenas em macOS)

- **Xcode** 15 ou superior
- **CocoaPods** instalado (`sudo gem install cocoapods`)
- **Conta Apple Developer** ($99/ano)

---

## 🚀 Setup Inicial (Uma Vez)

### 1. Instalar Dependências

```bash
# Já instalado no projeto
npm install
```

### 2. Build da Aplicação Web

```bash
npm run build
```

### 3. Adicionar Plataformas

#### Android

```bash
npm run mobile:add:android
```

Isso cria a pasta `android/` com o projeto Android Studio.

#### iOS (apenas macOS)

```bash
npm run mobile:add:ios
```

Isso cria a pasta `ios/` com o projeto Xcode.

---

## 🔧 Configuração do Android

### 1. Abrir no Android Studio

```bash
npm run mobile:open:android
```

### 2. Configurar Signing (Para Release)

1. No Android Studio: `Build → Generate Signed Bundle/APK`
2. Criar nova keystore ou usar existente:

```bash
keytool -genkey -v -keystore clubnath-release.keystore \
  -alias clubnath-key -keyalg RSA -keysize 2048 -validity 10000
```

3. Adicionar no `android/app/build.gradle`:

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file("../../clubnath-release.keystore")
            storePassword "SUA_SENHA_AQUI"
            keyAlias "clubnath-key"
            keyPassword "SUA_SENHA_AQUI"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 3. Configurar ícones e splash screen

Os ícones já estão em `public/icons/`, mas precisam ser copiados:

```bash
# Copiar ícones para Android
cp public/icons/icon-192x192.png android/app/src/main/res/mipmap-mdpi/ic_launcher.png
cp public/icons/icon-512x512.png android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
```

### 4. Build Release APK

```bash
cd android
./gradlew assembleRelease
```

APK estará em: `android/app/build/outputs/apk/release/app-release.apk`

### 5. Build Release AAB (Para Google Play)

```bash
cd android
./gradlew bundleRelease
```

AAB estará em: `android/app/build/outputs/bundle/release/app-release.aab`

---

## 🍎 Configuração do iOS

### 1. Abrir no Xcode

```bash
npm run mobile:open:ios
```

### 2. Configurar Signing & Capabilities

1. No Xcode, selecione o projeto "App"
2. Na aba "Signing & Capabilities":
   - Marque "Automatically manage signing"
   - Selecione seu Team (Apple Developer Account)
   - Bundle Identifier: `com.clubnath.vip`

### 3. Configurar ícones

1. No Xcode: `App → Assets.xcassets → AppIcon`
2. Arrastar ícones de diferentes tamanhos (20pt a 1024pt)

Pode usar o site https://appicon.co/ para gerar todos os tamanhos.

### 4. Build Release

1. No Xcode: `Product → Archive`
2. Aguardar build completar
3. Clicar em "Distribute App"
4. Escolher "App Store Connect" ou "Ad Hoc" para testes

---

## 🔄 Workflow de Atualização

### Quando fizer mudanças no código:

```bash
# 1. Build da aplicação web
npm run build:mobile

# 2. Copiar para plataformas nativas
npm run mobile:sync

# 3. Abrir no Android Studio ou Xcode e testar
npm run mobile:open:android  # ou mobile:open:ios
```

### Apenas mudanças de configuração nativa:

Se apenas mudou algo no Android Studio ou Xcode (cores, permissões, etc.), não precisa rebuildar o web app.

---

## 📝 Publicação nas Lojas

### Google Play Store

1. **Criar conta no Google Play Console** ($25 taxa única)
   - https://play.google.com/console/

2. **Criar novo aplicativo**
   - Nome: ClubNath VIP
   - Categoria: Estilo de Vida
   - Tipo: Aplicativo

3. **Preencher detalhes da loja**
   - Descrição curta (80 chars)
   - Descrição completa (4000 chars)
   - Screenshots (mínimo 2, máximo 8)
   - Ícone de alta resolução (512x512)
   - Imagem de destaque (1024x500)

4. **Upload do AAB**
   - Ir em "Produção → Criar nova versão"
   - Upload do `app-release.aab`
   - Definir versão (ex: 1.0.0)
   - Notas da versão

5. **Preencher questionário de conteúdo**
   - Classificação etária
   - Política de privacidade URL
   - Informações de contato

6. **Enviar para revisão**
   - Pode levar 1-7 dias

### Apple App Store

1. **Criar conta Apple Developer** ($99/ano)
   - https://developer.apple.com/

2. **Criar App no App Store Connect**
   - https://appstoreconnect.apple.com/
   - Nome: ClubNath VIP
   - Bundle ID: com.clubnath.vip
   - SKU: clubnath-vip

3. **Preencher informações**
   - Screenshots para todos os tamanhos de iPhone
   - Descrição (4000 chars)
   - Palavras-chave (100 chars)
   - URL de suporte
   - URL de marketing

4. **Upload do build**
   - No Xcode: `Product → Archive → Distribute App → App Store Connect`
   - Aguardar processar (~15min)

5. **Enviar para revisão**
   - Selecionar o build no App Store Connect
   - Preencher informações de contato de revisão
   - Submeter
   - Pode levar 1-3 dias

---

## 🐛 Troubleshooting

### Android

**Erro: "SDK not found"**

```bash
# Definir ANDROID_HOME no .bashrc ou .zshrc
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

**Erro: "Gradle build failed"**

```bash
# Limpar cache do Gradle
cd android
./gradlew clean
```

**APK não instala no device**

```bash
# Habilitar "Instalar apps de fontes desconhecidas" no Android
# Configurações → Segurança → Fontes desconhecidas
```

### iOS

**Erro: "Signing certificate not found"**

- Abrir Xcode
- Preferences → Accounts → Manage Certificates
- Adicionar certificado de desenvolvimento

**Erro: "CocoaPods not installed"**

```bash
sudo gem install cocoapods
cd ios
pod install
```

**Build muito lento**

```bash
# Limpar derived data
rm -rf ~/Library/Developer/Xcode/DerivedData
```

---

## 📊 Checklist de Publicação

### Antes de enviar:

- [ ] Testado em device Android real
- [ ] Testado em device iOS real (iPhone)
- [ ] Todas as features funcionando
- [ ] Login/Logout funcionando
- [ ] Push notifications configuradas
- [ ] Deep links configurados
- [ ] Ícones corretos em todos os tamanhos
- [ ] Splash screen configurada
- [ ] Sem console.log em produção
- [ ] Variáveis de ambiente configuradas
- [ ] Política de privacidade publicada
- [ ] Termos de uso publicados
- [ ] Screenshots tirados de devices reais
- [ ] Descrição da loja escrita
- [ ] Vídeo de preview criado (opcional mas recomendado)

### Informações necessárias:

- [ ] Email de contato para suporte
- [ ] URL de suporte (pode ser email)
- [ ] URL de marketing (clubnath.netlify.app)
- [ ] URL de política de privacidade
- [ ] Classificação etária (+12)
- [ ] Categoria principal: Estilo de Vida
- [ ] Categoria secundária: Redes Sociais

---

## 🎯 Próximos Passos

Após publicação inicial:

1. **Monitoramento**
   - Instalar Firebase Analytics
   - Configurar Crashlytics
   - Monitorar reviews das lojas

2. **Marketing**
   - Criar página de download (landing page)
   - Compartilhar link nas redes sociais
   - Criar posts de lançamento

3. **Iteração**
   - Coletar feedback
   - Corrigir bugs críticos
   - Adicionar features mais pedidas

---

## 📞 Suporte

**Documentação Oficial:**

- Capacitor: https://capacitorjs.com/docs
- Android: https://developer.android.com/
- iOS: https://developer.apple.com/ios/

**Comunidades:**

- Capacitor Discord: https://discord.gg/UPYYRhtyzp
- Stack Overflow: Tag `capacitor`

---

**✨ Boa sorte com o lançamento! 🚀**
