import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Split large libraries into their own chunks for better caching.
    rollupOptions: {
      output: {
        manualChunks: {
          // React core + router stay together (always needed).
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI helpers grouped into one callable-by-lazy-loads chunk.
          'ui-vendor': ['react-hot-toast', 'recharts'],
        },
      },
    },
    // Raise the warning limit so legitimately large vendor chunks don't spam us,
    // but still warn on anything egregious.
    chunkSizeWarningLimit: 600,
  },
})