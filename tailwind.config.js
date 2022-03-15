module.exports = {
  content: [
    './assets/**/*.{vue,js,css}',
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        catania: {
          primary: '#143050',
          button: '#4690CB',
          review: '#F6E34D',
          outline: '#BFBFBF'
        }
      }
    },
  },
  plugins: [],
}
