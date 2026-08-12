/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          dark: '#0F172A',
          card: '#1E293B',
          gold: '#D4AF37',
          goldLight: '#F3E5AB',
          accent: '#9A7B38'
        },
        kerala: {
          terracotta: '#C85A32',
          emerald: '#1B4D3E',
          sand: '#F7F3E9',
          warmWood: '#5C3D2E',
          accent: '#D97706'
        },
        modern: {
          primary: '#2563EB',
          secondary: '#0EA5E9',
          dark: '#1E293B',
          slate: '#F8FAFC'
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Merriweather', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
