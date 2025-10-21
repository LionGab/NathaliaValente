import { describe, it, expect } from 'vitest';
import {
  validatePost,
  validatePostCaption,
  validatePostCategory,
  validateEmail,
  validatePassword,
  validateFullName,
  validateImageFile,
  sanitizeHtml,
} from '../validation';

describe('Validation Utils', () => {
  describe('validatePost', () => {
    it('should validate valid post', () => {
      const result = validatePost({
        caption: 'This is a valid caption',
        category: 'Fé',
      });

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject empty caption', () => {
      const result = validatePost({
        caption: '',
        category: 'Fé',
      });

      expect(result.valid).toBe(false);
      expect(result.error).toContain('vazia');
    });

    it('should reject caption too long', () => {
      const longCaption = 'a'.repeat(3001);
      const result = validatePost({
        caption: longCaption,
        category: 'Fé',
      });

      expect(result.valid).toBe(false);
      expect(result.error).toContain('máximo');
    });

    it('should reject invalid category', () => {
      const result = validatePost({
        caption: 'Valid caption',
        category: 'Invalid Category' as any,
      });

      expect(result.valid).toBe(false);
      expect(result.error).toContain('inválida');
    });
  });

  describe('validateEmail', () => {
    it('should validate valid email', () => {
      expect(validateEmail('test@example.com').valid).toBe(true);
      expect(validateEmail('user.name@domain.co.uk').valid).toBe(true);
      expect(validateEmail('user+tag@example.com').valid).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(validateEmail('invalid').valid).toBe(false);
      expect(validateEmail('invalid@').valid).toBe(false);
      expect(validateEmail('@invalid.com').valid).toBe(false);
      expect(validateEmail('invalid@.com').valid).toBe(false);
      expect(validateEmail('').valid).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate valid password', () => {
      const result = validatePassword('ValidPassword123');
      expect(result.valid).toBe(true);
    });

    it('should reject password too short', () => {
      const result = validatePassword('Ab1');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('6 caracteres');
    });

    it('should accept minimum length password', () => {
      const result = validatePassword('Test12');
      expect(result.valid).toBe(true);
    });

    it('should reject empty password', () => {
      const result = validatePassword('');
      expect(result.valid).toBe(false);
    });
  });

  describe('validateFullName', () => {
    it('should validate valid name', () => {
      const result = validateFullName('John Doe');
      expect(result.valid).toBe(true);
    });

    it('should reject empty name', () => {
      const result = validateFullName('');
      expect(result.valid).toBe(false);
    });

    it('should reject too short name', () => {
      const result = validateFullName('A');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('mínimo 2');
    });
  });

  describe('sanitizeHtml', () => {
    it('should sanitize HTML tags', () => {
      const input = '<script>alert("xss")</script>';
      const output = sanitizeHtml(input);
      expect(output).not.toContain('<script>');
      expect(output).toContain('&lt;script&gt;');
    });

    it('should sanitize quotes', () => {
      const input = `"test" and 'test'`;
      const output = sanitizeHtml(input);
      expect(output).toContain('&quot;');
      expect(output).toContain('&#x27;');
    });
  });
});
