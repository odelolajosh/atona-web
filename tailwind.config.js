/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '202120',
        },
        secondary: {
          DEFAULT: '#F7F7F7',
        },
        surface: {
          button: '#31312E',
        },
        background: '#111110',
        foreground: '#EEEEEC',
        muted: {
          DEFAULT: '#6E6C66',
          foreground: '#B5B3AD',
        },
        stroke: {
          DEFAULT: '#494844',
          1: '#494844',
          2: '#62605B'
        },
        overlay: '#00000089',
        success: '#A8F5E5',
        warning: '#FFA057',
        info: '#3E63DD',
        error: '#E5484D',
      },
      keyframes: {
        overlayShow: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        contentShow: {
          from: { opacity: 0, transform: 'translate(-50%, -48%) scale(0.96)' },
          to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
        },
      },
      animation: {
        overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}