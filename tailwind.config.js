/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    darkMode: "class",
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary-color)",
          contrast: "var(--primary-contrast)",
          shade: "var(--primary-shade)",
          tint: "var(--primary-tint)",
        },
        secondary: {
          DEFAULT: "var(--secondary-color)",
          contrast: "var(--secondary-contrast)",
          shade: "var(--secondary-shade)",
          tint: "var(--secondary-tint)",
        },
        tertiary: {
          DEFAULT: "var(--tertiary-color)",
          contrast: "var(--tertiary-contrast)",
          shade: "var(--tertiary-shade)",
          tint: "var(--tertiary-tint)",
        },
        success: {
          DEFAULT: "var(--success-color)",
          contrast: "var(--success-contrast)",
          shade: "var(--success-shade)",
          tint: "var(--success-tint)",
        },
        warning: {
          DEFAULT: "var(--warning-color)",
          contrast: "var(--warning-contrast)",
          shade: "var(--warning-shade)",
          tint: "var(--warning-tint)",
        },
        danger: {
          DEFAULT: "var(--danger-color)",
          contrast: "var(--danger-contrast)",
          shade: "var(--danger-shade)",
          tint: "var(--danger-tint)",
        },
        medium: {
          DEFAULT: "var(--medium-color)",
          contrast: "var(--medium-contrast)",
          shade: "var(--medium-shade)",
          tint: "var(--medium-tint)",
        },
        light: {
          DEFAULT: "var(--light-color)",
          contrast: "var(--light-contrast)",
          shade: "var(--light-shade)",
          tint: "var(--light-tint)",
        },
        dark: {
          DEFAULT: "var(--dark-color)",
          contrast: "var(--dark-contrast)",
          shade: "var(--dark-shade)",
          tint: "var(--dark-tint)",
        },
      },
    },
  },
  plugins: [],
};
