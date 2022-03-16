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
          light: '#f6f9fb',
          lighter: '#fafbfc',
          overlay: 'rgba(0,19,84,0.3)'
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
        '17px': '17px',
        'llg': '19px',
        'xxl': '22px',
        '3xxl': '2rem',
        '4xxl': '2.5rem'
      },
      borderWidth: {
        '3': '3px'
      },
      margin: {
        '1px': '1px',
        '2px': '2px',
        '3px': '3px'
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
        },
        '.container-lg': {
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
            maxWidth: '80rem',
          },
          '@screen xl': {
            maxWidth: '80rem',
          },
        },
        '.copy-shadow-sm': {
          textShadow: '0em 0.1em 0.1em rgb(0 0 0 / 40%)'
        },
        '.card': {
          boxShadow: '0 1px 1px 0 rgb(0 0 0 / 12%), 0 2px 10px 0 rgb(0 0 0 / 7%)'
        },
        '.card-2': {
          boxShadow: '0 2px 5px 0 rgb(0 0 0 / 16%), 0 2px 10px 0 rgb(0 0 0 / 12%)'
        },
        '.card-4': {
          boxShadow: '0 4px 10px 0 rgb(0 0 0 / 20%), 0 4px 20px 0 rgb(0 0 0 / 19%)'
        }
      })
    }
  ],
}
