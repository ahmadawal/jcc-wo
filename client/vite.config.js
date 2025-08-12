import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    // host: '192.168.10.15', // Enable LAN access
    proxy: {
      '/api': {
        target: 'http://wo-mt.jembo.com:5000',
        changeOrigin: true,
        // rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
}) 