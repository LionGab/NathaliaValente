/**
 * Nossa Maternidade - Hook de Validação de Formulários
 * Hook para validação em tempo real e gerenciamento de estado
 */

import { useState, useCallback, useEffect } from 'react';
import { z } from 'zod';
import { validateForm, sanitizeString } from '../lib/validators';

interface UseFormValidationOptions<T> {
  schema: z.ZodSchema<T>;
  initialValues: T;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  debounceMs?: number;
}

interface UseFormValidationReturn<T> {
  values: T;
  errors: Record<string, string>;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  setValue: (field: keyof T, value: any) => void;
  setError: (field: keyof T, error: string) => void;
  clearError: (field: keyof T) => void;
  clearAllErrors: () => void;
  validate: () => boolean;
  validateField: (field: keyof T) => boolean;
  reset: () => void;
  handleSubmit: (onSubmit: (data: T) => void | Promise<void>) => (e: React.FormEvent) => void;
  getFieldProps: (field: keyof T) => {
    value: any;
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => void;
    onBlur: () => void;
    error: string | undefined;
    hasError: boolean;
  };
}

export const useFormValidation = <T extends Record<string, any>>({
  schema,
  initialValues,
  validateOnChange = true,
  validateOnBlur = true,
  debounceMs = 300,
}: UseFormValidationOptions<T>): UseFormValidationReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Validar formulário completo
  const validate = useCallback((): boolean => {
    const result = validateForm(schema, values);

    if (result.isValid) {
      setErrors({});
      return true;
    } else {
      setErrors(result.errors || {});
      return false;
    }
  }, [schema, values]);

  // Validar campo específico
  const validateField = useCallback(
    (field: keyof T): boolean => {
      try {
        const fieldSchema = schema.shape[field as string];
        if (fieldSchema) {
          fieldSchema.parse(values[field]);
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field as string];
            return newErrors;
          });
          return true;
        }
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldError = error.errors[0]?.message || 'Campo inválido';
          setErrors((prev) => ({
            ...prev,
            [field as string]: fieldError,
          }));
          return false;
        }
        return false;
      }
    },
    [schema, values]
  );

  // Definir valor de campo
  const setValue = useCallback(
    (field: keyof T, value: any) => {
      setValues((prev) => ({
        ...prev,
        [field]: value,
      }));
      setIsDirty(true);

      // Validação em tempo real
      if (validateOnChange) {
        if (debounceMs > 0) {
          if (debounceTimer) {
            clearTimeout(debounceTimer);
          }

          const timer = setTimeout(() => {
            validateField(field);
          }, debounceMs);

          setDebounceTimer(timer);
        } else {
          validateField(field);
        }
      }
    },
    [validateOnChange, validateField, debounceMs, debounceTimer]
  );

  // Definir erro de campo
  const setError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [field as string]: error,
    }));
  }, []);

  // Limpar erro de campo
  const clearError = useCallback((field: keyof T) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field as string];
      return newErrors;
    });
  }, []);

  // Limpar todos os erros
  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Resetar formulário
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsDirty(false);
    setIsSubmitting(false);
  }, [initialValues]);

  // Handler de mudança de campo
  const handleFieldChange = useCallback(
    (field: keyof T) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setValue(field, value);
      },
    [setValue]
  );

  // Handler de blur de campo
  const handleFieldBlur = useCallback(
    (field: keyof T) => () => {
      if (validateOnBlur) {
        validateField(field);
      }
    },
    [validateOnBlur, validateField]
  );

  // Props de campo para componentes
  const getFieldProps = useCallback(
    (field: keyof T) => ({
      value: values[field],
      onChange: handleFieldChange(field),
      onBlur: handleFieldBlur(field),
      error: errors[field as string],
      hasError: !!errors[field as string],
    }),
    [values, errors, handleFieldChange, handleFieldBlur]
  );

  // Handler de submit
  const handleSubmit = useCallback(
    (onSubmit: (data: T) => void | Promise<void>) => (e: React.FormEvent) => {
      e.preventDefault();

      if (isSubmitting) return;

      const isValid = validate();
      if (isValid) {
        setIsSubmitting(true);
        Promise.resolve(onSubmit(values)).finally(() => {
          setIsSubmitting(false);
        });
      }
    },
    [isSubmitting, validate, values]
  );

  // Validação inicial
  useEffect(() => {
    if (validateOnChange) {
      validate();
    }
  }, [validateOnChange, validate]);

  // Cleanup do debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  // Calcular se formulário é válido
  const isValid = Object.keys(errors).length === 0 && isDirty;

  return {
    values,
    errors,
    isValid,
    isDirty,
    isSubmitting,
    setValue,
    setError,
    clearError,
    clearAllErrors,
    validate,
    validateField,
    reset,
    handleSubmit,
    getFieldProps,
  };
};

