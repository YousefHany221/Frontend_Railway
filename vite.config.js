import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // 🎯 السطر السحري اللي هيصلح الـ CSS في الـ Login والـ Register
})
