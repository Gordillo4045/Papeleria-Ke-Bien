import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  //base: 'https://gordillo4045.github.io/Papeleria-Ke-Bien/'
})
