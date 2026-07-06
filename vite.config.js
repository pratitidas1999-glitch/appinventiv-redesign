import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base defaults to '/' (root hosts like Netlify/Vercel or a local build).
// The GitHub Pages workflow sets VITE_BASE=/<repo>/ so project-site URLs work.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  server: { port: 5180, open: false },
})
