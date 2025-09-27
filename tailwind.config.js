/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: { sans: ['Raleway', 'ui-sans-serif', 'system-ui'] },
      colors: {
        bg: '#F7F7F7',
        panel: '#ECECEC',
        white: '#FCFCFC',
        ink: {
          900: '#1D1D1D',
          800: '#3B3B3B',
          700: '#5F5F5F',
          600: '#8B8B8B'
        },
        brand: {
          600: '#4C5E18',
          500: '#758A25'
        },
        lime: { accent: '#D5FB43' },
        /* Novas cores mapeadas às CSS vars */
        primary: {
          green: 'var(--primary-green)',
          'dark-green': 'var(--primary-dark-green)'
        },
        green: {
          50: 'var(--green-50)',
          100: 'var(--green-100)',
          200: 'var(--green-200)',
          300: 'var(--green-300)',
          400: 'var(--green-400)',
          500: 'var(--green-500)',
          600: 'var(--green-600)',
          700: 'var(--green-700)',
          800: 'var(--green-800)',
          900: 'var(--green-900)',
          950: 'var(--green-950)'
        },
        neutral: {
          50: 'var(--neutral-50)',
          100: 'var(--neutral-100)',
          200: 'var(--neutral-200)',
          300: 'var(--neutral-300)',
          400: 'var(--neutral-400)',
          500: 'var(--neutral-500)',
          600: 'var(--neutral-600)',
          700: 'var(--neutral-700)',
          800: 'var(--neutral-800)',
          900: 'var(--neutral-900)',
          950: 'var(--neutral-950)'
        }
      },
      borderRadius: { lg: '16px', md: '12px' },
      boxShadow: { card: '0 10px 30px rgba(0,0,0,0.10)' }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}

