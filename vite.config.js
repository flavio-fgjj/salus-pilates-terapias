import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwind()],
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './index.html'
    }
  }
})
