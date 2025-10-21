/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Design System Colors
        primary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
          950: '#500724'
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764'
        },
        neutral: {
          0: '#ffffff',
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a'
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d'
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309'
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c'
        },
        info: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8'
        },
        // NathClub - Paleta atualizada para bem-estar feminino (legacy)
        nath: {
          pink: {
            50: '#FFF1F4',
            100: '#FFE4E8',
            200: '#FECDD6',
            300: '#FCA5B4',
            400: '#FB7185',
            500: '#F43F5E',
            600: '#E11D48',
            700: '#BE123C',
            800: '#9F1239',
            900: '#881337',
          },
          lavender: {
            50: '#FAF5FF',
            100: '#F3E8FF',
            200: '#E9D5FF',
            300: '#D8B4FE',
            400: '#C084FC',
            500: '#A855F7',
            600: '#9333EA',
          },
          peach: {
            50: '#FFF7ED',
            100: '#FFEDD5',
            200: '#FED7AA',
            300: '#FDBA74',
            400: '#FB923C',
            500: '#F97316',
            600: '#EA580C',
          },
          cream: {
            50: '#FEFDFB',
            100: '#FDF9F5',
            200: '#FBF3EB',
            300: '#F7EBE0',
            400: '#F0DCC9',
          },
        },
        // Anthropic-inspired color palette (mantido para compatibilidade)
        claude: {
          // Primary orange/coral tones (similar to Anthropic's brand)
          orange: {
            50: '#FFF7F5',
            100: '#FFEDE8',
            200: '#FFD7CC',
            300: '#FFBCA8',
            400: '#FF9B7A',
            500: '#E77A5C', // Main accent
            600: '#CC6B52',
            700: '#B35A45',
            800: '#8F4838',
            900: '#6B362A',
          },
          // Neutral grays
          gray: {
            50: '#FAFAF9',
            100: '#F5F5F4',
            200: '#E7E5E4',
            300: '#D6D3D1',
            400: '#A8A29E',
            500: '#78716C',
            600: '#57534E',
            700: '#44403C',
            800: '#292524',
            900: '#1C1917',
            950: '#0C0A09',
          },
          // Warm background tones
          cream: {
            50: '#FEFDFB',
            100: '#FDF9F5',
            200: '#FBF3EB',
            300: '#F7EBE0',
            400: '#F0DCC9',
          },
        },
        // Legacy peanut colors for compatibility
        peanut: {
          coral: '#E77A5C',
          'coral-light': '#FF9B7A',
          'coral-lighter': '#FFBCA8',
          peach: '#FFD7CC',
          cream: '#FEFDFB',
          sand: '#F7EBE0',
          gray: {
            50: '#FAFAF9',
            100: '#F5F5F4',
            200: '#E7E5E4',
            300: '#D6D3D1',
            400: '#A8A29E',
            500: '#78716C',
            600: '#57534E',
            700: '#44403C',
            800: '#292524',
            900: '#1C1917',
          },
        },
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
        'claude-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 3px 0 rgba(0, 0, 0, 0.02)',
        'claude': '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'claude-md': '0 4px 16px -4px rgba(0, 0, 0, 0.06), 0 8px 24px -4px rgba(0, 0, 0, 0.05)',
        'claude-lg': '0 8px 32px -8px rgba(0, 0, 0, 0.08), 0 12px 48px -8px rgba(0, 0, 0, 0.06)',
        // Legacy
        'peanut-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 3px 0 rgba(0, 0, 0, 0.02)',
        'peanut': '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'peanut-lg': '0 4px 16px -4px rgba(0, 0, 0, 0.06), 0 8px 24px -4px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
