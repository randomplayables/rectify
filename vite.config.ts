// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:3000', // Proxy to your randomplayables backend
//         changeOrigin: true,
//       }
//     }
//   }
// })





import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
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
})