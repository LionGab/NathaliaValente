import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Icon sizes needed for the app
const sizes = [16, 32, 72, 96, 120, 128, 144, 152, 180, 192, 384, 512];

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Input image (the one provided by the user)
let inputImage = path.join(__dirname, 'source-icon.png');

// Check if JPG version exists instead
if (!fs.existsSync(inputImage)) {
  const jpgVersion = path.join(__dirname, 'source-icon.jpg');
  if (fs.existsSync(jpgVersion)) {
    inputImage = jpgVersion;
  }
}

// Check if source image exists
if (!fs.existsSync(inputImage)) {
  console.error('❌ Erro: Arquivo source-icon.png não encontrado!');
  console.error('Por favor, salve a imagem como source-icon.png na raiz do projeto.');
  process.exit(1);
}

console.log('🎨 Gerando ícones do ClubNath...\n');

// Generate all icon sizes
Promise.all(
  sizes.map(async (size) => {
    const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);

    await sharp(inputImage)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(outputPath);

    console.log(`✅ Criado: icon-${size}x${size}.png`);
  })
)
  .then(() => {
    console.log('\n🎉 Todos os ícones foram gerados com sucesso!');
    console.log(`📁 Localização: ${iconsDir}`);
    console.log('\n📱 Próximos passos:');
    console.log('1. Verifique os ícones gerados em public/icons/');
    console.log('2. Faça o build do app: npm run build');
    console.log('3. Teste o PWA no celular!');
  })
  .catch((err) => {
    console.error('❌ Erro ao gerar ícones:', err);
    process.exit(1);
  });
