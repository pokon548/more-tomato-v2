/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'main-unsplash': "url('https://source.unsplash.com/random/1920x1080/?nature')",
      },
      transitionDuration: {
        '0': '0ms',
        '3000': '3000ms',
      },
      backdropBrightness: {
        65: '.65',
        175: '1.75',
      }
    },
  },
  plugins: [],
};
