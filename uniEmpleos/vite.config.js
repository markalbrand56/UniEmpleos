import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@store", replacement: path.resolve(__dirname, "./src/store") },
      { find: "@hooks", replacement: path.resolve(__dirname, "./src/hooks") },
    ],
  },
})
