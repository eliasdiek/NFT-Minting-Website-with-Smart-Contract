const autoprefixer = require("autoprefixer")

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#001ed4',
        custom: '#00549f',
        'green-overlay': 'rgba(27,179,235,0.55)',
        background: {
          dark: '#424242',
          primary: '#001ed4',
          secondary: '#25efcb'
        },
        copy: {
          primary: '#000000',
          dark: '#333333',
          secondary: '#486066',
          overlay: 'rgba(0, 0, 0, .6)'
        }
      }
    }
  },
  corePlugins: {
    container: false
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.container': {
          width: '90%',
          maxWidth: '90%',
          marginLeft: 'auto',
          marginRight: 'auto',
          '@screen sm': {
            maxWidth: '72rem',
          },
          '@screen md': {
            maxWidth: '72rem',
          },
          '@screen lg': {
            maxWidth: '72rem',
          },
          '@screen xl': {
            maxWidth: '72rem',
          },
        }
      })
    }
  ],
}
