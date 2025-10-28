#!/usr/bin/env node

/**
 * Script de Validação de Acessibilidade
 * ClubNath VIP - Conformidade WCAG 2.1 AA
 *
 * Uso: node scripts/check-accessibility.cjs
 */

const fs = require('fs');
const path = require('path');

const issues = {
  missingAriaLabel: [],
  motionButtonNoLabel: [],
  decorativeIcons: [],
  missingAltText: [],
  missingRoles: [],
  missingFormLabels: [],
  buttonWithoutLabel: [],
  linkWithoutText: []
};

let filesScanned = 0;
let totalLines = 0;

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  filesScanned++;
  totalLines += lines.length;

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmedLine = line.trim();

    // Check 1: motion.button without aria-label
    if (trimmedLine.includes('motion.button') || trimmedLine.includes('<motion.button')) {
      // Look ahead for aria-label in next 5 lines
      const contextLines = lines.slice(index, index + 5).join(' ');
      if (!contextLines.includes('aria-label')) {
        issues.motionButtonNoLabel.push({
          file: filePath,
          line: lineNum,
          code: trimmedLine.substring(0, 80)
        });
      }
    }

    // Check 2: button without aria-label or text content
    if (trimmedLine.includes('<button') && !trimmedLine.includes('aria-label')) {
      // Verificar se tem apenas ícone
      const nextLines = lines.slice(index, index + 3).join(' ');
      if (nextLines.includes('className="w-') && !nextLines.includes('aria-label')) {
        issues.buttonWithoutLabel.push({
          file: filePath,
          line: lineNum,
          code: trimmedLine.substring(0, 80)
        });
      }
    }

    // Check 3: Icons (Lucide) without aria-hidden
    const iconMatch = trimmedLine.match(/<(Home|Search|Bell|Heart|MessageCircle|User|Plus|Menu|Star|Users|Trophy|Flame|Target|Sparkles|Clock|ShoppingBag|ChevronRight|ArrowRight|X|Check|AlertCircle)/);
    if (iconMatch && !trimmedLine.includes('aria-hidden')) {
      issues.decorativeIcons.push({
        file: filePath,
        line: lineNum,
        icon: iconMatch[1],
        code: trimmedLine.substring(0, 80)
      });
    }

    // Check 4: img without alt
    if (trimmedLine.includes('<img') && !trimmedLine.includes('alt=')) {
      issues.missingAltText.push({
        file: filePath,
        line: lineNum,
        code: trimmedLine.substring(0, 80)
      });
    }

    // Check 5: Modal containers without role="dialog"
    if ((trimmedLine.includes('Modal') || trimmedLine.includes('modal')) &&
        trimmedLine.includes('className') &&
        !content.includes('role="dialog"')) {
      issues.missingRoles.push({
        file: filePath,
        line: lineNum,
        code: trimmedLine.substring(0, 80)
      });
    }

    // Check 6: input without label or aria-label
    if (trimmedLine.includes('<input') &&
        !trimmedLine.includes('aria-label') &&
        !content.includes(`htmlFor="${trimmedLine.match(/id="([^"]*)"/)?.[1]}"`)) {
      issues.missingFormLabels.push({
        file: filePath,
        line: lineNum,
        code: trimmedLine.substring(0, 80)
      });
    }

    // Check 7: Links without text content or aria-label
    if (trimmedLine.includes('<a ') &&
        !trimmedLine.includes('aria-label') &&
        !trimmedLine.includes('>')) {
      const nextLine = lines[index + 1]?.trim();
      if (nextLine && nextLine.includes('</a>') && nextLine.length < 10) {
        issues.linkWithoutText.push({
          file: filePath,
          line: lineNum,
          code: trimmedLine.substring(0, 80)
        });
      }
    }
  });
}

