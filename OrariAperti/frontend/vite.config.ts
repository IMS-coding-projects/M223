import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "localhost",  // Change the host to localhost or 127.0.0.1
    port: 3000,         // Or any other port if 5173 is conflicting
    strictPort: true,   // Ensure Vite doesn't pick another port if 5173 is taken
  }
})
