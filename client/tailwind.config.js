import { last, primary, secondary } from './src/constant/colors';

/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");

export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js',
    "./index.html", "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),


  ],  theme: {
  	extend: {
  		colors: {
  			primary: '#FFFFFFFF',
  			secondary: '#000000FF',
  			last: '#FF6F00FF'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [
    flowbite.plugin(),
      require("tailwindcss-animate")
],
}

