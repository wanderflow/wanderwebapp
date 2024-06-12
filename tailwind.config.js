/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Lato", "sans-serif"],
        magra: ["Magra", "sans-serif"],
      },
      transitionDuration: {
        '3000': '3000ms',
        '10000': '10000ms',
      },
      backgroundImage: {
        "custom-gradient": "linear-gradient(270deg, #5897FF 0%, #B19FFF 100%)",
        "button-gradient":
          "linear-gradient(to right, #b1ecef, #fff7e7, #ffd585)",
      },
      colors: {
        purple: "#7461FF",
        green: "#419B0A",
        red: "#E56D6D",
        gray: {
          DEFAULT: "#6E6E6E",
          100: "#D9D9D9",
          200: "#8391A1",
        },
        zinc: "#101010",
      },
    },
  },
  plugins: [],
};
