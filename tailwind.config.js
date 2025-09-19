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
        lime: { accent: '#D5FB43' }
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

