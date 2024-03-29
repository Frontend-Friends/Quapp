/** @type {import("tailwindcss").Config} */

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        primary: '#D80062',
        secondary: '#57B894',
        tertiary: '#3F3D56',

        violetRed: {
          300: '#ff7bb8',
          600: '#D80062',
          900: '#990054',
          contrastText: '#fff',
        },
        mintGreen: {
          300: '#7fE2BD',
          600: '#57B894',
          900: '#4EA685',
          contrastText: '#fff',
        },
        blueishGray: {
          50: '#f1f0fa',
          100: '#dedcea',
          200: '#a29eb2',
          300: '#66647B',
          600: '#3F3D56',
          900: '#2F2E41',
          contrastText: '#fff',
        },
      },
    },
  },
  // eslint-disable-next-line import/no-extraneous-dependencies
  plugins: ['tailwindcss', 'postcss-preset-env', require('@tailwindcss/line-clamp'), require("tailwindcss-hyphens")],
}
