/**
 * Input validation utilities
 * Provides type-safe validation for user inputs
 */

import { APP_CONFIG } from '../constants';
import { isValidCategory } from '../constants/categories';

/**
 * Validation result type
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate post caption
 */
export function validatePostCaption(caption: string): ValidationResult {
  if (!caption || caption.trim().length === 0) {
    return { valid: false, error: 'A legenda não pode estar vazia' };
  }

  if (caption.length > APP_CONFIG.maxCaptionLength) {
    return {
      valid: false,
      error: `A legenda deve ter no máximo ${APP_CONFIG.maxCaptionLength} caracteres`,
    };
  }

  return { valid: true };
}

/**
 * Validate post category
 */
export function validatePostCategory(category: string): ValidationResult {
  if (!isValidCategory(category)) {
    return { valid: false, error: 'Categoria inválida' };
  }

  return { valid: true };
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): ValidationResult {
  // Check file type
  if (!(APP_CONFIG.allowedImageTypes as readonly string[]).includes(file.type)) {
    return {
      valid: false,
      error: 'Formato de imagem inválido. Use JPEG, PNG ou WebP',
    };
  }

  // Check file size
  if (file.size > APP_CONFIG.maxImageSize) {
    const maxSizeMB = APP_CONFIG.maxImageSize / (1024 * 1024);
    return {
      valid: false,
      error: `A imagem deve ter no máximo ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}

/**
 * Validate user bio
 */
export function validateBio(bio: string): ValidationResult {
  if (bio.length > APP_CONFIG.maxBioLength) {
    return {
      valid: false,
      error: `A bio deve ter no máximo ${APP_CONFIG.maxBioLength} caracteres`,
    };
  }

  return { valid: true };
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || email.trim().length === 0) {
    return { valid: false, error: 'O email não pode estar vazio' };
  }

  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Email inválido' };
  }

  return { valid: true };
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): ValidationResult {
  if (!password || password.length === 0) {
    return { valid: false, error: 'A senha não pode estar vazia' };
  }

  if (password.length < 6) {
    return {
      valid: false,
      error: 'A senha deve ter no mínimo 6 caracteres',
    };
  }

  return { valid: true };
}

/**
 * Validate full name
 */
export function validateFullName(name: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'O nome não pode estar vazio' };
  }

  if (name.trim().length < 2) {
    return { valid: false, error: 'O nome deve ter no mínimo 2 caracteres' };
  }

  return { valid: true };
}

/**
 * Sanitize HTML to prevent XSS
 * Basic implementation - for production, use a library like DOMPurify
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate and sanitize post data
 */
export function validatePost(data: {
  caption: string;
  category: string;
  imageFile?: File;
}): ValidationResult {
  const captionValidation = validatePostCaption(data.caption);
  if (!captionValidation.valid) {
    return captionValidation;
  }

  const categoryValidation = validatePostCategory(data.category);
  if (!categoryValidation.valid) {
    return categoryValidation;
  }

  if (data.imageFile) {
    const imageValidation = validateImageFile(data.imageFile);
    if (!imageValidation.valid) {
      return imageValidation;
    }
  }

  return { valid: true };
}
