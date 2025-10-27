#!/usr/bin/env node
/**
 * Pre-commit Secret Scanner
 * Blocks commits containing potential secrets like API keys, tokens, passwords
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

// Patterns that indicate potential secrets
const SECRET_PATTERNS = [
  // API Keys and tokens
  {
    pattern: /(?:supabase|firebase|stripe|openai|aws)[-_]?(?:api[-_]?)?(?:key|token|secret)[\s:=]["']?[a-zA-Z0-9_\-]{20,}/gi,
    message: 'Potential API key detected'
  },
  // Generic secret patterns
  {
    pattern: /(?:api[-_]?key|api[-_]?secret|access[-_]?token|auth[-_]?token|secret[-_]?key)[\s:=]["']?[a-zA-Z0-9_\-]{20,}/gi,
    message: 'Potential API key or token detected'
  },
  // Supabase URLs with keys
  {
    pattern: /https:\/\/[a-z0-9]+\.supabase\.co/gi,
    message: 'Supabase URL detected - ensure it\'s in a .env file'
  },
  // Private keys
  {
    pattern: /-----BEGIN (?:RSA |EC |DSA )?PRIVATE KEY-----/gi,
    message: 'Private key detected'
  },
  // AWS keys
  {
    pattern: /(?:A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/g,
    message: 'AWS Access Key ID detected'
  },
  // High entropy strings (potential secrets)
  {
    pattern: /(?:password|passwd|pwd|secret)[\s:=]["']?[^\s"']{16,}/gi,
    message: 'Potential password or secret detected'
  }
];

// Files to ignore (these are expected to contain example/template values)
const IGNORED_FILES = [
  '.env.example',
  'env.example',
  '.env.template',
  'check-secrets.js',
  'package-lock.json',
  'README.md',
  'AUDITORIA',
  'CHECKLIST',
  'CLAUDE.md'
];

/**
 * Check if file should be ignored
 */
function shouldIgnoreFile(filename) {
  return IGNORED_FILES.some(ignored => filename.includes(ignored));
}

/**
 * Scan file content for potential secrets
 */
function scanFileForSecrets(filename, content) {
  if (shouldIgnoreFile(filename)) {
    return null;
  }

  const findings = [];
  const lines = content.split('\n');

  SECRET_PATTERNS.forEach(({ pattern, message }) => {
    lines.forEach((line, lineNumber) => {
      // Skip comments and example values
      if (line.trim().startsWith('#') || 
          line.trim().startsWith('//') || 
          line.includes('your_') || 
          line.includes('example_') ||
          line.includes('placeholder_') ||
          line.includes('sua-chave') ||
          line.includes('seu-projeto')) {
        return;
      }

      const matches = line.match(pattern);
      if (matches) {
        findings.push({
          file: filename,
          line: lineNumber + 1,
          message,
          match: matches[0].substring(0, 50) + '...' // Truncate for security
        });
      }
    });
  });

  return findings.length > 0 ? findings : null;
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('✅ No files to check');
    process.exit(0);
  }

  let hasSecrets = false;
  const allFindings = [];

  args.forEach(filename => {
    try {
      const filepath = resolve(process.cwd(), filename);
      const content = readFileSync(filepath, 'utf8');
      const findings = scanFileForSecrets(filename, content);

      if (findings) {
        allFindings.push(...findings);
        hasSecrets = true;
      }
    } catch (error) {
      // File might have been deleted or is binary - skip it
      if (error.code !== 'ENOENT') {
        console.warn(`⚠️  Warning: Could not read ${filename}: ${error.message}`);
      }
    }
  });

  if (hasSecrets) {
    console.error('\n🚨 SECURITY ALERT: Potential secrets detected!\n');
    console.error('The following files contain what appear to be secrets:\n');
    
    allFindings.forEach(finding => {
      console.error(`  ❌ ${finding.file}:${finding.line}`);
      console.error(`     ${finding.message}`);
      console.error(`     Content: ${finding.match}\n`);
    });

    console.error('⚠️  If these are real secrets:');
    console.error('   1. Remove them from the code');
    console.error('   2. Add them to .env (which is in .gitignore)');
    console.error('   3. Use import.meta.env.VITE_* to access them');
    console.error('   4. If already committed, rotate the secrets immediately!\n');
    console.error('⚠️  If these are false positives, update scripts/check-secrets.js\n');

    process.exit(1);
  }

  console.log('✅ Secret scan passed - no secrets detected');
  process.exit(0);
}

main();
