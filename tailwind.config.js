module.exports = {
  mode: "jit",
  purge: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkmode: false,
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
      },
    },
  },
  colors: {
    "ltorange": "#F6851B"
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
