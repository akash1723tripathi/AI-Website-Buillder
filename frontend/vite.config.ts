import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 7000,
    strictPort: true,
    force: true, // Force optimization
  },
  optimizeDeps: {
    force: true, // Force re-optimization
  },
  cacheDir: '.vite-cache', // Use custom cache directory
})