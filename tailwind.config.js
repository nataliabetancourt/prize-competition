const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-neue-montreal)', ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        "desktop": "1200px",
      },
      colors: {
        'BgSlate': '#EDEDED',
        'TextBlack': '#111111',
        'TitlePurple': '#2A3EF4',
        'Subtitle': '#424242',
        'TextSecondary-100': '#D9D9D9',
        'TextSecondary-200': '#7E7E7E',
        'TextSecondary-300': '#A5A5A5',
        'BgOrange' : '#A14E05'
      },
    },
  },
  plugins: [],
};