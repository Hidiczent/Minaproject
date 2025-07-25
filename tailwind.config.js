/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // ถ้ามี
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans"', "sans-serif"], // ตั้งค่า default
      },
    },
  },
  plugins: [],
};
