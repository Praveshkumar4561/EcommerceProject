import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { visualizer } from "rollup-plugin-visualizer";
import history from "connect-history-api-fallback";

export default defineConfig({
  plugins: [react({ fastRefresh: true }), svgr(), visualizer({ open: false })],
  server: {
    port: 5173,
    open: true,
    historyApiFallback: true,
    setupMiddlewares(middlewares, { app }) {
      app.use(
        history({
          rewrites: [
            { from: /^\/api\//, to: (ctx) => ctx.parsedUrl.path },
            { from: /^\/themes\//, to: (ctx) => ctx.parsedUrl.path },
          ],
        })
      );
      return middlewares;
    },

    proxy: {
      "/api": {
        target: "http://147.93.45.171:1600",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },

      "/themes": {
        target: "http://srv689968.hstgr.cloud",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/themes/, "/themes"),
      },

      "/upload": {
        target: "http://147.93.45.171:1600",
        changeOrigin: true,
      },
    },
    fs: { strict: false },
  },

  optimizeDeps: {
    esbuildOptions: {
      target: "es2020",
    },
  },

  build: {
    target: "es2020",
    polyfillDynamicImport: false,
  },
});
