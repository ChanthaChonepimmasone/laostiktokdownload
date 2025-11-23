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
          DEFAULT: '#4A90E2',
          light: '#7BB0F0',
          dark: '#357ABD',
        },
        secondary: '#FF6B6B',
        light: '#F8FAFF',
        dark: '#2C3E50',
        gray: '#7F8C8D',
        'light-gray': '#ECF0F1',
        success: '#27AE60',
        warning: '#F39C12',
        danger: '#E74C3C',
        'laos-blue': '#002868',
        'laos-red': '#CE1126',
      },
      fontFamily: {
        sans: ['Noto Sans Lao', 'Segoe UI', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
