import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validatePostCaption,
  validateFullName,
  validateBio,
  sanitizeHtml,
} from '../validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('deve validar emails corretos', () => {
      expect(validateEmail('usuario@example.com').isValid).toBe(true);
      expect(validateEmail('user.name@domain.co').isValid).toBe(true);
      expect(validateEmail('user+tag@example.com').isValid).toBe(true);
    });

    it('deve rejeitar emails inválidos', () => {
      expect(validateEmail('').isValid).toBe(false);
      expect(validateEmail('invalid').isValid).toBe(false);
      expect(validateEmail('invalid@').isValid).toBe(false);
      expect(validateEmail('@example.com').isValid).toBe(false);
    });

    it('deve retornar mensagem de erro', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toBeDefined();
    });
  });

  describe('validatePassword', () => {
    it('deve validar senhas válidas', () => {
      expect(validatePassword('Senha123!').isValid).toBe(true);
      expect(validatePassword('Senha123').isValid).toBe(true);
      expect(validatePassword('SenhaValida123').isValid).toBe(true);
    });

    it('deve rejeitar senhas muito curtas', () => {
      expect(validatePassword('').isValid).toBe(false);
      expect(validatePassword('short').isValid).toBe(false);
      expect(validatePassword('12345').isValid).toBe(false);
    });

    it('deve exigir mínimo de 8 caracteres', () => {
      expect(validatePassword('Ab1!x').isValid).toBe(false);
      expect(validatePassword('Ab1!xyz1').isValid).toBe(true);
    });
  });

  describe('validatePostCaption', () => {
    it('deve validar legendas válidas', () => {
      expect(validatePostCaption('Uma legenda válida').isValid).toBe(true);
      expect(validatePostCaption('Post sobre maternidade').isValid).toBe(true);
    });

    it('deve rejeitar legendas vazias', () => {
      expect(validatePostCaption('').isValid).toBe(false);
      expect(validatePostCaption('   ').isValid).toBe(false);
    });

    it('deve rejeitar legendas muito longas', () => {
      const longCaption = 'a'.repeat(1001);
      expect(validatePostCaption(longCaption).isValid).toBe(false);
    });

    it('deve aceitar legendas até o limite', () => {
      const maxCaption = 'a'.repeat(1000);
      expect(validatePostCaption(maxCaption).isValid).toBe(true);
    });
  });

  describe('validateFullName', () => {
    it('deve validar nomes válidos', () => {
      expect(validateFullName('João Silva').isValid).toBe(true);
      expect(validateFullName('Ana').isValid).toBe(true);
    });

    it('deve rejeitar nomes inválidos', () => {
      expect(validateFullName('').isValid).toBe(false);
      expect(validateFullName('A').isValid).toBe(false);
    });
  });

  describe('validateBio', () => {
    it('deve validar bio vazia', () => {
      expect(validateBio('').isValid).toBe(true);
    });

    it('deve validar bio curta', () => {
      expect(validateBio('Olá, sou mãe de 2').isValid).toBe(true);
    });

    it('deve rejeitar bio muito longa', () => {
      const longBio = 'a'.repeat(501);
      expect(validateBio(longBio).isValid).toBe(false);
    });
  });

  describe('sanitizeHtml', () => {
    it('deve escapar caracteres HTML', () => {
      const result = sanitizeHtml('<script>alert("xss")</script>');
      expect(result).toContain('&lt;script&gt;');
      expect(result).toContain('&quot;xss&quot;');
    });

    it('deve escapar ampersand', () => {
      expect(sanitizeHtml('Test & test')).toContain('&amp;');
    });

    it('deve escapar tags HTML', () => {
      const result = sanitizeHtml('<div>content</div>');
      expect(result).toContain('&lt;div&gt;');
      expect(result).toContain('&lt;&#x2F;div&gt;');
    });

    it('deve preservar texto normal', () => {
      const normalText = 'Este é um texto normal sem HTML';
      expect(sanitizeHtml(normalText)).toBe(normalText);
    });
  });
});
