/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  corePlugins: {
    // Disable preflight so it doesn't break our existing vanilla CSS
    preflight: false,
  },
  plugins: [],
}
