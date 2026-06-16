import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
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
