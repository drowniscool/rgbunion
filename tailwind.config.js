export default {
    darkMode: 'class',
    content: ['./src/**/*.{svelte,js,ts}'],
    theme: {
      extend: {
        blur: {
          'xs': '0.5px',
        },
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
        }
      }
    },
    plugins: []
  };