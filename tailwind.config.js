/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}",],
  important: true,
  theme: {
    extend: {
      zIndex: {
        '500': '500',
      }
    },
  },
  plugins: [],
}

