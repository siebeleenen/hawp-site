/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hawp-blue': '#0066FF',
        'hawp-cyan': '#00D4FF',
      },
    },
  },
  plugins: [],
}
