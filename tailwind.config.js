/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: "hsla(0, 0%, 100%, 0.65)",
        heading: "#ffffff",
        primary: "#cdf80a",
        lighter: "#1f1f1f",
        black: "#070707",
        border: "hsla(0, 0%, 100%, 0.1)",
      },

      fontFamily: {
        inter: ["Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        arabic: ["NotoKufiArabic", "sans-serif"],
      },

      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeInOut: {
          "0%, 100%": { opacity: "0" },
          "50%": { opacity: "1" },
        },
        fadeOpacity: {
          "0%, 100%": { opacity: "0" },
          "50%": { opacity: "1" },
        },
      },

      animation: {
        marquee: "marquee 15s linear infinite",
        fadeInOut: "fadeInOut 6s ease-in-out infinite",
        fadeOpacity: "fadeOpacity 10s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