function scanDirectory(dir) {
  try {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory() && !file.includes('node_modules') && !file.includes('.git')) {
        scanDirectory(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
        checkFile(filePath);
      }
    });
  } catch (error) {
    console.error(`Erro ao ler diretório ${dir}:`, error.message);
  }
}

function generateReport() {
  console.log('🔍 VALIDAÇÃO DE ACESSIBILIDADE - ClubNath VIP');
  console.log('═'.repeat(60));
  console.log(`\n📂 Arquivos escaneados: ${filesScanned}`);
  console.log(`📝 Linhas analisadas: ${totalLines.toLocaleString()}`);
  console.log(`\n${'═'.repeat(60)}\n`);

  const totalIssues = Object.values(issues).reduce((sum, arr) => sum + arr.length, 0);

  console.log('📊 RESUMO DE PROBLEMAS ENCONTRADOS\n');
  console.log(`❌ motion.button sem aria-label: ${issues.motionButtonNoLabel.length}`);
  console.log(`❌ Botões sem label: ${issues.buttonWithoutLabel.length}`);
  console.log(`⚠️  Ícones sem aria-hidden: ${issues.decorativeIcons.length}`);
  console.log(`❌ Imagens sem alt text: ${issues.missingAltText.length}`);
  console.log(`❌ Modais sem role="dialog": ${issues.missingRoles.length}`);
  console.log(`❌ Inputs sem label: ${issues.missingFormLabels.length}`);
  console.log(`❌ Links sem texto: ${issues.linkWithoutText.length}`);
  console.log(`\n🎯 TOTAL DE PROBLEMAS: ${totalIssues}\n`);

  // Status de conformidade
  const conformityRate = Math.max(0, ((1 - (totalIssues / (filesScanned * 10))) * 100)).toFixed(1);
  console.log(`📈 Taxa de Conformidade WCAG 2.1: ${conformityRate}%`);

  if (totalIssues === 0) {
    console.log('\n✅ PARABÉNS! Nenhum problema de acessibilidade detectado!\n');
    return;
  }

  console.log(`\n${'═'.repeat(60)}\n`);
  console.log('📋 DETALHES DOS PROBLEMAS\n');

  // Exibir detalhes
  Object.entries(issues).forEach(([key, items]) => {
    if (items.length > 0) {
      console.log(`\n▶ ${key.toUpperCase()} (${items.length} ocorrências):`);
      console.log('─'.repeat(60));

      items.slice(0, 5).forEach((item, idx) => {
        console.log(`\n  ${idx + 1}. ${item.file}:${item.line}`);
        console.log(`     Código: ${item.code}${item.code.length >= 80 ? '...' : ''}`);
        if (item.icon) console.log(`     Ícone: ${item.icon}`);
      });

      if (items.length > 5) {
        console.log(`\n  ... e mais ${items.length - 5} ocorrências`);
        console.log(`\n  📁 Arquivos afetados:`);
        const uniqueFiles = [...new Set(items.map(i => i.file))];
        uniqueFiles.slice(0, 10).forEach(file => {
          const count = items.filter(i => i.file === file).length;
          console.log(`     - ${file} (${count} problemas)`);
        });
      }
    }
  });

  console.log(`\n${'═'.repeat(60)}\n`);
  console.log('💡 PRÓXIMOS PASSOS:\n');
  console.log('  1. Revisar o arquivo ACESSIBILIDADE-AUDIT.md');
  console.log('  2. Corrigir problemas CRÍTICOS primeiro');
  console.log('  3. Usar exemplos de código do audit para correções');
  console.log('  4. Executar este script novamente após correções\n');
  console.log(`${'═'.repeat(60)}\n`);
}

// Executar scan
console.log('\n🚀 Iniciando scan de acessibilidade...\n');
scanDirectory('./src');
generateReport();

// Exit code: 0 se OK, 1 se tem problemas
const totalIssues = Object.values(issues).reduce((sum, arr) => sum + arr.length, 0);
process.exit(totalIssues > 0 ? 1 : 0);
