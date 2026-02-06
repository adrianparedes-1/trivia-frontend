import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/game": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        logLevel: "debug",
      },
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        logLevel: "debug",
      },
      "/auth": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        logLevel: "debug",
        ws: false,
        hostRewrite: false,
      },
    },
  },
});
