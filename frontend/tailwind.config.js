

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Add flowbite
    "./node_modules/flowbite/**/*.js",
    './node_modules/flowbite-react/lib/**/*.js',
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2979FF',
          50: '#E3F2FD',
          100: '#BBDEFB', 
          200: '#90CAF9',
          300: '#64B5F6',
          400: '#42A5F5',
          500: '#2979FF', // Your primary color
          600: '#1E88E5',
          700: '#1976D2',
          800: '#1565C0',
          900: '#0D47A1',
        },
        // Custom dark mode colors
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'], // Your custom font
      },
      // Add custom dark mode shadows
      boxShadow: {
        'dark-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        'dark-md': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
        'dark-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
      }
    },
  },
  plugins: [
    // Add Flowbite plugin
    require('flowbite/plugin'),
    require('tailwind-scrollbar'),
  ],
}