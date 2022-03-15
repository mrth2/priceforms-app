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
          secondary: '#000',
          button: '#4690CB',
          review: '#F6E34D',
          outline: '#BFBFBF'
        }
      },
      maxWidth: {
        '1/2': '50%',
        '1/3': '33.333333%',
        '2/3': '66.666667%',
        form: '1024px'
      }
    },
  },
  plugins: [],
}
