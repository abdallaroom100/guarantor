import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
  
  ],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap:false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@fortawesome/react-fontawesome', 'react-icons']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['../../../yes/CircularSlider']
  },
  server: {
    hmr: true,
    watch: {
      usePolling: true
    },
     proxy: {
      '/user': 'http://localhost:7000',
      '/guarantor': 'http://localhost:7000',
      '/agent': 'http://localhost:7000',
      // لو عندك مسارات تانية أضفها هنا
      // '/api': 'http://localhost:5000'
      '/admin': 'http://localhost:7000'
    }
  }
})
