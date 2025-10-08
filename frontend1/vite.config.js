import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { visualizer } from "rollup-plugin-visualizer";
import history from "connect-history-api-fallback";
import path from "path";

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";

  return {
    plugins: [
      react({ fastRefresh: true }),
      svgr(),
      visualizer({ open: false }),
    ],

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
          target: "https://demo.webriefly.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
        "/themes": {
          target: "https://demo.webriefly.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/themes/, "/themes"),
        },
        "/upload": {
          target: "https://demo.webriefly.com",
          changeOrigin: true,
        },
      },

      fs: { strict: false },
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },

    optimizeDeps: {
      esbuildOptions: {
        target: "es2020",
      },
    },

    build: {
      target: "es2020",
      polyfillDynamicImport: false,
      sourcemap: isProduction ? false : true,
      minify: isProduction ? "esbuild" : false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
          },
        },
      },
    },

    define: {
      "process.env": {},
    },

    css: {
      devSourcemap: !isProduction,
    },
  };
});