// Hook específico para login
export const useLoginForm = () => {
  return useFormValidation({
    schema: z.object({
      email: z.string().email('Email inválido'),
      password: z.string().min(1, 'Senha é obrigatória'),
    }),
    initialValues: {
      email: '',
      password: '',
    },
    validateOnChange: true,
    validateOnBlur: true,
    debounceMs: 300,
  });
};

// Hook específico para cadastro
export const useSignupForm = () => {
  return useFormValidation({
    schema: z
      .object({
        fullName: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
        email: z.string().email('Email inválido'),
        password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
        confirmPassword: z.string(),
        phone: z.string().optional(),
        acceptTerms: z.boolean().refine((val) => val === true, 'Você deve aceitar os termos'),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: 'Senhas não coincidem',
        path: ['confirmPassword'],
      }),
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      acceptTerms: false,
    },
    validateOnChange: true,
    validateOnBlur: true,
    debounceMs: 300,
  });
};

// Hook específico para posts
export const usePostForm = () => {
  return useFormValidation({
    schema: z.object({
      content: z.string().min(1, 'Conteúdo é obrigatório').max(2000, 'Conteúdo muito longo'),
      imageUrl: z.string().url('URL inválida').optional(),
      groupId: z.string().uuid('ID inválido').optional(),
      isPrivate: z.boolean().optional(),
    }),
    initialValues: {
      content: '',
      imageUrl: '',
      groupId: '',
      isPrivate: false,
    },
    validateOnChange: true,
    validateOnBlur: true,
    debounceMs: 500,
  });
};

// Hook específico para grupos
export const useGroupForm = () => {
  return useFormValidation({
    schema: z.object({
      name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100, 'Nome muito longo'),
      description: z.string().max(1000, 'Descrição muito longa').optional(),
      category: z.enum([
        'amamentacao',
        'pos_parto',
        'lifestyle',
        'fe',
        'saude',
        'relacionamento',
        'trabalho',
        'outros',
      ]),
      isPrivate: z.boolean(),
      maxMembers: z.number().min(2, 'Mínimo 2 membros').max(1000, 'Máximo 1000 membros').optional(),
      rules: z.string().max(2000, 'Regras muito longas').optional(),
    }),
    initialValues: {
      name: '',
      description: '',
      category: 'amamentacao' as const,
      isPrivate: false,
      maxMembers: 100,
      rules: '',
    },
    validateOnChange: true,
    validateOnBlur: true,
    debounceMs: 500,
  });
};

// Hook para validação de perfil
export const useProfileForm = () => {
  return useFormValidation({
    schema: z.object({
      fullName: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').optional(),
      bio: z.string().max(500, 'Bio muito longa').optional(),
      phone: z.string().optional(),
      location: z.string().max(100, 'Localização muito longa').optional(),
      website: z.string().url('Website inválido').optional(),
      isPublic: z.boolean().optional(),
    }),
    initialValues: {
      fullName: '',
      bio: '',
      phone: '',
      location: '',
      website: '',
      isPublic: true,
    },
    validateOnChange: true,
    validateOnBlur: true,
    debounceMs: 300,
  });
};
