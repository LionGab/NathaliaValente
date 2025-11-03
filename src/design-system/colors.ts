/**
 * Esquema de Cores Acolhedor para Mães - Nossa Maternidade
 *
 * Paleta inspirada em tons suaves, naturais e confortáveis
 * que transmitem calma, conforto e bem-estar para mães
 */

export const colors = {
  // Cores Primárias - Tons Suaves e Acolhedores
  primary: {
    50: '#fdf2f8', // Rosa muito claro - fundos suaves
    100: '#fce7f3', // Rosa claro - elementos de destaque suave
    200: '#fbcfe8', // Rosa médio-claro - hover states
    300: '#f9a8d4', // Rosa médio - elementos interativos
    400: '#f472b6', // Rosa vibrante - CTAs principais
    500: '#ec4899', // Rosa principal - marca
    600: '#db2777', // Rosa escuro - texto em contraste
    700: '#be185d', // Rosa muito escuro - elementos de destaque
    800: '#9d174d', // Rosa escuro profundo
    900: '#831843', // Rosa mais escuro - texto principal
  },

  // Cores Secundárias - Tons Lavanda e Lilás
  secondary: {
    50: '#faf5ff', // Lavanda muito claro
    100: '#f3e8ff', // Lavanda claro
    200: '#e9d5ff', // Lavanda médio-claro
    300: '#d8b4fe', // Lavanda médio
    400: '#c084fc', // Lavanda vibrante
    500: '#a855f7', // Lavanda principal
    600: '#9333ea', // Lavanda escuro
    700: '#7c3aed', // Lavanda muito escuro
    800: '#6b21a8', // Lavanda escuro profundo
    900: '#581c87', // Lavanda mais escuro
  },

  // Cores de Apoio - Tons Azuis Suaves
  accent: {
    50: '#eff6ff', // Azul muito claro
    100: '#dbeafe', // Azul claro
    200: '#bfdbfe', // Azul médio-claro
    300: '#93c5fd', // Azul médio
    400: '#60a5fa', // Azul vibrante
    500: '#3b82f6', // Azul principal
    600: '#2563eb', // Azul escuro
    700: '#1d4ed8', // Azul muito escuro
    800: '#1e40af', // Azul escuro profundo
    900: '#1e3a8a', // Azul mais escuro
  },

  // Cores Neutras - Tons Terrosos e Quentes
  neutral: {
    50: '#fafaf9', // Branco quente
    100: '#f5f5f4', // Cinza muito claro
    200: '#e7e5e4', // Cinza claro
    300: '#d6d3d1', // Cinza médio-claro
    400: '#a8a29e', // Cinza médio
    500: '#78716c', // Cinza médio-escuro
    600: '#57534e', // Cinza escuro
    700: '#44403c', // Cinza muito escuro
    800: '#292524', // Cinza escuro profundo
    900: '#1c1917', // Cinza mais escuro
  },

  // Cores de Status - Tons Suaves e Confortáveis
  success: {
    50: '#f0fdf4', // Verde muito claro
    100: '#dcfce7', // Verde claro
    200: '#bbf7d0', // Verde médio-claro
    300: '#86efac', // Verde médio
    400: '#4ade80', // Verde vibrante
    500: '#22c55e', // Verde principal
    600: '#16a34a', // Verde escuro
    700: '#15803d', // Verde muito escuro
    800: '#166534', // Verde escuro profundo
    900: '#14532d', // Verde mais escuro
  },

  warning: {
    50: '#fffbeb', // Amarelo muito claro
    100: '#fef3c7', // Amarelo claro
    200: '#fde68a', // Amarelo médio-claro
    300: '#fcd34d', // Amarelo médio
    400: '#fbbf24', // Amarelo vibrante
    500: '#f59e0b', // Amarelo principal
    600: '#d97706', // Amarelo escuro
    700: '#b45309', // Amarelo muito escuro
    800: '#92400e', // Amarelo escuro profundo
    900: '#78350f', // Amarelo mais escuro
  },

  error: {
    50: '#fef2f2', // Vermelho muito claro
    100: '#fee2e2', // Vermelho claro
    200: '#fecaca', // Vermelho médio-claro
    300: '#fca5a5', // Vermelho médio
    400: '#f87171', // Vermelho vibrante
    500: '#ef4444', // Vermelho principal
    600: '#dc2626', // Vermelho escuro
    700: '#b91c1c', // Vermelho muito escuro
    800: '#991b1b', // Vermelho escuro profundo
    900: '#7f1d1d', // Vermelho mais escuro
  },

  // Cores Especiais para Maternidade
  maternity: {
    // Tons de pele suaves
    skin: {
      50: '#fef7f0', // Pele muito clara
      100: '#fdeee0', // Pele clara
      200: '#fbdcc0', // Pele médio-clara
      300: '#f8c5a0', // Pele média
      400: '#f5a980', // Pele mais escura
      500: '#f28c60', // Pele principal
    },

    // Tons de bebê
    baby: {
      50: '#fef7ff', // Bebê muito claro
      100: '#fceeff', // Bebê claro
      200: '#f8d7ff', // Bebê médio-claro
      300: '#f2bfff', // Bebê médio
      400: '#e899ff', // Bebê vibrante
      500: '#dd73ff', // Bebê principal
    },

    // Tons de natureza
    nature: {
      50: '#f0fdf4', // Natureza muito clara
      100: '#dcfce7', // Natureza clara
      200: '#bbf7d0', // Natureza médio-clara
      300: '#86efac', // Natureza média
      400: '#4ade80', // Natureza vibrante
      500: '#22c55e', // Natureza principal
    },
  },
};

