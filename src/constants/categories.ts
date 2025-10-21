/**
 * Post categories configuration
 * Centralized to avoid duplication across components
 */

export const CATEGORIES = ['Look do dia', 'Desabafo', 'Fé', 'Dica de mãe'] as const;

export const ALL_CATEGORIES = ['Todos', ...CATEGORIES] as const;

export type Category = (typeof CATEGORIES)[number];
export type CategoryFilter = (typeof ALL_CATEGORIES)[number];

/**
 * Category display metadata
 */
export const CATEGORY_META: Record<
  Category,
  {
    label: string;
    description: string;
    icon: string;
  }
> = {
  'Look do dia': {
    label: 'Look do dia',
    description: 'Compartilhe seu estilo e inspire outras mães',
    icon: '👗',
  },
  Desabafo: {
    label: 'Desabafo',
    description: 'Um espaço seguro para compartilhar seus sentimentos',
    icon: '💭',
  },
  Fé: {
    label: 'Fé',
    description: 'Compartilhe sua fé e encontre conforto espiritual',
    icon: '🙏',
  },
  'Dica de mãe': {
    label: 'Dica de mãe',
    description: 'Dicas práticas para o dia a dia da maternidade',
    icon: '💡',
  },
};

/**
 * Check if a string is a valid category
 */
export function isValidCategory(value: string): value is Category {
  return CATEGORIES.includes(value as Category);
}

/**
 * Get category metadata
 */
export function getCategoryMeta(category: Category) {
  return CATEGORY_META[category];
}
