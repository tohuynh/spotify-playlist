/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "spotify-green": "rgb(var(--color-spotify-green) / <alpha-value>)",
        default: "rgb(var(--color-default) / <alpha-value>)",
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        error: "rgb(var(--color-error) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        background: "rgb(var(--color-background) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};
