/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'rosa-viejo': '#c4a0a0',
        'rosa-claro': '#dfc5c5',
        'rosa-hover': '#b8908f',
        'verde-seco': '#a3aa8e',
        'verde-claro': '#c5cbaf',
        'verde-hover': '#8f966e',
        'beige-1': '#f5efe6',
        'beige-2': '#ede4d8',
        'beige-3': '#e2d5c5',
        crema: '#faf7f2',
        texto: '#5a4a42',
        'texto-suave': '#8a7a72',
        blanco: '#fffcf8',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
