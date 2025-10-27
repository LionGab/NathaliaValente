/**
 * Script para corrigir erros comuns de sintaxe JSX
 * - Espaços entre < e nome de tags
 * - Espaços antes de > em tags de fechamento
 * - Comentários JSX com espaços antes do }
 */

const fs = require('fs');
const path = require('path');

function fixJSXSyntax(content) {
  let fixed = content;

  // Fix: < motion.div -> <motion.div
  fixed = fixed.replace(/< (motion\.\w+)/g, '<$1');

  // Fix: </ motion.div -> </motion.div
  fixed = fixed.replace(/<\/ (motion\.\w+)/g, '</$1');

  // Fix: </div > -> </div>
  fixed = fixed.replace(/(<\/\w+(?:\.\w+)?)\s+>/g, '$1>');

  // Fix: {/* comment */ } -> {/* comment */}
  fixed = fixed.replace(/(\{\/\*[^*]*\*\/)\s+\}/g, '$1}');

  // Fix: aria - label -> aria-label
  fixed = fixed.replace(/aria\s+-\s+label/g, 'aria-label');

  return fixed;
}

// Files to fix
const filesToFix = [
  'src/features/home/screens/HomePage.tsx',
  'src/features/home/screens/HomePageSimple.tsx'
];

filesToFix.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);

  if (fs.existsSync(fullPath)) {
    console.log(`Fixing ${filePath}...`);
    const content = fs.readFileSync(fullPath, 'utf8');
    const fixed = fixJSXSyntax(content);

    if (content !== fixed) {
      fs.writeFileSync(fullPath, fixed, 'utf8');
      console.log(`✓ Fixed ${filePath}`);
    } else {
      console.log(`- No changes needed for ${filePath}`);
    }
  } else {
    console.log(`✗ File not found: ${filePath}`);
  }
});

console.log('\nDone!');
