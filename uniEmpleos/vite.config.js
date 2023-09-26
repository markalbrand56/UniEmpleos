import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  addModulePathsToTranspile: ["react-quilljs"],
  plugins: [react()],
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "./src") },
      {
        find: "@components",
        replacement: path.resolve(__dirname, "./src/components"),
      },
      { find: "@pages", replacement: path.resolve(__dirname, "./src/pages") },
      { find: "@store", replacement: path.resolve(__dirname, "./src/store") },
      { find: "@hooks", replacement: path.resolve(__dirname, "./src/hooks") },
    ],
  },
})
