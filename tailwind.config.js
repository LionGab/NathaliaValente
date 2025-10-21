/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Anthropic-inspired color palette
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
      // Mobile-optimized spacing for touch targets (minimum 44px)
      spacing: {
        'touch': '2.75rem', // 44px minimum touch target
        'touch-sm': '2.5rem', // 40px for smaller touch targets
        'touch-lg': '3rem', // 48px for larger touch targets
      },
      // Mobile-optimized minimum sizes
      minHeight: {
        'touch': '2.75rem', // 44px
        'touch-sm': '2.5rem', // 40px
        'touch-lg': '3rem', // 48px
      },
      minWidth: {
        'touch': '2.75rem', // 44px
        'touch-sm': '2.5rem', // 40px
        'touch-lg': '3rem', // 48px
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'slideDown': 'slideDown 0.3s ease-out',
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
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    // Add custom mobile-optimized utilities
    function({ addUtilities }) {
      addUtilities({
        // Prevent text zoom on iOS inputs
        '.text-base-mobile': {
          'font-size': '16px', // Prevents iOS zoom on input focus
        },
        // Smooth scrolling optimizations
        '.scroll-smooth-mobile': {
          '-webkit-overflow-scrolling': 'touch',
          'scroll-behavior': 'smooth',
        },
        // Hardware acceleration
        '.gpu-accelerated': {
          'transform': 'translateZ(0)',
          'will-change': 'transform',
        },
        // Touch action optimizations
        '.touch-pan-y': {
          'touch-action': 'pan-y',
        },
        '.touch-pan-x': {
          'touch-action': 'pan-x',
        },
        // Safe area padding for notched devices
        '.safe-top': {
          'padding-top': 'env(safe-area-inset-top)',
        },
        '.safe-bottom': {
          'padding-bottom': 'env(safe-area-inset-bottom)',
        },
        '.safe-left': {
          'padding-left': 'env(safe-area-inset-left)',
        },
        '.safe-right': {
          'padding-right': 'env(safe-area-inset-right)',
        },
      });
    },
  ],
};
