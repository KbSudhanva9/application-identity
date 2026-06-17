import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5173,
    proxy: {
      // Intercepts any request starting with /api
      '/api': {
        target: 'http://localhost:8080', // Your Spring Boot port
        changeOrigin: true,             // Changes origin headers to match target
        rewrite: (path) => path.replace(/^\/api/, ''), // Strips /api prefix before forwarding
      },
    },
  },
})
