/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#010205",
        cream: "#F8F5EF",
        blue: "#1D99F2",
        "deep-blue": "#1932BB",
        violet: "#5336EF"
      },
      fontFamily: {
        sans: ["Space Grotesk", "system-ui", "sans-serif"],
        serif: ["Fraunces", "serif"],
        mono: ["JetBrains Mono", "monospace"]
      },
      boxShadow: {
        bb: "0 24px 60px rgba(1, 2, 5, 0.12)",
        soft: "0 10px 24px rgba(1, 2, 5, 0.06)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(16px)" }
        }
      },
      animation: {
        float: "float 8s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
