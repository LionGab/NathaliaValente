/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Esquema de Cores Acolhedor para Mães - Nossa Maternidade
        primary: {
          50: '#fdf2f8',   // Rosa muito claro - fundos suaves
          100: '#fce7f3',  // Rosa claro - elementos de destaque suave
          200: '#fbcfe8',  // Rosa médio-claro - hover states
          300: '#f9a8d4',  // Rosa médio - elementos interativos
          400: '#f472b6',  // Rosa vibrante - CTAs principais
          500: '#ec4899',  // Rosa principal - marca
          600: '#db2777',  // Rosa escuro - texto em contraste
          700: '#be185d',  // Rosa muito escuro - elementos de destaque
          800: '#9d174d',  // Rosa escuro profundo
          900: '#831843',  // Rosa mais escuro - texto principal
        },
        secondary: {
          50: '#faf5ff',   // Lavanda muito claro
          100: '#f3e8ff',  // Lavanda claro
          200: '#e9d5ff',  // Lavanda médio-claro
          300: '#d8b4fe',  // Lavanda médio
          400: '#c084fc',  // Lavanda vibrante
          500: '#a855f7',  // Lavanda principal
          600: '#9333ea',  // Lavanda escuro
          700: '#7c3aed',  // Lavanda muito escuro
          800: '#6b21a8',  // Lavanda escuro profundo
          900: '#581c87',  // Lavanda mais escuro
        },
        accent: {
          50: '#eff6ff',   // Azul muito claro
          100: '#dbeafe',  // Azul claro
          200: '#bfdbfe',  // Azul médio-claro
          300: '#93c5fd',  // Azul médio
          400: '#60a5fa',  // Azul vibrante
          500: '#3b82f6',  // Azul principal
          600: '#2563eb',  // Azul escuro
          700: '#1d4ed8',  // Azul muito escuro
          800: '#1e40af',  // Azul escuro profundo
          900: '#1e3a8a',  // Azul mais escuro
        },
        neutral: {
          0: '#ffffff',
          50: '#fafaf9',   // Branco quente
          100: '#f5f5f4',  // Cinza muito claro
          200: '#e7e5e4',  // Cinza claro
          300: '#d6d3d1',  // Cinza médio-claro
          400: '#a8a29e',  // Cinza médio
          500: '#78716c',  // Cinza médio-escuro
          600: '#57534e',  // Cinza escuro
          700: '#44403c',  // Cinza muito escuro
          800: '#292524',  // Cinza escuro profundo
          900: '#1c1917',  // Cinza mais escuro
        },
        success: {
          50: '#f0fdf4',   // Verde muito claro
          100: '#dcfce7',  // Verde claro
          200: '#bbf7d0',  // Verde médio-claro
          300: '#86efac',  // Verde médio
          400: '#4ade80',  // Verde vibrante
          500: '#22c55e',  // Verde principal
          600: '#16a34a',  // Verde escuro
          700: '#15803d',  // Verde muito escuro
          800: '#166534',  // Verde escuro profundo
          900: '#14532d',  // Verde mais escuro
        },
        warning: {
          50: '#fffbeb',   // Amarelo muito claro
          100: '#fef3c7',  // Amarelo claro
          200: '#fde68a',  // Amarelo médio-claro
          300: '#fcd34d',  // Amarelo médio
          400: '#fbbf24',  // Amarelo vibrante
          500: '#f59e0b',  // Amarelo principal
          600: '#d97706',  // Amarelo escuro
          700: '#b45309',  // Amarelo muito escuro
          800: '#92400e',  // Amarelo escuro profundo
          900: '#78350f',  // Amarelo mais escuro
        },
        error: {
          50: '#fef2f2',   // Vermelho muito claro
          100: '#fee2e2',  // Vermelho claro
          200: '#fecaca',  // Vermelho médio-claro
          300: '#fca5a5',  // Vermelho médio
          400: '#f87171',  // Vermelho vibrante
          500: '#ef4444',  // Vermelho principal
          600: '#dc2626',  // Vermelho escuro
          700: '#b91c1c',  // Vermelho muito escuro
          800: '#991b1b',  // Vermelho escuro profundo
          900: '#7f1d1d',  // Vermelho mais escuro
        },
        // Cores Especiais para Maternidade
        maternity: {
          skin: {
            50: '#fef7f0',   // Pele muito clara
            100: '#fdeee0',  // Pele clara
            200: '#fbdcc0',  // Pele médio-clara
            300: '#f8c5a0',  // Pele média
            400: '#f5a980',  // Pele mais escura
            500: '#f28c60',  // Pele principal
          },
          baby: {
            50: '#fef7ff',   // Bebê muito claro
            100: '#fceeff',  // Bebê claro
            200: '#f8d7ff',  // Bebê médio-claro
            300: '#f2bfff',  // Bebê médio
            400: '#e899ff',  // Bebê vibrante
            500: '#dd73ff',  // Bebê principal
          },
          nature: {
            50: '#f0fdf4',   // Natureza muito clara
            100: '#dcfce7',  // Natureza clara
            200: '#bbf7d0',  // Natureza médio-clara
            300: '#86efac',  // Natureza média
            400: '#4ade80',  // Natureza vibrante
            500: '#22c55e',  // Natureza principal
          }
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'sm': ['0.875rem', { lineHeight: '1.6', letterSpacing: '0.01em' }],
        'base': ['1rem', { lineHeight: '1.7', letterSpacing: '0' }],
        'lg': ['1.125rem', { lineHeight: '1.7', letterSpacing: '0' }],
        'xl': ['1.25rem', { lineHeight: '1.6', letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '1.5', letterSpacing: '-0.02em' }],
        '3xl': ['1.875rem', { lineHeight: '1.4', letterSpacing: '-0.02em' }],
        '4xl': ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.03em' }],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'large': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 20px rgba(221, 87, 255, 0.3)',
        'glow-pink': '0 0 20px rgba(255, 59, 79, 0.3)',
        'glow-orange': '0 0 20px rgba(249, 115, 22, 0.3)',
      },
      animation: {
        // ClubNath Design System Animations
        'fade-in': 'fadeIn 0.4s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'fade-in-left': 'fadeInLeft 0.6s ease-out',
        'fade-in-right': 'fadeInRight 0.6s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'slide-left': 'slideLeft 0.4s ease-out',
        'slide-right': 'slideRight 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'scale-out': 'scaleOut 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'bounce-out': 'bounceOut 0.6s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'pulse-slow': 'pulseSlow 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'floatSlow 4s ease-in-out infinite',
        'float-fast': 'floatFast 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'shimmer-slow': 'shimmerSlow 3s ease-in-out infinite',
        'gradient': 'gradient 3s ease-in-out infinite',
        'gradient-slow': 'gradientSlow 5s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
        'shake-vertical': 'shakeVertical 0.5s ease-in-out',
        'wobble': 'wobble 1s ease-in-out',
        'rotate-in': 'rotateIn 0.6s ease-out',
        'rotate-out': 'rotateOut 0.6s ease-out',
        'spin-reverse': 'spinReverse 1s linear infinite',
      },
      keyframes: {
        // ClubNath Design System Keyframes
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        scaleOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.95)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceOut: {
          '20%': { transform: 'scale(1.1)' },
          '50%, 55%': { opacity: '1', transform: 'scale(1.1)' },
          '100%': { opacity: '0', transform: 'scale(0.3)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(221, 87, 255, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(221, 87, 255, 0.6)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(221, 87, 255, 0.3)' },
          '50%': { boxShadow: '0 0 60px rgba(221, 87, 255, 0.8)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(1deg)' },
          '75%': { transform: 'rotate(-1deg)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        pulseGlow: {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 20px rgba(221, 87, 255, 0.3)',
          },
          '50%': {
            opacity: '0.8',
            boxShadow: '0 0 40px rgba(221, 87, 255, 0.6)',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        floatFast: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-30px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        shimmerSlow: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        gradientSlow: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
        },
        shakeVertical: {
          '0%, 100%': { transform: 'translateY(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateY(-10px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateY(10px)' },
        },
        wobble: {
          '0%': { transform: 'translateX(0%)' },
          '15%': { transform: 'translateX(-25%) rotate(-5deg)' },
          '30%': { transform: 'translateX(20%) rotate(3deg)' },
          '45%': { transform: 'translateX(-15%) rotate(-3deg)' },
          '60%': { transform: 'translateX(10%) rotate(2deg)' },
          '75%': { transform: 'translateX(-5%) rotate(-1deg)' },
          '100%': { transform: 'translateX(0%)' },
        },
        rotateIn: {
          '0%': { opacity: '0', transform: 'rotate(-180deg)' },
          '100%': { opacity: '1', transform: 'rotate(0deg)' },
        },
        rotateOut: {
          '0%': { opacity: '1', transform: 'rotate(0deg)' },
          '100%': { opacity: '0', transform: 'rotate(180deg)' },
        },
        spinReverse: {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
      },
    },
  },
  plugins: [],
};
