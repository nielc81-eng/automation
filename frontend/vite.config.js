// vite.config.js
// 💡 What is this file?
// Vite's configuration file. We add the Tailwind plugin here so that
// Tailwind CSS v4 is processed automatically during development and build.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
