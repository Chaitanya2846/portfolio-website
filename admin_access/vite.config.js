import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,       // This sets the Admin panel to Port 5174
    strictPort: true, // This prevents it from automatically switching to 5173 or 5175
  }
})