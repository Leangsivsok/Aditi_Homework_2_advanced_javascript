/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html', // Include all HTML files in the root directory
    './src/**/*.{html,js,ts,jsx,tsx}', // Adjust based on your project structure
  ],
  theme: {
    extend: {
      // Customize or add to Tailwind's default theme here
    },
  },
  plugins: [],
}