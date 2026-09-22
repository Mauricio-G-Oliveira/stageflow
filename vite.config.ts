import fs from 'node:fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/stageflow/',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'copy-404-for-github-pages',
      closeBundle() {
        if (fs.existsSync('dist/index.html')) {
          fs.copyFileSync('dist/index.html', 'dist/404.html')
        }
      },
    },
  ],
})
