export default {
    darkMode: 'class',
    content: ['./src/**/*.{svelte,js,ts}'],
    theme: {
      extend: {
        // Enhanced typography system
        fontFamily: {
          'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
          'inter': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
          'cinzel': ['Cinzel', '"Times New Roman"', 'serif'],
        },

        // Responsive typography scale
        fontSize: {
          'xs': ['0.75rem', { lineHeight: '1rem' }],
          'sm': ['0.875rem', { lineHeight: '1.25rem' }],
          'base': ['1rem', { lineHeight: '1.5rem' }],
          'lg': ['1.125rem', { lineHeight: '1.75rem' }],
          'xl': ['1.25rem', { lineHeight: '1.75rem' }],
          '2xl': ['1.5rem', { lineHeight: '2rem' }],
          '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
          '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
          '5xl': ['3rem', { lineHeight: '1' }],
          '6xl': ['3.75rem', { lineHeight: '1' }],
          '7xl': ['4.5rem', { lineHeight: '1' }],
          '8xl': ['6rem', { lineHeight: '1' }],
          '9xl': ['8rem', { lineHeight: '1' }],
          // Responsive display sizes using clamp()
          'display-sm': 'clamp(2.25rem, 2.5vw + 1.5rem, 3rem)',
          'display-md': 'clamp(3rem, 3vw + 2rem, 4.5rem)',
          'display-lg': 'clamp(4.5rem, 4vw + 3rem, 6rem)',
        },

        // Enhanced letter spacing
        letterSpacing: {
          'tighter': '-0.05em',
          'tight': '-0.025em',
          'normal': '0em',
          'wide': '0.025em',
          'wider': '0.05em',
          'widest': '0.1em',
        },

        // Material-inspired blur and effects
        blur: {
          'xs': '0.5px',
          'glass': '20px',
        },

        // Enhanced shadows for Material feel
        boxShadow: {
          'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          'elevation-1': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          'elevation-2': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          'elevation-3': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          'elevation-4': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          'elevation-5': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          'gold-glow': '0 0 20px rgba(191, 149, 63, 0.3)',
          'gold-glow-lg': '0 0 40px rgba(191, 149, 63, 0.4)',
        },

        // Enhanced border radius for modern feel
        borderRadius: {
          'xs': '0.125rem',
          'sm': '0.25rem',
          'md': '0.375rem',
          'lg': '0.5rem',
          'xl': '0.75rem',
          '2xl': '1rem',
          '3xl': '1.5rem',
          '4xl': '2rem',
        },

        // Enhanced color palette
        colors: {
          primary: '#d4af37',
          secondary: '#c4a430',
          background: '#1f1f27',
          surface: '#25252f',
          text: '#FFFFFF',
          textSecondary: '#d4af37',
          textTertiary: '#888888',
          border: '#333340',
          hover: '#2a2a35',
          inputBackground: '#25252f',
          headerBackground: '#1f1f27',

          // Material-inspired surface colors
          'surface-dim': '#0f1419',
          'surface-bright': '#2c3036',
          'surface-container-lowest': '#0a0e13',
          'surface-container-low': '#171b20',
          'surface-container': '#1b2026',
          'surface-container-high': '#252a30',
          'surface-container-highest': '#30353b',

          // Enhanced gold palette
          gold: {
            50: '#fefdf6',
            100: '#fefaeb',
            200: '#fcf6ba',
            300: '#f7ec8a',
            400: '#f1dc5a',
            500: '#d4af37',
            600: '#b38728',
            700: '#93651f',
            800: '#754a1a',
            900: '#5c3916',
            950: '#3d240e',
          },

          // Keep the dark variant for explicitly dark mode usage if needed
          dark: {
            primary: '#d4af37',
            secondary: '#c4a430',
            background: '#1f1f27',
            surface: '#25252f',
            text: '#FFFFFF',
            textSecondary: '#d4af37',
            textTertiary: '#888888',
            border: '#333340',
            hover: '#2a2a35',
            inputBackground: '#25252f',
            headerBackground: '#1f1f27'
          }
        },

        // Animation and transition timing
        transitionDuration: {
          '250': '250ms',
          '350': '350ms',
          '400': '400ms',
        },

        // Custom transition timing functions
        transitionTimingFunction: {
          'ease-spring': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          'ease-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          'ease-sharp': 'cubic-bezier(0.4, 0, 0.6, 1)',
          'ease-emphasized': 'cubic-bezier(0.2, 0, 0, 1)',
        },

        // Enhanced backdrop blur
        backdropBlur: {
          'glass': '20px',
          'heavy': '40px',
        },
      }
    },
    plugins: []
  };