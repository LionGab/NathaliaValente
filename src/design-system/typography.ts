// Nossa Maternidade Design System - Tipografia
export const typography = {
  // Famílias de fontes
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    serif: ['Georgia', 'serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },

  // Tamanhos de fonte
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
    '6xl': '3.75rem', // 60px
  },

  // Pesos de fonte
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  // Altura da linha
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // Espaçamento entre letras
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Hierarquia tipográfica
  hierarchy: {
    h1: {
      fontSize: '2.25rem', // 36px
      fontWeight: '700',
      lineHeight: '1.2',
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '1.875rem', // 30px
      fontWeight: '600',
      lineHeight: '1.3',
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: '1.5rem', // 24px
      fontWeight: '600',
      lineHeight: '1.4',
      letterSpacing: '0',
    },
    h4: {
      fontSize: '1.25rem', // 20px
      fontWeight: '600',
      lineHeight: '1.4',
      letterSpacing: '0',
    },
    h5: {
      fontSize: '1.125rem', // 18px
      fontWeight: '500',
      lineHeight: '1.5',
      letterSpacing: '0',
    },
    h6: {
      fontSize: '1rem', // 16px
      fontWeight: '500',
      lineHeight: '1.5',
      letterSpacing: '0',
    },
    body: {
      fontSize: '1rem', // 16px
      fontWeight: '400',
      lineHeight: '1.6',
      letterSpacing: '0',
    },
    small: {
      fontSize: '0.875rem', // 14px
      fontWeight: '400',
      lineHeight: '1.5',
      letterSpacing: '0',
    },
    caption: {
      fontSize: '0.75rem', // 12px
      fontWeight: '400',
      lineHeight: '1.4',
      letterSpacing: '0.025em',
    },
  },

  // Estilos específicos para mobile
  mobile: {
    h1: {
      fontSize: '1.875rem', // 30px
      fontWeight: '700',
      lineHeight: '1.2',
    },
    h2: {
      fontSize: '1.5rem', // 24px
      fontWeight: '600',
      lineHeight: '1.3',
    },
    h3: {
      fontSize: '1.25rem', // 20px
      fontWeight: '600',
      lineHeight: '1.4',
    },
    body: {
      fontSize: '0.875rem', // 14px
      fontWeight: '400',
      lineHeight: '1.6',
    },
  },
};
