import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Ignorar avisos de TypeScript durante o build
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignorar avisos de TypeScript
        if (warning.code === 'TYPESCRIPT') return
        warn(warning)
      }
    }
  },
  esbuild: {
    // Configurar esbuild para ser mais permissivo
    target: 'es2020',
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
})
