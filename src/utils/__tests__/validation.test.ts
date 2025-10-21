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
      expect(validateEmail('usuario@example.com').valid).toBe(true);
      expect(validateEmail('user.name@domain.co').valid).toBe(true);
      expect(validateEmail('user+tag@example.com').valid).toBe(true);
    });

    it('deve rejeitar emails inválidos', () => {
      expect(validateEmail('').valid).toBe(false);
      expect(validateEmail('invalid').valid).toBe(false);
      expect(validateEmail('invalid@').valid).toBe(false);
      expect(validateEmail('@example.com').valid).toBe(false);
    });

    it('deve retornar mensagem de erro', () => {
      const result = validateEmail('');
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('validatePassword', () => {
    it('deve validar senhas válidas', () => {
      expect(validatePassword('Senha123!').valid).toBe(true);
      expect(validatePassword('123456').valid).toBe(true);
      expect(validatePassword('senhaValida').valid).toBe(true);
    });

    it('deve rejeitar senhas muito curtas', () => {
      expect(validatePassword('').valid).toBe(false);
      expect(validatePassword('short').valid).toBe(false);
      expect(validatePassword('12345').valid).toBe(false);
    });

    it('deve exigir mínimo de 6 caracteres', () => {
      expect(validatePassword('Ab1!x').valid).toBe(false);
      expect(validatePassword('Ab1!xy').valid).toBe(true);
    });
  });

  describe('validatePostCaption', () => {
    it('deve validar legendas válidas', () => {
      expect(validatePostCaption('Uma legenda válida').valid).toBe(true);
      expect(validatePostCaption('Post sobre maternidade').valid).toBe(true);
    });

    it('deve rejeitar legendas vazias', () => {
      expect(validatePostCaption('').valid).toBe(false);
      expect(validatePostCaption('   ').valid).toBe(false);
    });

    it('deve rejeitar legendas muito longas', () => {
      const longCaption = 'a'.repeat(1001);
      expect(validatePostCaption(longCaption).valid).toBe(false);
    });

    it('deve aceitar legendas até o limite', () => {
      const maxCaption = 'a'.repeat(1000);
      expect(validatePostCaption(maxCaption).valid).toBe(true);
    });
  });

  describe('validateFullName', () => {
    it('deve validar nomes válidos', () => {
      expect(validateFullName('João Silva').valid).toBe(true);
      expect(validateFullName('Ana').valid).toBe(true);
    });

    it('deve rejeitar nomes inválidos', () => {
      expect(validateFullName('').valid).toBe(false);
      expect(validateFullName('A').valid).toBe(false);
    });
  });

  describe('validateBio', () => {
    it('deve validar bio vazia', () => {
      expect(validateBio('').valid).toBe(true);
    });

    it('deve validar bio curta', () => {
      expect(validateBio('Olá, sou mãe de 2').valid).toBe(true);
    });

    it('deve rejeitar bio muito longa', () => {
      const longBio = 'a'.repeat(201);
      expect(validateBio(longBio).valid).toBe(false);
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
