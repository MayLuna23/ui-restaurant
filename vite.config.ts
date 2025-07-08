import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // asegúrate de tener esto
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),         // <-- Necesario para proyectos React
    tailwindcss(),   // <-- Tu plugin actual
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // <-- Alias @ -> src/
    },
  },
})