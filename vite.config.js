import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import ssr from 'vike/plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ssr()],
  resolve: {
    alias: [
      {
        find: '#',
        replacement: fileURLToPath(new URL('./src', import.meta.url))
      }
    ]
  },
  server: {
    proxy: {
      '/api/': {
        target: 'http://127.0.0.1:3000/'
      }
    }
  }
})