// Cores Semânticas para Uso no App
export const semanticColors = {
  // Fundos
  background: {
    primary: colors.neutral[50], // Fundo principal - branco quente
    secondary: colors.primary[50], // Fundo secundário - rosa muito claro
    tertiary: colors.secondary[50], // Fundo terciário - lavanda muito claro
    dark: colors.neutral[900], // Fundo escuro
    card: colors.neutral[100], // Fundo de cartões
    modal: 'rgba(0, 0, 0, 0.5)', // Fundo de modais
  },

  // Textos
  text: {
    primary: colors.neutral[900], // Texto principal
    secondary: colors.neutral[600], // Texto secundário
    tertiary: colors.neutral[500], // Texto terciário
    inverse: colors.neutral[50], // Texto em fundo escuro
    accent: colors.primary[600], // Texto de destaque
    disabled: colors.neutral[400], // Texto desabilitado
  },

  // Bordas
  border: {
    primary: colors.neutral[200], // Borda principal
    secondary: colors.neutral[300], // Borda secundária
    accent: colors.primary[300], // Borda de destaque
    focus: colors.primary[500], // Borda de foco
    error: colors.error[500], // Borda de erro
    success: colors.success[500], // Borda de sucesso
  },

  // Estados Interativos
  interactive: {
    primary: {
      default: colors.primary[500], // Botão primário padrão
      hover: colors.primary[600], // Botão primário hover
      active: colors.primary[700], // Botão primário ativo
      disabled: colors.neutral[300], // Botão primário desabilitado
    },
    secondary: {
      default: colors.secondary[500], // Botão secundário padrão
      hover: colors.secondary[600], // Botão secundário hover
      active: colors.secondary[700], // Botão secundário ativo
      disabled: colors.neutral[300], // Botão secundário desabilitado
    },
  },
};

// Gradientes Acolhedores
export const gradients = {
  primary: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
  secondary: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
  accent: 'linear-gradient(135deg, #3b82f6 0%, #22c55e 100%)',
  warm: 'linear-gradient(135deg, #fdf2f8 0%, #fef7f0 100%)',
  cool: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
  sunset: 'linear-gradient(135deg, #fef3c7 0%, #fce7f3 100%)',
  ocean: 'linear-gradient(135deg, #dbeafe 0%, #dcfce7 100%)',
  maternity: 'linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)',
};

// Cores para Modo Escuro
export const darkColors = {
  background: {
    primary: colors.neutral[900],
    secondary: colors.neutral[800],
    tertiary: colors.neutral[700],
    card: colors.neutral[800],
  },
  text: {
    primary: colors.neutral[50],
    secondary: colors.neutral[300],
    tertiary: colors.neutral[400],
    accent: colors.primary[300],
  },
  border: {
    primary: colors.neutral[700],
    secondary: colors.neutral[600],
    accent: colors.primary[400],
  },
};

export default colors;
