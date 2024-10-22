/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}', './node_modules/flowbite/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        Inter: ['Inter'],
        BugeeTint: ['Bungee Tint']
      }
    }
  },
  plugins: [require('daisyui'), require('flowbite/plugin')],
  daisyui: {
    themes: [
      'light',
      'dark',
      'cupcake',
      'valentine',
      'halloween',
      'forest',
      'aqua',
      'lofi',
      'pastel',
      'fantasy',
      'wireframe',
      'black',
      'luxury',
      'dracula',
      'cmyk',
      'autumn',
      'business',
      'acid',
      'lemonade',
      'night',
      'coffee',
      'winter'
    ]
  }
}
