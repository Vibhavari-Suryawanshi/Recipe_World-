/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        saffron: "#F2A93B",
        chili: "#E1483A",
        basil: "#3E7A52",
        cardamom: "#FBF2E4",
        charcoal: "#191510",
        cinnamon: "#2A2118",
        ink: "#241C14",
        steam: "#F5EFE3",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Work Sans'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-18px) rotate(4deg)" },
        },
        floatySlow: {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
          "50%": { transform: "translateY(-12px) translateX(10px)" },
        },
        riseFade: {
          "0%": { transform: "translateY(0) scale(0.6)", opacity: "0" },
          "20%": { opacity: "0.9" },
          "100%": { transform: "translateY(-60px) scale(1.4)", opacity: "0" },
        },
        bubble: {
          "0%": { transform: "translateY(0) scale(0.4)", opacity: "0" },
          "30%": { opacity: "1" },
          "100%": { transform: "translateY(-40px) scale(1)", opacity: "0" },
        },
        flicker: {
          "0%, 100%": { transform: "scaleY(1) scaleX(1)", opacity: "1" },
          "50%": { transform: "scaleY(1.15) scaleX(0.92)", opacity: "0.85" },
        },
        spin3d: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        floatySlow: "floatySlow 9s ease-in-out infinite",
        riseFade: "riseFade 2.2s ease-in infinite",
        bubble: "bubble 1.6s ease-in infinite",
        flicker: "flicker 0.6s ease-in-out infinite",
        spin3d: "spin3d 3s linear infinite",
      },
    },
  },
  plugins: [],
};
