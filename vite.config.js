import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const page = (p) => fileURLToPath(new URL(p, import.meta.url))

// base './' deixa o build funcionar em qualquer pasta/domínio (hospedagem estática)
// duas páginas: a LP (index.html) e a de obrigado (obrigado/index.html → /obrigado/)
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      input: {
        main: page('./index.html'),
        obrigado: page('./obrigado/index.html'),
      },
    },
  },
})
