import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isDev = command === 'serve'

  return {
    plugins: [react()],
    server: {
      host: true,
      port: 3000,
      // Cho phép mọi host truy cập (kể cả proton.elripley.com)
      allowedHosts: true,
      // Proxy chỉ dùng trong dev, không dùng trong build/preview (docker)
      proxy: isDev
        ? {
            '/api': {
              target: 'http://localhost:8000',
              changeOrigin: true,
            },
            '/health': {
              target: 'http://localhost:8000',
              changeOrigin: true,
            },
          }
        : undefined,
    },
    preview: {
      host: true,
      port: 3000,
      // Cho phép mọi host truy cập (kể cả proton.elripley.com)
      allowedHosts: true,
    },
  }
})
