import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/private-radio-podcast/',
  server: {
    host: true,
    port: 5173,
  },
})
