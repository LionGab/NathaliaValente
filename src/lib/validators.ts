/**
 * Nossa Maternidade - Sistema de Validação
 * Validações robustas para formulários e dados
 */

import { z } from 'zod';

// Esquemas de validação base
export const emailSchema = z
  .string()
  .min(1, 'Email é obrigatório')
  .email('Email inválido')
  .max(255, 'Email muito longo');

export const passwordSchema = z
  .string()
  .min(8, 'Senha deve ter no mínimo 8 caracteres')
  .max(128, 'Senha muito longa')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
    'Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial'
  );

export const nameSchema = z
  .string()
  .min(2, 'Nome deve ter no mínimo 2 caracteres')
  .max(100, 'Nome muito longo')
  .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços');

export const phoneSchema = z
  .string()
  .regex(
    /^(\+55\s?)?(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/,
    'Telefone inválido. Use o formato: (11) 99999-9999'
  )
  .optional();

// Esquemas de validação específicos
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const signupSchema = z.object({
  fullName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  phone: phoneSchema,
  acceptTerms: z.boolean().refine(val => val === true, 'Você deve aceitar os termos de uso'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
});

export const postSchema = z.object({
  content: z
    .string()
    .min(1, 'Conteúdo é obrigatório')
    .max(2000, 'Conteúdo muito longo (máximo 2000 caracteres)')
    .refine(
      content => {
        // Verificar se não é apenas espaços em branco
        return content.trim().length > 0;
      },
      'Conteúdo não pode ser apenas espaços em branco'
    ),
  imageUrl: z.string().url('URL da imagem inválida').optional(),
  groupId: z.string().uuid('ID do grupo inválido').optional(),
  isPrivate: z.boolean().optional(),
});

export const groupSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome do grupo deve ter no mínimo 3 caracteres')
    .max(100, 'Nome do grupo muito longo')
    .refine(
      name => {
        // Verificar se não contém caracteres especiais perigosos
        return !/[<>{}[\]\\|`~!@#$%^&*()+=]/.test(name);
      },
      'Nome do grupo contém caracteres inválidos'
    ),
  description: z
    .string()
    .max(1000, 'Descrição muito longa (máximo 1000 caracteres)')
    .optional(),
  category: z.enum([
    'amamentacao',
    'pos_parto',
    'lifestyle',
    'fe',
    'saude',
    'relacionamento',
    'trabalho',
    'outros'
  ], {
    errorMap: () => ({ message: 'Categoria inválida' })
  }),
  isPrivate: z.boolean(),
  maxMembers: z
    .number()
    .min(2, 'Grupo deve ter no mínimo 2 membros')
    .max(1000, 'Grupo pode ter no máximo 1000 membros')
    .optional(),
  rules: z
    .string()
    .max(2000, 'Regras muito longas (máximo 2000 caracteres)')
    .optional(),
});

export const commentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comentário é obrigatório')
    .max(500, 'Comentário muito longo (máximo 500 caracteres)')
    .refine(
      content => content.trim().length > 0,
      'Comentário não pode ser apenas espaços em branco'
    ),
  postId: z.string().uuid('ID do post inválido'),
});

export const profileUpdateSchema = z.object({
  fullName: nameSchema.optional(),
  bio: z
    .string()
    .max(500, 'Bio muito longa (máximo 500 caracteres)')
    .optional(),
  phone: phoneSchema,
  location: z
    .string()
    .max(100, 'Localização muito longa')
    .optional(),
  website: z
    .string()
    .url('Website inválido')
    .optional(),
  isPublic: z.boolean().optional(),
});

// Funções de validação customizadas
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  try {
    emailSchema.parse(email);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0].message };
    }
    return { isValid: false, error: 'Erro de validação' };
  }
};

export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  try {
    passwordSchema.parse(password);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0].message };
    }
    return { isValid: false, error: 'Erro de validação' };
  }
};

export const validateName = (name: string): { isValid: boolean; error?: string } => {
  try {
    nameSchema.parse(name);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0].message };
    }
    return { isValid: false, error: 'Erro de validação' };
  }
};

export const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
  try {
    phoneSchema.parse(phone);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0].message };
    }
    return { isValid: false, error: 'Erro de validação' };
  }
};

// Validação de formulário completo
export const validateForm = <T>(schema: z.ZodSchema<T>, data: unknown): {
  isValid: boolean;
  data?: T;
  errors?: Record<string, string>;
} => {
  try {
    const validatedData = schema.parse(data);
    return { isValid: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach(err => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: 'Erro de validação' } };
  }
};

// Sanitização de dados
export const sanitizeString = (str: string): string => {
  return str
    .trim()
    .replace(/\s+/g, ' ') // Múltiplos espaços para um
    .replace(/[<>]/g, ''); // Remover tags HTML básicas
};

export const sanitizeHtml = (html: string): string => {
  // Lista de tags permitidas
  const allowedTags = ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'];
  
  // Remover todas as tags exceto as permitidas
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/<[^>]+>/g, (match) => {
    const tagName = match.match(/<\/?([a-zA-Z]+)/)?.[1]?.toLowerCase();
    if (tagName && allowedTags.includes(tagName)) {
      return match;
    }
    return '';
  });
  
  return sanitized;
};

// Validação de URL
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validação de UUID
export const validateUuid = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Validação de data
export const validateDate = (date: string): boolean => {
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
};

// Validação de idade mínima
export const validateMinimumAge = (birthDate: string, minimumAge: number = 18): boolean => {
  const birth = new Date(birthDate);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1 >= minimumAge;
  }
  
  return age >= minimumAge;
};

// Validação de CPF (Brasil)
export const validateCPF = (cpf: string): boolean => {
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  
  if (parseInt(cleanCPF.charAt(9)) !== digit1) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  
  return parseInt(cleanCPF.charAt(10)) === digit2;
};

// Validação de CNPJ (Brasil)
export const validateCNPJ = (cnpj: string): boolean => {
  // Remove caracteres não numéricos
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  
  // Verifica se tem 14 dígitos
  if (cleanCNPJ.length !== 14) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false;
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  let weight = 2;
  for (let i = 11; i >= 0; i--) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  
  if (parseInt(cleanCNPJ.charAt(12)) !== digit1) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  weight = 2;
  for (let i = 12; i >= 0; i--) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  
  return parseInt(cleanCNPJ.charAt(13)) === digit2;
};

// Validação de CEP (Brasil)
export const validateCEP = (cep: string): boolean => {
  const cleanCEP = cep.replace(/\D/g, '');
  return /^\d{8}$/.test(cleanCEP);
};

// Validação de PIX
export const validatePixKey = (key: string): boolean => {
  // Email
  if (key.includes('@')) {
    return validateEmail(key).isValid;
  }
  
  // CPF
  if (key.length === 11) {
    return validateCPF(key);
  }
  
  // CNPJ
  if (key.length === 14) {
    return validateCNPJ(key);
  }
  
  // Telefone
  if (key.length >= 10) {
    return validatePhone(key).isValid;
  }
  
  // Chave aleatória (UUID)
  if (key.length === 36) {
    return validateUuid(key);
  }
  
  return false;
};

// Exportar tipos
export type LoginData = z.infer<typeof loginSchema>;
export type SignupData = z.infer<typeof signupSchema>;
export type PostData = z.infer<typeof postSchema>;
export type GroupData = z.infer<typeof groupSchema>;
export type CommentData = z.infer<typeof commentSchema>;
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
