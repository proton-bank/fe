/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        success: '#16A34A',
        error: '#DC2626',
        warning: '#F59E0B',
      },
      borderRadius: {
        card: '8px',
        input: '6px',
      },
    },
  },
  plugins: [],
}

