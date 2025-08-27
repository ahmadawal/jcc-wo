import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    host: "0.0.0.0", // Enable LAN access
    proxy: {
      "/api": {
        target: "http://wo_backend:5000/api",
        changeOrigin: true,
        secure: false,
        credentials: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
