import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Прослушивать все интерфейсы
    port: 5173,      // Убедитесь, что порт соответствует вашему
    proxy: {
      '/api': {
        target: 'http://localhost:3005/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});