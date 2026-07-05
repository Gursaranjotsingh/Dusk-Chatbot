/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        dusk: {
          50: "#F5F4FB",
          100: "#EFEDF9",
          200: "#DCD9F2",
          400: "#8B87B8",
          600: "#3D4373",
          800: "#232750",
          900: "#1B1F3B",
          950: "#14162B",
        },
        amber: {
          light: "#F5B876",
          DEFAULT: "#F2A65A",
          dark: "#E88A4C",
        },
        teal: {
          light: "#7DD8D4",
          DEFAULT: "#4FBDBA",
          dark: "#379B98",
        },
      },
      boxShadow: {
        bubble: "0 2px 10px rgba(27, 31, 59, 0.08)",
        panel: "0 8px 30px rgba(20, 22, 43, 0.12)",
      },
      keyframes: {
        "wave-dot": {
          "0%, 60%, 100%": { transform: "translateY(0)" },
          "30%": { transform: "translateY(-4px)" },
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "translateY(6px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(79, 189, 186, 0.5)" },
          "100%": { boxShadow: "0 0 0 8px rgba(79, 189, 186, 0)" },
        },
      },
      animation: {
        "wave-dot": "wave-dot 1.2s infinite ease-in-out",
        "pop-in": "pop-in 0.18s ease-out",
        "pulse-ring": "pulse-ring 1.6s infinite",
      },
    },
  },
  plugins: [],
};
