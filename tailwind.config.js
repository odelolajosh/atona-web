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
          DEFAULT: '#197CAE',
        },
        secondary: {
          DEFAULT: '#212225',
        },
        surface: {
          button: '#31312E',
          input: '#1A191B',
        },
        background: '#121113',
        foreground: '#EEEEF0',
        muted: {
          DEFAULT: '#363A3F',
          foreground: '#B5B2BC',
        },
        stroke: {
          DEFAULT: '#494844',
          separator: '#3C393F',
          input: '#323035',
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
    fontFamily: {
      sans: [
        '"Inter var", sans-serif',
        {
          fontVariationSettings: '"slnt" 0',
          fontOpticalSizing: 'auto',
        },
      ],
    },
  },
  plugins: [],
}