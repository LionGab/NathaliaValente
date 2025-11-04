/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Sistema de Cores Minimalista - ClubNath VIP
        // Inspirado em: Flo, Ovia, Linear, Vercel
        primary: {
          50: '#fdf8f6',   // Areia muito clara - backgrounds principais
          100: '#f9f1ed',  // Blush suave - cards e containers
          200: '#f3e4dd',  // Rosa areia - hover states
          300: '#e8cec1',  // Terracota suave - borders
          400: '#d4a896',  // Rosé suave - elementos interativos
          500: '#c08774',  // Rosé médio - cor principal (MUITO MAIS SUAVE)
          600: '#a67563',  // Terracota médio - textos importantes
          700: '#8b6352',  // Terracota escuro - headings
          800: '#6d4f42',  // Marrom suave - textos escuros
          900: '#4a3529',  // Marrom profundo - títulos
        },
        secondary: {
          50: '#faf9fb',   // Lavanda gelo - muito sutil
          100: '#f4f2f7',  // Lavanda nuvem
          200: '#e9e5f0',  // Lavanda suave
          300: '#d4cde3',  // Lilás areia
          400: '#b8aed0',  // Lilás suave
          500: '#9d8fbc',  // Lilás médio (MUITO MAIS SUAVE)
          600: '#8577a8',  // Lilás profundo
          700: '#6e6290',  // Roxo suave
          800: '#584f73',  // Roxo médio
          900: '#3d3650',  // Roxo profundo
        },
        accent: {
          50: '#f7f9fb',   // Cinza azulado muito claro
          100: '#eff3f7',  // Cinza azulado
          200: '#dfe7ef',  // Azul gelo
          300: '#c4d5e3',  // Azul nuvem
          400: '#a0b9d1',  // Azul suave
          500: '#7d9cbe',  // Azul médio (MUITO MAIS SUAVE)
          600: '#6484a8',  // Azul profundo
          700: '#526d8e',  // Azul escuro
          800: '#405671',  // Azul muito escuro
          900: '#2d3d4f',  // Azul profundo
        },
        neutral: {
          0: '#ffffff',    // Branco puro
          50: '#fafafa',   // Off-white - background principal
          100: '#f5f5f5',  // Cinza gelo - cards
          200: '#eeeeee',  // Cinza claro - dividers
          300: '#e0e0e0',  // Cinza médio-claro - borders
          400: '#bdbdbd',  // Cinza médio - placeholders
          500: '#9e9e9e',  // Cinza - textos secundários
          600: '#757575',  // Cinza escuro - textos
          700: '#616161',  // Cinza muito escuro - headings
          800: '#424242',  // Quase preto - títulos
          900: '#212121',  // Preto suave - textos principais
        },
        success: {
          50: '#f6faf7',   // Verde gelo
          100: '#e8f5ec',  // Verde nuvem
          200: '#d1ebd9',  // Verde suave
          300: '#a8d9ba',  // Verde claro
          400: '#7ec497',  // Verde médio
          500: '#5dad7b',  // Verde principal (SUAVE)
          600: '#4a9164',  // Verde profundo
          700: '#3d7653',  // Verde escuro
          800: '#315c43',  // Verde muito escuro
          900: '#254232',  // Verde profundo
        },
        warning: {
          50: '#fdfaf5',   // Âmbar gelo
          100: '#faf4e8',  // Âmbar nuvem
          200: '#f5e8d1',  // Âmbar suave
          300: '#ecd5a8',  // Âmbar claro
          400: '#dfbe7e',  // Âmbar médio
          500: '#d1a65c',  // Âmbar principal (SUAVE)
          600: '#b88e4b',  // Âmbar profundo
          700: '#99763e',  // Âmbar escuro
          800: '#795d32',  // Âmbar muito escuro
          900: '#594526',  // Âmbar profundo
        },
        error: {
          50: '#fdf6f6',   // Coral gelo
          100: '#faecec',  // Coral nuvem
          200: '#f5d8d8',  // Coral suave
          300: '#ecb8b8',  // Coral claro
          400: '#df9090',  // Coral médio
          500: '#d16d6d',  // Coral principal (SUAVE)
          600: '#b85a5a',  // Coral profundo
          700: '#994a4a',  // Coral escuro
          800: '#7a3b3b',  // Coral muito escuro
          900: '#5b2d2d',  // Coral profundo
        },
        // Cores Especiais Minimalistas para Maternidade
        maternity: {
          skin: {
            50: '#fdfaf8',   // Pele porcelana
            100: '#faf4f0',  // Pele nuvem
            200: '#f5e8dd',  // Pele areia
            300: '#ead5c4',  // Pele suave
            400: '#d9baa3',  // Pele rosada
            500: '#c8a184',  // Pele principal (SUAVE)
          },
          baby: {
            50: '#fdfafc',   // Bebê nuvem
            100: '#faf5f9',  // Bebê gelo
            200: '#f5eaf4',  // Bebê suave
            300: '#ead5e8',  // Bebê claro
            400: '#d9b8d6',  // Bebê rosé
            500: '#c89cc4',  // Bebê principal (SUAVE)
          },
          nature: {
            50: '#f8faf8',   // Natureza gelo
            100: '#f0f5f0',  // Natureza nuvem
            200: '#e1ebe1',  // Natureza suave
            300: '#c8d9c8',  // Natureza clara
            400: '#a7c3a7',  // Natureza média
            500: '#8aad8a',  // Natureza principal (SUAVE)
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
        // Mobile-optimized typography
        'mobile-xs': ['0.75rem', { lineHeight: '1.5' }],
        'mobile-sm': ['0.875rem', { lineHeight: '1.5' }],
        'mobile-base': ['1rem', { lineHeight: '1.6' }],
        'mobile-lg': ['1.125rem', { lineHeight: '1.6' }],
        'mobile-xl': ['1.25rem', { lineHeight: '1.5' }],
        'mobile-2xl': ['1.5rem', { lineHeight: '1.4' }],
        'mobile-3xl': ['1.875rem', { lineHeight: '1.3' }],
        'mobile-4xl': ['2.25rem', { lineHeight: '1.2' }],
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
        // Mobile-optimized shadows
        'mobile-soft': '0 1px 8px -2px rgba(0, 0, 0, 0.05), 0 4px 12px -2px rgba(0, 0, 0, 0.03)',
        'mobile-medium': '0 2px 12px -3px rgba(0, 0, 0, 0.08), 0 4px 8px -2px rgba(0, 0, 0, 0.03)',
        'mobile-large': '0 4px 20px -4px rgba(0, 0, 0, 0.12), 0 8px 16px -4px rgba(0, 0, 0, 0.08)',
      },
      spacing: {
        // Mobile-optimized spacing
        'mobile-xs': '0.25rem',   // 4px
        'mobile-sm': '0.5rem',    // 8px
        'mobile-md': '0.75rem',   // 12px
        'mobile-lg': '1rem',      // 16px
        'mobile-xl': '1.25rem',   // 20px
        'mobile-2xl': '1.5rem',   // 24px
        'mobile-3xl': '2rem',     // 32px
        'mobile-4xl': '2.5rem',   // 40px
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
