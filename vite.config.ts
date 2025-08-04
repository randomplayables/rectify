import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      allowedHosts: ['.loca.lt'],
      proxy: {
        '/api': {
          target: 'http://172.31.12.157:3000', // Proxy to your randomplayables backend
          changeOrigin: true,
        }
      }
    }
  };

  if (command === 'build') {
    (config as any).build = {
      esbuild: {
        drop: ['console', 'debugger'],
      },
    };
  }

  return config;
})