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
          secondary: '#25efcb',
          light: '#f6f9fb'
        },
        copy: {
          primary: '#000000',
          dark: '#333333',
          darker: '#666666',
          secondary: '#486066',
          overlay: 'rgba(0, 0, 0, .6)'
        },
        shadow: 'rgb(0 0 0 / 10%)'
      },
      fontSize: {
        '17px': '17px'
      }
    },
    fontFamily: {
      robo: [
        'Roboto',
        'Helvetica',
        'Arial',
        'Lucida',
        'sans-serif'
      ],
      muli: [
        'Mulish',
        'Helvetica',
        'Arial',
        'Lucida',
        'sans-serif'
      ],
      pop: [
        'Poppins',
        'Helvetica',
        'Arial',
        'Lucida',
        'sans-serif'
      ],
      abel: [
        'Abel',
        'Helvetica',
        'Arial',
        'Lucida',
        'sans-serif'
      ]
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
