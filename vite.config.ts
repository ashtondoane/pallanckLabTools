import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/pallanckLabTools/",
  plugins: [react()],
  root: '',
  build: {
    outDir: 'build',
    emptyOutDir: true, // also necessary
  }
})
