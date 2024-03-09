import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    host: "0.0.0.0",
    proxy: {
      "/api/": {
        target: "http://localhost:5000",
        changeOrigin: true,
      }
    }
  },
  plugins: [react()],
})
