import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', //啟用可透過iP地址訪問的開關
    port: 3334,
    // open: true,
    cors: true,
    proxy: {
      '/graphql': 'http://localhost:3000'
    }
  },
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve('./src')
      }
    ],
  },

})
