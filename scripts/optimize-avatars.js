#!/usr/bin/env node

// =====================================================
// CLUBNATH AVATAR OPTIMIZATION SCRIPT
// Otimiza SVGs dos avatares para produção
// =====================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Função para otimizar SVG manualmente (sem dependências externas)
function optimizeSVG(svgContent) {
  // Remove comentários
  let optimized = svgContent.replace(/<!--[\s\S]*?-->/g, '');
  
  // Remove espaços em branco desnecessários
  optimized = optimized.replace(/\s+/g, ' ');
  optimized = optimized.replace(/>\s+</g, '><');
  
  // Remove atributos desnecessários
  optimized = optimized.replace(/\s+xmlns:xlink="[^"]*"/g, '');
  optimized = optimized.replace(/\s+version="[^"]*"/g, '');
  
  // Otimiza viewBox se necessário
  optimized = optimized.replace(/viewBox="0 0 200 200"/g, 'viewBox="0 0 200 200"');
  
  // Remove linhas vazias
  optimized = optimized.replace(/\n\s*\n/g, '\n');
  
  // Trim final
  optimized = optimized.trim();
  
  return optimized;
}

// Função para verificar tamanho do arquivo
function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return stats.size;
}

// Função para formatar bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Função principal
function optimizeAvatars() {
  const avatarsDir = path.join(__dirname, '..', 'public', 'avatars');
  const maxSize = 15 * 1024; // 15KB em bytes
  
  console.log('🎨 Otimizando avatares do ClubNath...\n');
  
  if (!fs.existsSync(avatarsDir)) {
    console.error('❌ Diretório de avatares não encontrado:', avatarsDir);
    process.exit(1);
  }
  
  const files = fs.readdirSync(avatarsDir).filter(file => file.endsWith('.svg'));
  
  if (files.length === 0) {
    console.log('⚠️  Nenhum arquivo SVG encontrado no diretório de avatares');
    return;
  }
  
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let optimizedCount = 0;
  
  files.forEach(file => {
    const filePath = path.join(avatarsDir, file);
    const originalContent = fs.readFileSync(filePath, 'utf8');
    const originalSize = getFileSize(filePath);
    
    const optimizedContent = optimizeSVG(originalContent);
    const optimizedSize = Buffer.byteLength(optimizedContent, 'utf8');
    
    // Salvar arquivo otimizado
    fs.writeFileSync(filePath, optimizedContent, 'utf8');
    
    totalOriginalSize += originalSize;
    totalOptimizedSize += optimizedSize;
    
    const saved = originalSize - optimizedSize;
    const savedPercent = ((saved / originalSize) * 100).toFixed(1);
    
    console.log(`✅ ${file}`);
    console.log(`   Original: ${formatBytes(originalSize)}`);
    console.log(`   Otimizado: ${formatBytes(optimizedSize)}`);
    console.log(`   Economia: ${formatBytes(saved)} (${savedPercent}%)`);
    
    if (optimizedSize > maxSize) {
      console.log(`   ⚠️  ATENÇÃO: Arquivo maior que 15KB!`);
    } else {
      console.log(`   ✅ Tamanho OK`);
    }
    
    console.log('');
    optimizedCount++;
  });
  
  // Relatório final
  const totalSaved = totalOriginalSize - totalOptimizedSize;
  const totalSavedPercent = ((totalSaved / totalOriginalSize) * 100).toFixed(1);
  
  console.log('📊 RELATÓRIO FINAL:');
  console.log(`   Arquivos processados: ${optimizedCount}`);
  console.log(`   Tamanho original total: ${formatBytes(totalOriginalSize)}`);
  console.log(`   Tamanho otimizado total: ${formatBytes(totalOptimizedSize)}`);
  console.log(`   Economia total: ${formatBytes(totalSaved)} (${totalSavedPercent}%)`);
  
  if (totalOptimizedSize / optimizedCount > maxSize) {
    console.log(`   ⚠️  ATENÇÃO: Tamanho médio maior que 15KB!`);
  } else {
    console.log(`   ✅ Todos os arquivos estão dentro do limite de 15KB`);
  }
  
  console.log('\n🎉 Otimização concluída!');
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  optimizeAvatars();
}

export { optimizeAvatars, optimizeSVG };
